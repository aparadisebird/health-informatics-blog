"use client";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (error) {
      alert("Access Denied: Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-teal-100">
        <h2 className="text-3xl font-bold text-teal-800 mb-2 text-center">Nexus Admin</h2>
        <p className="text-slate-500 text-center mb-8 text-sm">Authorized Access Only</p>
        <div className="space-y-4">
          <input 
            type="email" placeholder="Admin Email" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="Password" 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-lg font-bold transition-all shadow-md">
            Login to Dashboard
          </button>
        </div>
      </form>
    </div>
  );
}