"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import Link from 'next/link';
import Logo from "@/components/Logo";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Attempt the optimized query first
        const q = query(
          collection(db, "posts"), 
          where("category", "==", "Project"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            // FALLBACK: If the index isn't ready, fetch all and filter locally
            const fallbackQ = query(collection(db, "posts"), orderBy("createdAt", "desc"));
            const fallbackSnapshot = await getDocs(fallbackQ);
            const allItems = fallbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const filtered = allItems.filter((item: any) => item.category === "Project");
            setProjects(filtered);
        } else {
            setProjects(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      } catch (error) {
        console.error("Query failed, attempting local filter:", error);
        // Direct Fallback for Index errors
        const fallbackQ = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const fallbackSnapshot = await getDocs(fallbackQ);
        const allItems = fallbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(allItems.filter((item: any) => item.category === "Project"));
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <main className="min-h-screen bg-[#fdfcfb]">
      <nav className="p-4 bg-white/80 backdrop-blur-md border-b border-stone-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Logo className="h-12 w-auto" />
          <Link href="/" className="text-xs font-black text-teal-600 uppercase tracking-widest hover:text-stone-900 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </nav>

      <header className="max-w-6xl mx-auto py-20 px-6 text-center md:text-left">
        <div className="inline-flex items-center gap-3 mb-6 px-4 py-1 bg-amber-50 border border-amber-100 rounded-full mx-auto md:mx-0">
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-700">Technical Portfolio</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-stone-900 mb-6 tracking-tighter">
          Informatics <span className="italic font-serif text-teal-700 font-light">Projects</span>
        </h2>
        <p className="text-xl text-stone-600 font-medium max-w-2xl leading-relaxed mx-auto md:mx-0">
          Technical implementations, research frameworks, and digital tools developed for the future of healthcare.
        </p>
      </header>

      <section className="max-w-6xl mx-auto px-6 pb-32">
        {loading ? (
          <div className="py-20 text-center">
             <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
             <p className="text-stone-400 font-bold uppercase tracking-widest text-xs">Syncing Projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="py-20 text-center bg-white border border-dashed border-stone-200 rounded-[3rem]">
             <p className="text-stone-400 italic">No projects found. Check the Admin panel to ensure category is set to 'Project'.</p>
          </div>
        ) : (
          <div className="grid gap-10 md:grid-cols-2">
            {projects.map((p) => (
              <Link key={p.id} href={`/posts/${p.slug}`} className="group bg-white border border-stone-100 rounded-[3rem] p-10 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col">
                <div className="flex justify-between items-start mb-10">
                  <div className="w-16 h-16 bg-stone-900 rounded-2xl flex items-center justify-center text-teal-400 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">System Log</p>
                    <p className="text-xs font-bold text-stone-900 uppercase">
                        {p.createdAt ? new Date(p.createdAt.seconds * 1000).toLocaleDateString() : 'Active'}
                    </p>
                  </div>
                </div>
                
                <h4 className="text-3xl font-black text-stone-900 mb-4 tracking-tight group-hover:text-teal-600 transition-colors">
                  {p.title}
                </h4>
                
                <p className="text-stone-500 leading-relaxed mb-8 flex-1">
                  Explore the documentation regarding the architecture, data processing, and clinical impact of this initiative.
                </p>
                
                <div className="flex items-center gap-3 text-teal-600 font-black text-xs uppercase tracking-widest pt-6 border-t border-stone-50">
                   View Documentation <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
