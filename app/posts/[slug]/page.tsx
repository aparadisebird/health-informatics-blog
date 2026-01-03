"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useParams } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function PostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const q = query(collection(db, "posts"), where("slug", "==", slug));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setPost(querySnapshot.docs[0].data());
      }
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
       <div className="animate-pulse text-teal-600 font-bold tracking-widest uppercase">Fetching Research...</div>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-6">
      <Logo className="h-20 w-auto mb-6" />
      <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">Publication Not Found</h2>
      <Link href="/" className="mt-4 text-teal-600 font-bold hover:underline">Return to Home</Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-white pb-24">
      {/* Navigation - Matching Homepage Styling */}
      <nav className="p-4 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Logo className="h-12 md:h-16 w-auto" />
          <Link href="/" className="text-teal-700 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all">
            <span>←</span> <span className="hidden sm:inline">Back to</span> Feed
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto pt-16 px-6">
        {/* Category & Title */}
        <div className="mb-10 text-center md:text-left">
          <span className="bg-teal-50 text-teal-700 font-black uppercase tracking-widest text-[10px] px-4 py-2 rounded-full border border-teal-100">
            {post.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-8 mb-6 leading-tight tracking-tight">
            {post.title}
          </h1>
          <div className="h-1.5 w-20 bg-teal-500 rounded-full mx-auto md:mx-0"></div>
        </div>
        
        {/* Featured Image */}
        {post.imageUrl && (
          <div className="mb-12 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-auto object-cover max-h-[500px]" 
            />
          </div>
        )}

        {/* Content Area - Enhanced for TinyMCE Tables & Styles */}
        <div 
          className="prose prose-lg prose-slate max-w-none 
          prose-headings:text-slate-900 prose-headings:font-black 
          prose-p:text-slate-600 prose-p:leading-relaxed 
          prose-strong:text-slate-900 prose-strong:font-bold
          prose-a:text-teal-600 prose-a:font-bold
          prose-table:border prose-table:rounded-xl prose-th:bg-slate-50 prose-th:p-4 prose-td:p-4
          font-medium"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
        
        {/* Author Bio Footer */}
        <div className="mt-20 pt-10 border-t border-slate-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-teal-100 shadow-md transform rotate-3">
             <img src="https://i.postimg.cc/0jWxqG12/Chat-GPT-Image-Dec-17-2025-01-42-38-PM.png" alt="Siam" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-black text-slate-900 italic">Authored by Shifat Shahriar Siam</p>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Public Health & Informatics Specialist</p>
          </div>
        </div>
      </article>
    </main>
  );
}
