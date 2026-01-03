"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  content: string;
  slug: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(postsData);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <nav className="p-6 flex justify-between items-center bg-white border-b border-slate-100 sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-teal-700 tracking-tight">The Health Nexus</h1>
        <div className="space-x-8 font-medium text-slate-600">
          <Link href="/" className="hover:text-teal-600 transition">Home</Link>
          <Link href="/login" className="hover:text-teal-600 transition">Admin Login</Link>
        </div>
      </nav>

      <header className="max-w-5xl mx-auto pt-20 pb-16 px-6 text-center">
        <span className="bg-teal-100 text-teal-800 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">Public Health & Informatics</span>
        <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 mt-6 leading-tight">
          Bridging the gap between <br />
          <span className="text-teal-600">Data and Well-being.</span>
        </h2>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-10">
        <h3 className="text-3xl font-bold text-slate-800 mb-10">Latest Publications</h3>
        
        {loading ? (
          <p className="text-center text-slate-500">Retrieving research data...</p>
        ) : (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                {post.imageUrl && (
                  <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                )}
                <div className="p-8">
                  <span className="text-teal-600 text-sm font-bold uppercase">{post.category}</span>
                  <h4 className="text-xl font-bold text-slate-800 mt-2 mb-4 leading-snug">{post.title}</h4>
                  <p className="text-slate-600 line-clamp-3 mb-6">{post.content}</p>
                  <Link href={`/posts/${post.slug}`}>
  <button className="text-teal-700 font-bold hover:text-teal-800">Read Analysis →</button>
</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

