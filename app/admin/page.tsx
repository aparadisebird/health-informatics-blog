"use client";
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Editor } from "@tinymce/tinymce-react"; // New Import

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
      else { fetchPosts(); setLoading(false); }
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
    const postData = {
      title, category, imageUrl: image, content,
      updatedAt: serverTimestamp(),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    };
    try {
      if (editingId) { await updateDoc(doc(db, "posts", editingId), postData); alert("Updated!"); }
      else { await addDoc(collection(db, "posts"), { ...postData, createdAt: serverTimestamp() }); alert("Published!"); }
      resetForm(); fetchPosts(); setTab("manage");
    } catch (error) { alert(error); }
  };

  const deletePost = async (id: string) => {
    if (confirm("Delete this post?")) { await deleteDoc(doc(db, "posts", id)); fetchPosts(); }
  };

  const startEdit = (post: any) => {
    setEditingId(post.id); setTitle(post.title); setCategory(post.category);
    setImage(post.imageUrl); setContent(post.content); setTab("create");
  };

  const resetForm = () => { setEditingId(null); setTitle(""); setCategory(""); setImage(""); setContent(""); };

  if (loading) return <div className="p-20 text-center font-bold text-teal-600">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-slate-900">Nexus Admin</h1>
          <button onClick={() => auth.signOut()} className="text-red-600 font-bold">Logout</button>
        </div>
        
        <div className="flex gap-4 mb-8">
          <button onClick={() => {setTab("manage"); resetForm();}} className={`px-6 py-2 rounded-full font-bold transition ${tab==='manage'?'bg-teal-600 text-white':'bg-white border text-slate-600'}`}>Manage Posts</button>
          <button onClick={() => setTab("create")} className={`px-6 py-2 rounded-full font-bold transition ${tab==='create'?'bg-teal-600 text-white':'bg-white border text-slate-600'}`}>{editingId?"Edit Publication":"New Publication"}</button>
        </div>

        {tab === "manage" ? (
          <div className="grid gap-4">
            {posts.map(p => (
              <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
                <div>
                  <h3 className="font-bold text-slate-900">{p.title}</h3>
                  <p className="text-xs text-teal-600 uppercase font-black tracking-widest">{p.category}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={()=>startEdit(p)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs hover:bg-teal-50 hover:text-teal-700 transition">Edit</button>
                  <button onClick={()=>deletePost(p.id)} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-xs hover:bg-red-600 hover:text-white transition">Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <input className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-teal-500 font-bold" placeholder="Article Title" value={title} onChange={e=>setTitle(e.target.value)} required />
              <input className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-teal-500 font-bold" placeholder="Category (e.g. Research)" value={category} onChange={e=>setCategory(e.target.value)} required />
            </div>
            <input className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-teal-500" placeholder="Featured Image URL" value={image} onChange={e=>setImage(e.target.value)} />
            
            {/* TinyMCE Editor Integration */}
            <div className="rounded-2xl overflow-hidden border border-slate-200">
              <Editor
                apiKey="q1pibeckxw15ffl3jf95s9pi3bbmsoq7m49bmbzwcqyrxxtc"
                init={{
                  height: 500,
                  menubar: true,
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                  ],
                  toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | table help',
                  content_style: 'body { font-family:Inter,Helvetica,Arial,sans-serif; font-size:16px }'
                }}
                value={content}
                onEditorChange={(newContent) => setContent(newContent)}
              />
            </div>

            <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-teal-600 transition-all shadow-lg shadow-slate-200">
              {editingId ? "Update Research Analysis" : "Publish to HealthNexus"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}