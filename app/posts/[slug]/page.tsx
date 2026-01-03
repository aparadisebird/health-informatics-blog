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

  if (loading) return <div className="p-20 text-center text-slate-500">Loading analysis...</div>;
  if (!post) return <div className="p-20 text-center">Post not found.</div>;

  return (
    <main className="min-h-screen bg-white">
      <nav className="p-6 border-b border-slate-100">
        <Link href="/" className="text-teal-700 font-bold">← Back to The Health Nexus</Link>
      </nav>

      <article className="max-w-3xl mx-auto py-20 px-6">
        <span className="text-teal-600 font-bold uppercase tracking-widest text-sm">{post.category}</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-4 mb-8 leading-tight">
          {post.title}
        </h1>
        
        {post.imageUrl && (
          <img src={post.imageUrl} alt={post.title} className="w-full h-96 object-cover rounded-3xl mb-10 shadow-lg" />
        )}

        <div className="prose prose-lg text-slate-700 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
      </article>
    </main>
  );
}
