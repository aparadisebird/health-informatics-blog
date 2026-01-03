"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import Link from 'next/link';
import Logo from "@/components/Logo";

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
      {/* Navigation */}
      <nav className="p-4 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Logo className="h-14 md:h-16 w-auto" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight hidden sm:block">
              HealthNexus<span className="text-teal-600">BD</span>
            </h1>
          </div>
          <div className="flex items-center gap-6 font-semibold text-sm uppercase tracking-wider">
            <Link href="/" className="text-slate-600 hover:text-teal-600 transition">Home</Link>
            <Link href="/login" className="px-4 py-2 bg-slate-900 text-white rounded-full hover:bg-teal-600 transition shadow-md">Admin</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-6xl mx-auto pt-24 pb-20 px-6">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 px-5 py-2 bg-teal-50 border border-teal-100 text-teal-700 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
            Public Health Informatics Portfolio
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-tight tracking-tight">
            Connecting Data to <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">
              Community Well-being.
            </span>
          </h2>
          <div className="max-w-3xl bg-white border border-slate-100 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 mb-10">
            <p className="text-xl text-slate-600 leading-relaxed italic">
              "I am <span className="text-slate-900 font-bold not-italic">Shifat Shahriar Siam</span>, a Public Health student at Jahangirnagar University. This platform explores the intersection of informatics and health outcomes in Bangladesh."
            </p>
          </div>
        </div>
      </header>

      {/* Publications Section */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h3 className="text-3xl font-bold text-slate-800 mb-12 tracking-tight">Latest Analysis</h3>
        {loading ? (
          <div className="text-center py-20 text-slate-400 italic">Loading research...</div>
        ) : (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div key={post.id} className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col">
                <div className="relative h-56 w-full overflow-hidden">
                  <img src={post.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-teal-600 tracking-widest uppercase shadow-sm">
                    {post.category}
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h4 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-teal-600 transition-colors leading-snug">{post.title}</h4>
                  <div className="mt-auto pt-6 border-t border-slate-50">
                    <Link href={`/posts/${post.slug}`} className="text-teal-600 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                      Read Research <span>→</span>
                    </Link>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-all origin-left"></div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* About Shifat Section */}
      <section className="bg-slate-900 text-white py-24 px-6 mt-20 rounded-t-[3rem] border-t-4 border-teal-500">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="relative group">
            <div className="w-64 h-64 md:w-72 md:h-72 rounded-3xl overflow-hidden border-4 border-teal-400 shadow-2xl transform -rotate-2 group-hover:rotate-0 transition-all duration-500">
              <img src="https://i.postimg.cc/0jWxqG12/Chat-GPT-Image-Dec-17-2025-01-42-38-PM.png" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-teal-500 text-slate-900 font-bold px-6 py-2 rounded-full border-2 border-slate-900 shadow-lg">
              BPH Candidate
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-4xl md:text-5xl font-extrabold mb-2 uppercase tracking-tighter">Shifat Shahriar Siam</h3>
            <p className="text-teal-400 font-bold mb-6 uppercase tracking-widest text-sm">
              Public Health and Informatics | Jahangirnagar University
            </p>
            <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-2xl">
              Focusing on the digitalization of healthcare systems in the Global South. Specializing in epidemiology, data-driven policymaking, and clinical informatics.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {['Epidemiology', 'Health Informatics', 'Biostatistics'].map((s) => (
                <span key={s} className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-xs text-teal-300 font-bold uppercase">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dark Footer */}
      <footer className="bg-slate-950 text-white pt-24 pb-12 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-50"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <Logo className="h-12 w-auto" />
                <h4 className="text-2xl font-bold tracking-tighter italic">The Health Nexus</h4>
              </div>
              <p className="text-slate-400 text-lg max-w-md leading-relaxed">
                A platform dedicated to health informatics research and local clinical contexts in Bangladesh.
              </p>
            </div>
            <div>
              <h5 className="text-teal-400 font-bold uppercase tracking-widest text-[10px] mb-6">Contact Info</h5>
              <p className="text-slate-300 leading-relaxed text-sm">
                Shifat Shahriar Siam<br/>
                Jahangirnagar University<br/>
                siam.bph.ju@gmail.com
              </p>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-500 text-xs uppercase tracking-widest">
              © 2026 HealthNexusBD. Developed by Shifat Shahriar Siam.
            </p>
            <div className="flex gap-6">
              <a href="mailto:siam.bph.ju@gmail.com" className="text-slate-500 hover:text-teal-400 transition-colors text-xs font-bold uppercase tracking-widest">Email</a>
              <a href="#" className="text-slate-500 hover:text-teal-400 transition-colors text-xs font-bold uppercase tracking-widest">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
