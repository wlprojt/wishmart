"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function VerifyOTPPage() {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const inputsRef = useRef<HTMLInputElement[]>([]);
  
  const email = typeof window !== "undefined" ? localStorage.getItem("verifyEmail") : null;

  useEffect(() => {
    if (!email) {
      router.replace("/"); // redirect if no email stored
    }
  }, [email, router]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index: number, e: any) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const submitOTP = async () => {
    if (!email) return setError("Email missing. Please sign up again.");

    setLoading(true);
    setError("");

    const code = otp.join("");
    if (code.length !== 6) {
      setError("Enter 6-digit OTP");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid OTP");
        setLoading(false);
        return;
      }

      localStorage.removeItem("verifyEmail");
      router.push("/dashboard");
    } catch (err) {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (!email) return setError("Email missing. Cannot resend OTP.");

    setResendLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to resend OTP");
      }

    } catch (err) {
      setError("Failed to resend OTP");
    }

    setResendLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-[460px]"
      >
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-2">Verify Email</h1>
        <p className="text-sm text-gray-400 text-center mb-6">
          Enter the 6-digit code sent to your email
        </p>

        <div className="flex justify-between mb-4">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                if (el) inputsRef.current[i] = el;
               }}

              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleBackspace(i, e)}
              maxLength={1}
              className="w-12 h-12 text-center text-xl rounded-xl bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          ))}
        </div>

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <button
          onClick={submitOTP}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white font-semibold disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <button
          onClick={resendOTP}
          disabled={resendLoading}
          className="mt-4 text-sm text-blue-600 hover:underline w-full disabled:opacity-50"
        >
          {resendLoading ? "Resending..." : "Resend OTP"}
        </button>
      </motion.div>
    </div>
  );
}