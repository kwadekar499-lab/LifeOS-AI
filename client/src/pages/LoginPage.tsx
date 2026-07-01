import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/providers/AuthProvider";
import { ROUTES } from "@/constants/routes";
import { KeyRound, Mail, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login(email, password || "dummy-password");
      navigate(ROUTES.APP_HOME);
    } catch (err: unknown) {
      let errMsg = "Failed to log in. Please check your credentials.";
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
          <h1 className="text-3xl font-semibold tracking-tight">Welcome Back</h1>
          <p className="mt-2 text-sm text-white/45">Sign in to your LifeOS AI workspace</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wider text-white/50 mb-2">
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
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-white/25 focus:bg-white/[0.06] focus:ring-1 focus:ring-white/25"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium uppercase tracking-wider text-white/50 mb-2">
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
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/20 outline-none transition-all focus:border-white/25 focus:bg-white/[0.06] focus:ring-1 focus:ring-white/25"
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
                Sign In
                <ArrowRight className="size-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-white/40">
          Don&apos;t have an account?{" "}
          <Link to={ROUTES.REGISTER} className="font-medium text-white hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
