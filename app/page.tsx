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

      {/* Hero Section - Informatics Enthusiast Design */}
<header className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#fdfcfb] border-b border-stone-200">
  
  {/* 1. Background Technical Grid (Subtle) */}
  <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
       style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0H0v30h30V0zM1 29V1h28v28H1z' fill='%230d9488' fill-rule='evenodd'/%3E%3C/svg%3E")` }}>
  </div>

  <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
    
    {/* LEFT SIDE: Typography & Vision */}
    <div className="text-left">
      <div className="inline-flex items-center gap-3 mb-6 px-4 py-1 bg-teal-50 border border-teal-100 rounded-full">
        <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-700">Tech & Health Awareness</span>
      </div>

      <h2 className="text-5xl md:text-7xl font-black text-stone-900 leading-[1.05] mb-8 tracking-tighter">
        Exploring the <br/>
        <span className="italic font-serif text-teal-700 font-light">Nexus</span> of Tech & <br/>
        Public Health.
      </h2>

      <div className="relative group max-w-lg">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-teal-500 rounded-full"></div>
        <p className="text-xl text-stone-600 leading-relaxed font-medium pl-4">
          "I am <span className="text-stone-900">Shifat Shahriar Siam</span>. I’m a tech enthusiast passionate about AI in healthcare. I love writing blogs and sharing insights to raise public awareness about the future of digital health."
        </p>
      </div>

      <div className="mt-10 flex gap-4">
        <Link href="#publications" className="px-8 py-3 bg-stone-900 text-white rounded-xl font-bold text-sm hover:bg-teal-700 transition-all shadow-xl shadow-stone-200">
          Explore Blogs
        </Link>
        <Link href="#about" className="px-8 py-3 bg-white border border-stone-200 text-stone-600 rounded-xl font-bold text-sm hover:border-teal-500 transition-all">
          My Story
        </Link>
      </div>
    </div>

    {/* RIGHT SIDE: Abstract Lab Sketch Component with BIGGER LOGO */}
    <div className="hidden md:flex justify-center relative">
      <div className="relative w-full max-w-md h-[480px] bg-white border border-stone-100 rounded-[3rem] shadow-2xl overflow-hidden group">
        
        {/* Abstract Medical Patterns */}
        <div className="absolute inset-0 p-8">
            <div className="w-full h-full border-2 border-dashed border-stone-100 rounded-[2rem] flex items-center justify-center relative">
                
                {/* Floating Tech Nodes */}
                <div className="absolute top-8 left-8 w-14 h-14 bg-teal-50 rounded-2xl border border-teal-100 flex items-center justify-center text-[10px] text-teal-600 font-black shadow-sm">AI</div>
                <div className="absolute bottom-16 right-8 w-16 h-16 bg-stone-50 rounded-full border border-stone-200 flex items-center justify-center text-[10px] text-stone-400 font-black shadow-sm">BLOGS</div>
                <div className="absolute bottom-12 left-12 w-20 h-20 bg-emerald-50 rounded-3xl -rotate-12 border border-emerald-100 flex items-center justify-center text-[10px] text-emerald-600 font-black shadow-sm">AWARENESS</div>
                
                {/* Connecting Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                    <line x1="15%" y1="15%" x2="50%" y2="50%" stroke="teal" strokeWidth="1.5" strokeDasharray="6" />
                    <line x1="85%" y1="85%" x2="50%" y2="50%" stroke="teal" strokeWidth="1" />
                    <line x1="20%" y1="80%" x2="50%" y2="50%" stroke="teal" strokeWidth="1.5" strokeDasharray="4" />
                </svg>

                {/* THE BIGGER LOGO */}
                <div className="text-center z-10">
                    <Logo className="h-32 md:h-40 w-auto mx-auto mb-4 drop-shadow-md group-hover:scale-105 transition-transform duration-700" />
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Digital Health Nexus</p>
                </div>
            </div>
        </div>
        
        {/* Bottom Accent */}
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-600"></div>
      </div>
    </div>

  </div>
</header>

      {/* Publications Section - Compact & Fully Clickable */}
<section id="publications" className="max-w-6xl mx-auto px-6 py-20">
  <div className="flex items-center gap-4 mb-12">
    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Latest Stories</h3>
    <div className="h-px flex-1 bg-slate-200"></div>
  </div>
  
  {loading ? (
    <div className="text-center py-20 text-slate-400 font-medium italic">Retrieving research data...</div>
  ) : (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Link 
          key={post.id} 
          href={`/posts/${post.slug}`}
          className="group relative bg-white rounded-[2rem] overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col cursor-pointer"
        >
          {/* Shorter Image Height */}
          <div className="relative h-48 w-full overflow-hidden">
            <img 
              src={post.imageUrl} 
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" 
              alt={post.title}
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black text-teal-600 tracking-[0.2em] uppercase shadow-sm">
              {post.category}
            </div>
          </div>

          {/* More Compact Padding */}
          <div className="p-7 flex-1 flex flex-col">
            <h4 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-teal-600 transition-colors leading-tight">
              {post.title}
            </h4>
            
            <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
              <span className="text-teal-600 font-bold text-xs flex items-center gap-2">
                Read Full Story <span>→</span>
              </span>
              {/* Optional: Add a small icon or date here if you wish */}
            </div>
          </div>

          {/* Subtle Bottom Accent Line */}
          <div className="h-1.5 w-full bg-gradient-to-r from-teal-500 to-emerald-400 transform scale-x-0 group-hover:scale-x-100 transition-all origin-left"></div>
        </Link>
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
