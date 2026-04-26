'use client';

import { useRouter } from "next/navigation";
import { loginAPI } from "@/lib/api";

export default function LoginForm() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await loginAPI(
        "muhammad.fikri@uin-suska.ac.id",
        "muhammad.fikri"
      );

      const token = res.data.access_token;

      // SIMPAN TOKEN (WAJIB key = "token")
      localStorage.setItem("token", token);

      router.push("/dashboard");
    } catch (err) {
      console.error("Login gagal:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded">
      <h1 className="text-xl font-bold mb-4">Login Dosen</h1>

      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Login
      </button>
    </div>
  );
}