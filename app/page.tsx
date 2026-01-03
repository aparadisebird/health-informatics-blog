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

      {/* Hero Section with Informatics Lab Background */}
      <header className="relative overflow-hidden bg-white border-b border-slate-100">
        {/* Lab Sketch / Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230d9488' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
        </div>
        
        {/* Animated Glow Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-100/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-100/20 rounded-full blur-[120px]"></div>

        <div className="max-w-6xl mx-auto pt-28 pb-24 px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 px-6 py-2 bg-teal-50 border border-teal-100 text-teal-700 rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-sm">
              Informatics & Public Health Research
            </div>
            <h2 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 leading-[0.9] tracking-tighter">
              Data Driven <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-700">
                Healthcare.
              </span>
            </h2>
            <div className="max-w-3xl bg-white/60 backdrop-blur-md border border-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 mb-10 relative">
              <div className="absolute -top-4 -left-4 text-teal-200 opacity-50">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12C14.017 12.5523 13.5693 13 13.017 13H11.017C10.4647 13 10.017 12.5523 10.017 12V9C10.017 7.34315 11.3601 6 13.017 6H19.017C20.6739 6 22.017 7.34315 22.017 9V15C22.017 16.6569 20.6739 18 19.017 18H17.017C16.4647 18 16.017 18.4477 16.017 19V21H14.017ZM4.017 21L4.017 18C4.017 16.8954 4.91243 16 6.017 16H9.017C9.56928 16 10.017 15.5523 10.017 15V9C10.017 8.44772 9.56928 8 9.017 8H5.017C4.46472 8 4.017 8.44772 4.017 9V12C4.017 12.5523 3.56928 13 3.017 13H1.017C0.464718 13 0.017 12.5523 0.017 12V9C0.017 7.34315 1.36015 6 3.017 6H9.017C10.6739 6 12.017 7.34315 12.017 9V15C12.017 16.6569 10.6739 18 9.017 18H7.017C6.46472 18 6.017 18.4477 6.017 19V21H4.017Z"/></svg>
              </div>
              <p className="text-xl md:text-2xl text-slate-700 leading-relaxed font-medium italic">
                Translating complex health data into impactful community stories. Exploring the intersection of digital systems and human well-being in Bangladesh.
              </p>
            </div>
          </div>
        </div>
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
