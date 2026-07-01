import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/providers/AuthProvider";
import { ROUTES } from "@/constants/routes";
import { KeyRound, Mail, User, Loader2, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !username) {
      setError("Email and Username are required");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await register(email, username, password || "dummy-password", fullName);
      navigate(ROUTES.APP_HOME);
    } catch (err: unknown) {
      let errMsg = "Failed to register. Please try again.";
      if (axios.isAxiosError(err)) {
        errMsg = err.response?.data?.error?.message || err.message || errMsg;
      } else if (err instanceof Error) {
        errMsg = err.message;
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0F] px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/5 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Create Account</h1>
          <p className="mt-2 text-sm text-white/45">Get started with LifeOS AI workspace</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-xs font-medium uppercase tracking-wider text-white/50 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/30">
                <User className="size-4" />
              </span>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-2 pl-10 pr-4 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-white/25 focus:bg-white/[0.06] focus:ring-1 focus:ring-white/25"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label htmlFor="username" className="block text-xs font-medium uppercase tracking-wider text-white/50 mb-1.5">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/30">
                <User className="size-4" />
              </span>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="johndoe"
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-2 pl-10 pr-4 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-white/25 focus:bg-white/[0.06] focus:ring-1 focus:ring-white/25"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wider text-white/50 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/30">
                <Mail className="size-4" />
              </span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-2 pl-10 pr-4 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-white/25 focus:bg-white/[0.06] focus:ring-1 focus:ring-white/25"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium uppercase tracking-wider text-white/50 mb-1.5">
              Password (Optional)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/30">
                <KeyRound className="size-4" />
              </span>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-2 pl-10 pr-4 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-white/25 focus:bg-white/[0.06] focus:ring-1 focus:ring-white/25"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-sm font-semibold text-[#0A0A0F] transition-all hover:bg-white/90 disabled:bg-white/50 disabled:cursor-not-allowed mt-4"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                Register
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-white/40">
          Already have an account?{" "}
          <Link to={ROUTES.LOGIN} className="font-medium text-white hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
