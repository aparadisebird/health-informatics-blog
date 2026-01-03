"use client";
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Import Rich Text Editor dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

export default function AdminDashboard() {
  const [posts, setPosts] = useState<any[]>([]);
  const [tab, setTab] = useState("manage"); // 'manage' or 'create'
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form States
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
    const postData = {
      title,
      category,
      imageUrl: image,
      content,
      updatedAt: serverTimestamp(),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "posts", editingId), postData);
        alert("Post updated!");
      } else {
        await addDoc(collection(db, "posts"), { ...postData, createdAt: serverTimestamp() });
        alert("Post published!");
      }
      resetForm();
      fetchPosts();
      setTab("manage");
    } catch (error) { alert(error); }
  };

  const deletePost = async (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
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
    setTitle(""); setCategory(""); setImage(""); setContent("");
  };

  if (loading) return <div className="p-20 text-center">Authenticating...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-slate-900">Nexus Control</h1>
          <button onClick={() => auth.signOut()} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold">Logout</button>
        </div>

        {/* Tab Logic */}
        <div className="flex gap-4 mb-8">
          <button onClick={() => { setTab("manage"); resetForm(); }} className={`px-6 py-2 rounded-full font-bold transition ${tab === 'manage' ? 'bg-teal-600 text-white' : 'bg-white text-slate-600 border'}`}>Manage Posts</button>
          <button onClick={() => setTab("create")} className={`px-6 py-2 rounded-full font-bold transition ${tab === 'create' ? 'bg-teal-600 text-white' : 'bg-white text-slate-600 border'}`}>
            {editingId ? "Editing Post" : "Create New Post"}
          </button>
        </div>

        {tab === "manage" ? (
          <div className="grid gap-4">
            {posts.map(post => (
              <div key={post.id} className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-800">{post.title}</h3>
                  <p className="text-xs text-teal-600 uppercase font-bold">{post.category}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => startEdit(post)} className="p-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold">Edit</button>
                  <button onClick={() => deletePost(post.id)} className="p-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold">Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-[2rem] shadow-xl">
            <input className="w-full p-4 border-b text-2xl font-bold outline-none focus:border-teal-500" placeholder="Post Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <input className="w-full p-4 border-b outline-none focus:border-teal-500" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
            <input className="w-full p-4 border-b outline-none focus:border-teal-500" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
            
            <div className="h-96 mb-12">
              <ReactQuill theme="snow" value={content} onChange={setContent} className="h-full rounded-2xl" 
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'blockquote'],
                    [{'list': 'ordered'}, {'list': 'bullet'}],
                    ['link', 'clean']
                  ],
                }}
              />
            </div>
            
            <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-teal-600 transition-all mt-10">
              {editingId ? "Update Publication" : "Publish to Nexus"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}