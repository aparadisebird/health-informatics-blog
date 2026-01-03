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
  orderBy 
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
      if (!user) router.push("/login");
      else { 
        fetchPosts(); 
        setLoading(false); 
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchPosts = async () => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Automatic Slug Generation
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const postData: any = {
      title,
      category,
      imageUrl: image,
      content,
      slug,
      updatedAt: serverTimestamp(),
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "posts", editingId), postData);
        alert("Story Updated Successfully!");
      } else {
        // Automatically adds the createdAt timestamp on new posts
        await addDoc(collection(db, "posts"), {
          ...postData,
          createdAt: serverTimestamp(),
        });
        alert("New Story Published!");
      }
      resetForm();
      fetchPosts();
      setTab("manage");
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  const deletePost = async (id: string) => {
    if (confirm("Are you sure you want to delete this story? This cannot be undone.")) {
      await deleteDoc(doc(db, "posts", id));
      fetchPosts();
    }
  };

  const startEdit = (post: any) => {
    setEditingId(post.id);
    setTitle(post.title);
    setCategory(post.category);
    setImage(post.imageUrl);
    setContent(post.content);
    setTab("create");
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setCategory("");
    setImage("");
    setContent("");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-teal-600 font-black animate-pulse tracking-widest uppercase">Initializing Nexus Admin...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Nexus Admin Panel</h1>
            <p className="text-slate-500 text-sm font-medium">Manage your informatics research and stories.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-slate-600 hover:text-teal-600 font-bold text-sm transition">View Website</Link>
            <button onClick={() => auth.signOut()} className="px-5 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-xs hover:bg-red-600 hover:text-white transition">Logout</button>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex gap-3 mb-10 bg-white p-2 rounded-2xl border border-slate-200 w-fit">
          <button 
            onClick={() => {setTab("manage"); resetForm();}} 
            className={`px-8 py-2.5 rounded-xl font-bold text-sm transition ${tab==='manage'?'bg-slate-900 text-white shadow-lg':'text-slate-500 hover:bg-slate-50'}`}
          >
            Manage Library
          </button>
          <button 
            onClick={() => setTab("create")} 
            className={`px-8 py-2.5 rounded-xl font-bold text-sm transition ${tab==='create'?'bg-teal-600 text-white shadow-lg':'text-slate-500 hover:bg-slate-50'}`}
          >
            {editingId ? "Edit Story" : "Write New Story"}
          </button>
        </div>

        {/* Tab Content */}
        {tab === "manage" ? (
          <div className="grid gap-4">
            {posts.length === 0 && <div className="p-10 text-center text-slate-400 italic bg-white rounded-3xl border border-dashed">No stories found. Start by writing your first one!</div>}
            {posts.map(p => (
              <div key={p.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0">
                    {p.imageUrl && <img src={p.imageUrl} className="w-full h-full object-cover" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-tight">{p.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] text-teal-600 uppercase font-black tracking-widest px-2 py-0.5 bg-teal-50 rounded-md">{p.category}</span>
                      <span className="text-[9px] text-slate-400 font-bold">
                        {p.createdAt ? new Date(p.createdAt.seconds * 1000).toLocaleDateString() : 'Draft'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <button onClick={()=>startEdit(p)} className="flex-1 md:flex-none px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-teal-600 transition">Edit</button>
                  <button onClick={()=>deletePost(p.id)} className="flex-1 md:flex-none px-6 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-xs hover:bg-red-600 hover:text-white transition">Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-slate-100 space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Story Details</label>
              <div className="grid md:grid-cols-2 gap-4">
                <input className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-teal-500 outline-none transition font-bold text-slate-900" placeholder="Catchy Story Title" value={title} onChange={e=>setTitle(e.target.value)} required />
                <input className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-teal-500 outline-none transition font-bold text-slate-900" placeholder="Category (e.g. AI in Health)" value={category} onChange={e=>setCategory(e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Visuals</label>
              <input className="w-full p-5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-teal-500 outline-none transition text-slate-600 text-sm" placeholder="Paste Featured Image URL here" value={image} onChange={e=>setImage(e.target.value)} />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Story Content</label>
              <div className="rounded-3xl overflow-hidden border-2 border-slate-100">
                <Editor
                  apiKey="q1pibeckxw15ffl3jf95s9pi3bbmsoq7m49bmbzwcqyrxxtc"
                  init={{
                    height: 600,
                    menubar: true,
                    plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'],
                    toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | table help',
                    content_style: 'body { font-family:Inter, sans-serif; font-size:16px; color: #334155; line-height: 1.6; }'
                  }}
                  value={content}
                  onEditorChange={(newContent) => setContent(newContent)}
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-xl hover:bg-teal-600 transition-all shadow-xl shadow-slate-200 active:scale-[0.98]">
              {editingId ? "Update Story" : "Launch Story to Feed"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
