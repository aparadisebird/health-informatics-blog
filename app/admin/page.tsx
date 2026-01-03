"use client";
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

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

  if (loading) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-slate-900">Nexus Admin</h1>
          <button onClick={() => auth.signOut()} className="text-red-600 font-bold">Logout</button>
        </div>
        <div className="flex gap-4 mb-8">
          <button onClick={() => {setTab("manage"); resetForm();}} className={`px-6 py-2 rounded-full font-bold ${tab==='manage'?'bg-teal-600 text-white':'bg-white border'}`}>Manage</button>
          <button onClick={() => setTab("create")} className={`px-6 py-2 rounded-full font-bold ${tab==='create'?'bg-teal-600 text-white':'bg-white border'}`}>{editingId?"Edit Post":"New Post"}</button>
        </div>
        {tab === "manage" ? (
          <div className="grid gap-4">{posts.map(p => (
            <div key={p.id} className="bg-white p-4 rounded-xl border flex justify-between items-center">
              <div><h3 className="font-bold">{p.title}</h3><p className="text-xs text-teal-600 uppercase font-bold">{p.category}</p></div>
              <div className="flex gap-2"><button onClick={()=>startEdit(p)} className="px-3 py-1 bg-blue-50 text-blue-600 rounded font-bold text-sm">Edit</button>
              <button onClick={()=>deletePost(p.id)} className="px-3 py-1 bg-red-50 text-red-600 rounded font-bold text-sm">Delete</button></div>
            </div>
          ))}</div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-lg space-y-4">
            <input className="w-full p-3 border-b text-xl font-bold outline-none" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
            <input className="w-full p-3 border-b outline-none" placeholder="Category" value={category} onChange={e=>setCategory(e.target.value)} required />
            <input className="w-full p-3 border-b outline-none" placeholder="Image URL" value={image} onChange={e=>setImage(e.target.value)} />
            <div className="h-80 mb-12"><ReactQuill theme="snow" value={content} onChange={setContent} className="h-full" /></div>
            <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-teal-600 transition-all mt-10">Save Publication</button>
          </form>
        )}
      </div>
    </div>
  );
}