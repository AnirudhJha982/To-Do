"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sword } from "lucide-react";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Signup failed");
      }

      // Auto login
      const loginRes = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (loginRes?.error) {
        throw new Error("Account created but failed to auto-login.");
      }

      router.push("/create-character");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#755A56]/10 rounded-full blur-[100px] -z-10" />
      
      <div className="rpg-card p-8 max-w-md w-full bg-[#F8F3E7] border-[#E8B83A]/50 shadow-xl">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#F8F3E7] flex items-center justify-center border border-[#E8B83A]/50 shadow-sm">
            <Sword className="w-8 h-8 text-[#755A56]" />
          </div>
        </div>
        
        <h1 className="text-3xl font-black font-serif text-center mb-2 text-[#5E4A47]">Start Your Journey</h1>
        <p className="text-[#8F7B77]/70 font-medium text-center mb-8 uppercase tracking-widest text-xs">Create an account to begin</p>
        
        {error && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-6 text-sm font-medium text-center">{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold mb-2 text-[#755A56] uppercase tracking-wide">Display Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#F8F3E7] border border-[#E8B83A]/30 rounded-xl p-4 text-[#5E4A47] focus:outline-none focus:border-[#E8B83A] focus:ring-1 focus:ring-[#E8B83A] transition-all font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-[#755A56] uppercase tracking-wide">Email Address</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-[#F8F3E7] border border-[#E8B83A]/30 rounded-xl p-4 text-[#5E4A47] focus:outline-none focus:border-[#E8B83A] focus:ring-1 focus:ring-[#E8B83A] transition-all font-medium"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2 text-[#755A56] uppercase tracking-wide">Password</label>
            <input 
              type="password" 
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-[#F8F3E7] border border-[#E8B83A]/30 rounded-xl p-4 text-[#5E4A47] focus:outline-none focus:border-[#E8B83A] focus:ring-1 focus:ring-[#E8B83A] transition-all font-medium"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-[#755A56] uppercase tracking-wide">Confirm Password</label>
            <input 
              type="password" 
              value={formData.confirmPassword}
              onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full bg-[#F8F3E7] border border-[#E8B83A]/30 rounded-xl p-4 text-[#5E4A47] focus:outline-none focus:border-[#E8B83A] focus:ring-1 focus:ring-[#E8B83A] transition-all font-medium"
              required
              minLength={6}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 mt-4 bg-[#755A56] hover:bg-[#5E4A47] rounded-xl font-black text-[#F8F3E7] shadow-md transition-all disabled:opacity-50 uppercase tracking-widest"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        
        <div className="mt-8 text-center text-[#8F7B77]/70 text-sm font-medium border-t border-[#E8B83A]/20 pt-6">
          Already have an account? <Link href="/login" className="text-[#755A56] hover:text-[#5E4A47] font-black transition-colors underline decoration-[#E8B83A] underline-offset-4">Log In</Link>
        </div>
      </div>
    </div>
  );
}
