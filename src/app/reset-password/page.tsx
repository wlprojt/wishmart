"use client";

import { Eye, EyeOff } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();

  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!token) {
      setError("Invalid or expired reset link");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      router.replace("/login");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500 font-medium">
          Invalid or expired reset link
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">
      <div className="w-[460px] bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-xl font-bold text-blue-600 text-center mb-4">
          Reset Password
        </h1>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New password (min 6 chars)"
            className="w-full p-2 pr-10 rounded bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-blue-600 py-2 rounded mt-4 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Resetting..." : "Reset password"}
        </button>
      </div>
    </div>
  );
}
