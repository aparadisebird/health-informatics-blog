"use client";
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/login");
      else setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "posts"), {
        title,
        category,
        imageUrl: image,
        content,
        createdAt: serverTimestamp(),
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      });
      alert("Success! Post published to The Health Nexus.");
      setTitle(""); setCategory(""); setImage(""); setContent("");
    } catch (error) {
      alert("Error: " + error);
    }
  };

  if (loading) return <div className="p-10 text-center">Authenticating...</div>;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">New Publication</h1>
          <button onClick={() => auth.signOut()} className="text-red-500 hover:underline">Logout</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 bg-slate-50 p-8 rounded-3xl border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input 
              className="p-4 border rounded-xl outline-none focus:border-teal-500" 
              placeholder="Article Title" 
              value={title} onChange={(e) => setTitle(e.target.value)} required
            />
            <input 
              className="p-4 border rounded-xl outline-none focus:border-teal-500" 
              placeholder="Category (e.g., Epidemiology)" 
              value={category} onChange={(e) => setCategory(e.target.value)} required
            />
          </div>
          <input 
            className="w-full p-4 border rounded-xl outline-none focus:border-teal-500" 
            placeholder="Image URL (Link from Unsplash or similar)" 
            value={image} onChange={(e) => setImage(e.target.value)} 
          />
          <textarea 
            className="w-full p-4 border rounded-xl h-80 outline-none focus:border-teal-500" 
            placeholder="Write your research summary or article here..." 
            value={content} onChange={(e) => setContent(e.target.value)} required
          />
          <button type="submit" className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-teal-700 transition-all">
            Publish Post
          </button>
        </form>
      </div>
    </div>
  );
}