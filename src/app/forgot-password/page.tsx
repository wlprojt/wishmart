"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
      } else {
        setMessage(data.message);
      }
    } catch {
      setError("Network error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">
      <div className="w-[460px] bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-xl text-blue-600 text-center font-bold mb-2">Forgot Password</h1>
        <p className="text-sm text-zinc-400 text-center mb-4">
          Enter your email to receive a password reset link.
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 rounded bg-gray-50 border border-gray-200 mb-4 outline-none focus:ring-2 focus:ring-gray-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && <p className="text-sm text-red-400 mb-2">{error}</p>}
        {message && <p className="text-sm text-green-400 mb-2">{message}</p>}

        <button
          onClick={submit}
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 py-2 text-white font-semibold"
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>

        <a
          href="/login"
          className="block text-center text-sm text-blue-600 hover:underline mt-4"
        >
          Back to login
        </a>
      </div>
    </div>
  );
}