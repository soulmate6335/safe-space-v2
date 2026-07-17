import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import Layout from "../components/Layout";
import Button from "../components/ui/Button";

import { login } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

import toast from "react-hot-toast";

function Login() {
  const { session } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Founder Login | Safe Space";
  }, []);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      await login(email, password);

      // AuthContext will update automatically.
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (session) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <Layout>
      <div className="mx-auto flex max-w-2xl items-center justify-center py-8">
        <div className="w-full rounded-3xl border border-violet-100 bg-white/90 p-8 shadow-2xl shadow-violet-100/70 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/90 dark:shadow-none">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-purple-700 text-2xl text-white shadow-lg">
              🔐
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Founder Login
            </h1>
            <p className="mt-3 text-base text-gray-500 dark:text-slate-400">
              Sign in to access the Safe Space dashboard and manage conversations with care.
            </p>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-300">
                Email Address
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-violet-400 dark:focus:ring-violet-950"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-300">
                Password
              </span>
              <input
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-violet-400 dark:focus:ring-violet-950"
              />
            </label>
          </div>

          <Button
            onClick={handleLogin}
            disabled={loading}
            className="mt-8 w-full justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-purple-700 px-5 py-3 text-white shadow-lg shadow-violet-200 transition hover:scale-[1.01] hover:shadow-violet-300 disabled:cursor-not-allowed disabled:opacity-70 dark:shadow-violet-950/40"
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </div>
      </div>
    </Layout>
  );
}

export default Login;