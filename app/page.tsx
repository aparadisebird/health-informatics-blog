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
      {/* Navigation - Clean & Professional */}
      <nav className="p-4 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Logo className="h-14 md:h-18 w-auto" />
            <h1 className="text-xl font-black text-slate-900 tracking-tighter hidden lg:block border-l pl-4 border-slate-200">
              HealthNexus<span className="text-teal-600">BD</span>
            </h1>
          </div>

          <div className="flex items-center gap-8">
            <Link href="/" className="text-sm font-bold text-slate-600 hover:text-teal-600 uppercase tracking-widest transition">Home</Link>
            <Link href="#publications" className="text-sm font-bold text-slate-600 hover:text-teal-600 uppercase tracking-widest transition">Blogs</Link>
            <Link href="#about" className="text-sm font-bold text-slate-600 hover:text-teal-600 uppercase tracking-widest transition">About</Link>
            <Link href="#contact" className="text-sm font-bold text-slate-600 hover:text-teal-600 uppercase tracking-widest transition">Contact</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Informatics Lab Redesign */}
<header className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#020617] text-white">
  
  {/* 1. The Technical "Blueprint" Grid */}
  <div className="absolute inset-0 opacity-20 pointer-events-none" 
       style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232dd4bf' fill-opacity='0.2' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 40 40 0 39 0 39 39 0 39 0 40z'/%3E%3C/g%3E%3C/svg%3E")` }}>
  </div>

  {/* 2. Dynamic Lab Elements (Blobs & Orbs) */}
  <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-600/20 rounded-full blur-[120px] animate-pulse"></div>
  <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px]"></div>

  {/* 3. Decorative "Data Nodes" SVG Sketch */}
  <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="dots" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <circle fill="#2dd4bf" cx="50" cy="50" r="1" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dots)" />
    {/* Floating Lines representing connections */}
    <line x1="10%" y1="20%" x2="30%" y2="40%" stroke="#2dd4bf" strokeWidth="0.5" strokeDasharray="5,5" />
    <line x1="80%" y1="10%" x2="60%" y2="50%" stroke="#10b981" strokeWidth="0.5" strokeDasharray="5,5" />
  </svg>

  {/* 4. Main Content Container */}
  <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
    <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-full backdrop-blur-md">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
      </span>
      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-400">
        Public Health Informatics Lab
      </span>
    </div>

    <h2 className="text-6xl md:text-[100px] font-black leading-[0.85] tracking-tighter mb-10">
      Transforming <br/>
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-emerald-400 to-teal-500 italic">
        Human Data.
      </span>
    </h2>

    {/* Glassmorphism Quote Box */}
    <div className="max-w-3xl mx-auto relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-[2.5rem] blur opacity-25"></div>
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
        <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-light">
          "I am <span className="text-white font-bold">Shifat Shahriar Siam</span>. I build bridges between medical science and software architecture to solve the healthcare challenges of tomorrow."
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <div className="h-1 w-12 bg-teal-500 rounded-full"></div>
          <div className="h-1 w-4 bg-slate-700 rounded-full"></div>
          <div className="h-1 w-4 bg-slate-700 rounded-full"></div>
        </div>
      </div>
    </div>
    
    {/* Tech Stack Badges (Visual Only for the Lab vibe) */}
    <div className="mt-12 flex justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
       <span className="text-xs font-mono tracking-widest text-teal-400">PYTHON.ML</span>
       <span className="text-xs font-mono tracking-widest text-teal-400">DATA.INF</span>
       <span className="text-xs font-mono tracking-widest text-teal-400">EPIDEMIOLOGY</span>
    </div>
  </div>

  {/* Bottom Fade */}
  <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#f8fafc] to-transparent"></div>
</header>

      {/* Publications Section */}
      <section id="publications" className="max-w-6xl mx-auto px-6 py-24">
        <div className="flex items-center gap-4 mb-16">
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Latest Publications</h3>
          <div className="h-px flex-1 bg-slate-200"></div>
        </div>
        
        {loading ? (
          <div className="text-center py-20 text-slate-400 font-medium italic">Retrieving research data...</div>
        ) : (
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div key={post.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col">
                <div className="relative h-64 w-full overflow-hidden">
                  <img src={post.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-teal-600 tracking-[0.2em] uppercase shadow-sm">
                    {post.category}
                  </div>
                </div>
                <div className="p-10 flex-1 flex flex-col">
                  <h4 className="text-2xl font-bold text-slate-900 mb-6 group-hover:text-teal-600 transition-colors leading-tight">{post.title}</h4>
                  <div className="mt-auto pt-6 border-t border-slate-50">
                    <Link href={`/posts/${post.slug}`} className="text-teal-600 font-bold text-sm flex items-center gap-2 group-hover:gap-4 transition-all">
                      View Full Research <span>→</span>
                    </Link>
                  </div>
                </div>
                <div className="h-2 w-full bg-gradient-to-r from-teal-500 to-emerald-400 transform scale-x-0 group-hover:scale-x-100 transition-all origin-left"></div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* About Shifat Section */}
      <section id="about" className="bg-slate-900 text-white py-32 px-6 mt-10 rounded-t-[4rem] border-t-8 border-teal-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
           <svg width="100%" height="100%"><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/></pattern><rect width="100%" height="100%" fill="url(#grid)" /></svg>
        </div>

        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="relative group">
            <div className="w-72 h-72 md:w-80 md:h-80 rounded-[3rem] overflow-hidden border-4 border-teal-400 shadow-2xl transform -rotate-3 group-hover:rotate-0 transition-all duration-500">
              <img src="https://i.postimg.cc/0jWxqG12/Chat-GPT-Image-Dec-17-2025-01-42-38-PM.png" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-teal-500 text-slate-900 font-black px-8 py-3 rounded-2xl border-4 border-slate-900 shadow-xl text-sm uppercase tracking-widest">
              BPH Candidate
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-5xl md:text-6xl font-black mb-4 uppercase tracking-tighter">Shifat Shahriar Siam</h3>
            <p className="text-teal-400 font-bold mb-8 uppercase tracking-[0.3em] text-sm">
              Public Health & Informatics | Jahangirnagar University
            </p>
            <p className="text-slate-300 text-xl leading-relaxed mb-10 max-w-2xl font-light">
              Focused on the digitalization of healthcare systems in the Global South. Specializing in epidemiology, data-driven policymaking, and clinical informatics.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              {['Epidemiology', 'Health Informatics', 'Biostatistics'].map((s) => (
                <span key={s} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 px-6 py-3 rounded-2xl text-xs text-teal-300 font-bold uppercase tracking-widest">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer with Contact & Admin */}
      <footer id="contact" className="bg-slate-950 text-white pt-28 pb-12 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            <div className="col-span-1 lg:col-span-2">
              <div className="flex items-center gap-4 mb-8">
                <Logo className="h-12 w-auto" />
                <h4 className="text-3xl font-black tracking-tighter italic">The Health Nexus</h4>
              </div>
              <p className="text-slate-400 text-lg max-w-md leading-relaxed">
                A specialized platform for health informatics research. Built to showcase the technical evolution of healthcare in Bangladesh.
              </p>
            </div>
            <div>
              <h5 className="text-teal-400 font-bold uppercase tracking-widest text-[10px] mb-8">Quick Links</h5>
              <ul className="space-y-4 text-slate-300 font-bold text-sm uppercase tracking-wide">
                <li><Link href="/" className="hover:text-teal-400 transition-colors">Home Feed</Link></li>
                <li><Link href="#publications" className="hover:text-teal-400 transition-colors">Research Blogs</Link></li>
                <li><Link href="#about" className="hover:text-teal-400 transition-colors">About Author</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-teal-400 font-bold uppercase tracking-widest text-[10px] mb-8">Identity</h5>
              <p className="text-slate-300 leading-relaxed text-sm font-medium">
                Shifat Shahriar Siam<br/>
                Jahangirnagar University<br/>
                siam.bph.ju@gmail.com
              </p>
              <Link href="/login" className="mt-6 inline-block text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 hover:text-teal-500 transition-colors">
                🔐 Internal Admin Access
              </Link>
            </div>
          </div>
          
          <div className="pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em]">
              © 2026 Developed by Shifat Shahriar Siam. Portfolio v2.0
            </p>
            <div className="flex gap-8">
              <a href="mailto:siam.bph.ju@gmail.com" className="text-slate-500 hover:text-teal-400 transition-colors text-xs font-bold uppercase tracking-widest">Email</a>
              <a href="#" className="text-slate-500 hover:text-teal-400 transition-colors text-xs font-bold uppercase tracking-widest">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
