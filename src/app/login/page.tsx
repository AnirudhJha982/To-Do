"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        throw new Error(res.error === "CredentialsSignin" ? "Invalid email or password" : res.error);
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E8B83A]/20 rounded-full blur-[100px] -z-10" />
      
      <div className="rpg-card p-8 max-w-md w-full bg-[#F8F3E7] border-[#E8B83A]/50 shadow-xl">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#F8F3E7] flex items-center justify-center border border-[#E8B83A]/50 shadow-sm">
            <Shield className="w-8 h-8 text-[#E8B83A]" />
          </div>
        </div>
        
        <h1 className="text-3xl font-black font-serif text-center mb-2 text-[#5E4A47]">Welcome Back</h1>
        <p className="text-[#8F7B77]/70 font-medium text-center mb-8 uppercase tracking-widest text-xs">Continue your journey</p>
        
        {error && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-6 text-sm font-medium text-center">{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-bold mb-2 text-[#755A56] uppercase tracking-wide">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#F8F3E7] border border-[#E8B83A]/30 rounded-xl p-4 text-[#5E4A47] focus:outline-none focus:border-[#E8B83A] focus:ring-1 focus:ring-[#E8B83A] transition-all font-medium"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2 text-[#755A56] uppercase tracking-wide">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#F8F3E7] border border-[#E8B83A]/30 rounded-xl p-4 text-[#5E4A47] focus:outline-none focus:border-[#E8B83A] focus:ring-1 focus:ring-[#E8B83A] transition-all font-medium"
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 mt-4 bg-[#E8B83A] hover:bg-[#C49B2E] rounded-xl font-black text-[#5E4A47] shadow-md transition-all disabled:opacity-50 uppercase tracking-widest"
          >
            {loading ? "Authenticating..." : "Log In"}
          </button>
        </form>
        
        <div className="mt-8 text-center text-[#8F7B77]/70 text-sm font-medium border-t border-[#E8B83A]/20 pt-6">
          Don't have an account? <Link href="/signup" className="text-[#755A56] hover:text-[#5E4A47] font-black transition-colors underline decoration-[#E8B83A] underline-offset-4">Start your quest</Link>
        </div>
      </div>
    </div>
  );
}
