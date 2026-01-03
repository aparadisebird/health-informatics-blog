"use client";
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc, 
  serverTimestamp, 
  query, 
  orderBy,
  Timestamp 
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Editor } from "@tinymce/tinymce-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [posts, setPosts] = useState<any[]>([]);
  const [tab, setTab] = useState("manage");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else { 
        fetchPosts(); 
        setLoading(false); 
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    try {
      if (editingId) {
        const postData = {
          title,
          category,
          imageUrl: image,
          content,
          slug,
          updatedAt: serverTimestamp(),
        };
        await updateDoc(doc(db, "posts", editingId), postData);
        alert("Story Updated!");
      } else {
        await addDoc(collection(db, "posts"), {
          title,
          category,
          imageUrl: image,
          content,
          slug,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        alert("Published!");
      }
      resetForm();
      fetchPosts();
      setTab("manage");
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  const deletePost = async (id: string) => {
    if (confirm("Delete this story?")) {
      await deleteDoc(doc(db, "posts", id));
      fetchPosts();
    }
  };

  const startEdit = (post: any) => {
    setEditingId(post.id);
    setTitle(post.title || "");
    setCategory(post.category || "");
    setImage(post.imageUrl || "");
    setContent(post.content || "");
    setTab("create");
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setCategory("");
    setImage("");
    setContent("");
  };

  // Safe date formatter for the build process
  const formatDate = (createdAt: any) => {
    if (!createdAt) return "Draft";
    const date = createdAt instanceof Timestamp ? createdAt.toDate() : new Date(createdAt.seconds * 1000);
    return date.toLocaleDateString();
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-teal-600">
      INITIALIZING NEXUS ADMIN...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-900">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black tracking-tighter">Nexus Admin</h1>
          <div className="flex gap-4 items-center">
            <Link href="/" className="text-sm font-bold text-slate-500 hover:text-teal-600">Site Home</Link>
            <button onClick={() => auth.signOut()} className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-bold">Logout</button>
          </div>
        </div>
        
        <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-2xl border border-slate-200 w-fit">
          <button onClick={() => setTab("manage")} className={`px-6 py-2 rounded-xl font-bold text-sm ${tab==='manage'?'bg-slate-900 text-white':'text-slate-500'}`}>Manage</button>
          <button onClick={() => setTab("create")} className={`px-6 py-2 rounded-xl font-bold text-sm ${tab==='create'?'bg-teal-600 text-white':'text-slate-500'}`}>New Story</button>
        </div>

        {tab === "manage" ? (
          <div className="grid gap-4">
            {posts.map(p => (
              <div key={p.id} className="bg-white p-5 rounded-3xl border border-slate-200 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={p.imageUrl || "https://placehold.co/100"} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-tight">{p.title}</h3>
                    <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">{p.category} • {formatDate(p.createdAt)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>startEdit(p)} className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs">Edit</button>
                  <button onClick={()=>deletePost(p.id)} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-xs">Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <input className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
              <input className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold" placeholder="Category" value={category} onChange={e=>setCategory(e.target.value)} required />
            </div>
            <input className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none text-sm" placeholder="Image URL" value={image} onChange={e=>setImage(e.target.value)} />
            <div className="rounded-2xl overflow-hidden border border-slate-100">
              <Editor
                apiKey="q1pibeckxw15ffl3jf95s9pi3bbmsoq7m49bmbzwcqyrxxtc"
                value={content}
                onEditorChange={(newContent) => setContent(newContent)}
                init={{
                  height: 500,
                  menubar: false,
                  plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'code', 'table', 'wordcount'],
                  toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist | removeformat | table code',
                  content_style: 'body { font-family:Inter,sans-serif; font-size:16px }'
                }}
              />
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-teal-600 transition-all">
              {editingId ? "Update Publication" : "Launch to Nexus Feed"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
