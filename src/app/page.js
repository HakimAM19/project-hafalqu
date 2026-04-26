'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAPI } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await loginAPI(username, password);

      const token = res.data.access_token;

      localStorage.setItem("token", token);

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Login gagal. Cek username/password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <form
        onSubmit={handleLogin}
        className="bg-slate-800 p-6 rounded-xl shadow-lg w-80 space-y-4"
      >
        <h1 className="text-xl font-bold text-center">
          Login Dosen Hafalqu
        </h1>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        <input
          type="text"
          placeholder="Email Dosen"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 rounded bg-slate-900 border border-slate-700"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded bg-slate-900 border border-slate-700"
          required
        />

        <button
          className="w-full bg-blue-500 hover:bg-blue-600 transition py-2 rounded font-semibold"
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}