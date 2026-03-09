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
        alert("Update Successful!");
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
        alert("Published Successfully!");
      }
      resetForm();
      fetchPosts();
      setTab("manage");
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  const deletePost = async (id: string) => {
    if (confirm("Delete this item permanently?")) {
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

  const formatDate = (createdAt: any) => {
    if (!createdAt) return "Draft";
    const date = createdAt instanceof Timestamp ? createdAt.toDate() : new Date(createdAt.seconds * 1000);
    return date.toLocaleDateString();
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-teal-600 tracking-widest">
      LOADING NEXUS ADMIN...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-900">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
             <h1 className="text-3xl font-black tracking-tighter">Nexus Admin</h1>
             <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Content Management System</p>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/" className="text-sm font-bold text-slate-500 hover:text-teal-600 transition">Site Home</Link>
            <button onClick={() => auth.signOut()} className="bg-red-50 text-red-600 px-5 py-2 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition">Logout</button>
          </div>
        </div>
        
        <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-2xl border border-slate-200 w-fit">
          <button onClick={() => { setTab("manage"); resetForm(); }} className={`px-8 py-2.5 rounded-xl font-bold text-sm transition ${tab==='manage'?'bg-slate-900 text-white shadow-lg':'text-slate-500'}`}>Manage</button>
          <button onClick={() => setTab("create")} className={`px-8 py-2.5 rounded-xl font-bold text-sm transition ${tab==='create'?'bg-teal-600 text-white shadow-lg':'text-slate-500'}`}>{editingId ? "Edit Item" : "New Entry"}</button>
        </div>

        {tab === "manage" ? (
          <div className="grid gap-4">
            {posts.map(p => (
              <div key={p.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 flex justify-between items-center shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-50">
                    <img src={p.imageUrl || "https://placehold.co/100"} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-tight mb-1">{p.title}</h3>
                    <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${p.category === 'Project' ? 'bg-amber-100 text-amber-700' : 'bg-teal-50 text-teal-600'}`}>
                            {p.category}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400">{formatDate(p.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>startEdit(p)} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-teal-600 transition">Edit</button>
                  <button onClick={()=>deletePost(p.id)} className="px-5 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold text-xs hover:bg-red-600 hover:text-white transition">Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-100 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Entry Title</label>
                <input className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-teal-500 outline-none font-bold transition" placeholder="e.g. Chronic Kidney Disease ML" value={title} onChange={e=>setTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Category (Type 'Project' for Projects Page)</label>
                <input 
                  list="categories"
                  className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-teal-500 outline-none font-bold transition" 
                  placeholder="Select or Type..." 
                  value={category} 
                  onChange={e=>setCategory(e.target.value)} 
                  required 
                />
                <datalist id="categories">
                  <option value="Project" />
                  <option value="Research" />
                  <option value="Informatics" />
                  <option value="Public Awareness" />
                </datalist>
              </div>
            </div>
            
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Featured Image URL</label>
                <input className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-teal-500 outline-none text-sm transition" placeholder="https://image-link.com/photo.jpg" value={image} onChange={e=>setImage(e.target.value)} />
            </div>

            <div className="rounded-2xl overflow-hidden border-2 border-slate-50">
              <Editor
                apiKey="q1pibeckxw15ffl3jf95s9pi3bbmsoq7m49bmbzwcqyrxxtc"
                value={content}
                onEditorChange={(newContent) => setContent(newContent)}
                init={{
                  height: 550,
                  menubar: true,
                  plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'code', 'table', 'wordcount', 'fullscreen', 'media'],
                  toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist | table link image | removeformat code fullscreen',
                  content_style: 'body { font-family:Inter,sans-serif; font-size:16px; color: #334155; line-height: 1.6; }'
                }}
              />
            </div>

            <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-lg hover:bg-teal-600 transition-all shadow-xl shadow-slate-200">
              {editingId ? "Update Entry" : "Publish to Platform"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
