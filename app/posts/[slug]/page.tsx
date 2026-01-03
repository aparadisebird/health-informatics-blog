"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function PostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const q = query(collection(db, "posts"), where("slug", "==", slug));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) setPost(querySnapshot.docs[0].data());
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  if (loading) return <div className="p-20 text-center">Loading...</div>;
  if (!post) return <div className="p-20 text-center">Not found.</div>;

  return (
    <main className="min-h-screen bg-white pb-20">
      <nav className="p-4 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-3xl mx-auto"><Link href="/" className="text-teal-700 font-bold">← HealthNexus</Link></div>
      </nav>
      <article className="max-w-3xl mx-auto pt-16 px-6">
        <span className="bg-teal-50 text-teal-700 font-black uppercase tracking-widest text-[10px] px-3 py-1 rounded-full">{post.category}</span>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-6 mb-8">{post.title}</h1>
        {post.imageUrl && <img src={post.imageUrl} className="w-full rounded-[2rem] mb-10 shadow-xl" />}
        <div 
          className="prose prose-lg prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-black prose-p:text-slate-600 prose-strong:text-slate-900 prose-a:text-teal-600 font-medium"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
        <div className="mt-20 pt-10 border-t border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden"><img src="https://i.postimg.cc/0jWxqG12/Chat-GPT-Image-Dec-17-2025-01-42-38-PM.png" className="object-cover h-full w-full" /></div>
          <div><p className="text-sm font-bold italic">Shifat Shahriar Siam</p><p className="text-xs text-slate-500">Public Health & Informatics | JU</p></div>
        </div>
      </article>
    </main>
  );
}