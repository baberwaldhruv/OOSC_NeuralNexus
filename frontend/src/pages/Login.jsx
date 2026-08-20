import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Changed fallback from "/cases" to "/"
  const redirectPath = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#131314] text-[#e3e3e3] px-4">
      <div className="w-full max-w-md p-8 bg-[#1e1f20] border border-[#2d2f31] rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 text-white font-bold text-sm mb-1">
            ✦
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Sign In to VakilAI
          </h2>
          <p className="text-xs text-[#8e918f]">
            Access your AI legal draft assistant & case records
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-800/50 text-red-300 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#8e918f] mb-1.5 ml-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 bg-[#131314] border border-[#2d2f31] rounded-xl text-sm text-white placeholder-[#8e918f] focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#8e918f] mb-1.5 ml-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-[#131314] border border-[#2d2f31] rounded-xl text-sm text-white placeholder-[#8e918f] focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl transition shadow-md disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Continue"}
          </button>
        </form>

        <p className="mt-6 text-xs text-center text-[#8e918f]">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-400 hover:text-blue-300 font-medium ml-1 transition"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}