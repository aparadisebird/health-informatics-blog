"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Post {
  title: string;
  category: string;
  imageUrl: string;
  content: string;
}

export default function PostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const q = query(collection(db, "posts"), where("slug", "==", slug));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setPost(querySnapshot.docs[0].data() as Post);
      }
      setLoading(false);
    };
    fetchPost();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
       <div className="animate-pulse text-teal-600 font-bold tracking-widest uppercase">Analyzing Data...</div>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h2 className="text-2xl font-bold text-slate-800">Research Not Found</h2>
      <Link href="/" className="mt-4 text-teal-600 font-bold underline">Return Home</Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-white pb-24">
      {/* Dynamic Navigation */}
      <nav className="p-4 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto w-full flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-black text-sm group-hover:bg-slate-900 transition-colors">N</div>
            <span className="text-teal-700 font-bold flex items-center gap-2">
              <span className="hidden md:inline">← Back to</span> HealthNexus
            </span>
          </Link>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto pt-16 px-6">
        {/* Category & Title */}
        <div className="mb-10">
          <span className="bg-teal-50 text-teal-700 font-black uppercase tracking-widest text-[10px] px-4 py-2 rounded-full border border-teal-100">
            {post.category}
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mt-8 mb-6 leading-[1.1] tracking-tight">
            {post.title}
          </h1>
          <div className="h-1 w-20 bg-teal-500 rounded-full"></div>
        </div>
        
        {/* Featured Image */}
        {post.imageUrl && (
          <div className="mb-12 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-auto object-cover max-h-[500px]" 
            />
          </div>
        )}

        {/* Rich Text Content Rendering */}
        <div 
          className="prose prose-lg prose-slate max-w-none 
          prose-headings:text-slate-900 prose-headings:font-black 
          prose-p:text-slate-600 prose-p:leading-relaxed 
          prose-strong:text-slate-900 prose-strong:font-bold
          prose-li:text-slate-600
          prose-a:text-teal-600 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
          custom-html-content font-medium"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
      </article>

      {/* Mini-Bio Footer for the post */}
      <div className="max-w-3xl mx-auto mt-20 px-6 pt-10 border-t border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-teal-100">
             <img src="https://i.postimg.cc/0jWxqG12/Chat-GPT-Image-Dec-17-2025-01-42-38-PM.png" alt="Siam" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 italic">Authored by Shifat Shahriar Siam</p>
            <p className="text-xs text-slate-500">Public Health & Informatics | Jahangirnagar University</p>
          </div>
        </div>
      </div>
    </main>
  );
}