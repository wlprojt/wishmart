"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OtpPage() {
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(30);

  const email =
    typeof window !== "undefined"
      ? localStorage.getItem("verifyEmail")
      : null;

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* ---------------- VERIFY OTP ---------------- */
  async function verifyOtp() {
    if (!email) {
      setError("Email not found. Please register again.");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter a valid 6-digit OTP");
      return;
    }

    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid OTP");
        return;
      }

      localStorage.removeItem("verifyEmail");
      router.replace("/dashboard");
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- RESEND OTP ---------------- */
  async function resendOtp() {
    if (!email || resending || timer > 0) return;

    setResending(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to resend OTP");
        return;
      }

      setTimer(30); // restart cooldown
    } catch {
      setError("Unable to resend OTP");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold text-center">
          Verify Email
        </h1>

        <Input
          placeholder="Enter 6-digit OTP"
          value={otp}
          maxLength={6}
          onChange={(e) => setOtp(e.target.value.trim())}
        />

        {error && (
          <p className="text-sm text-red-600 text-center">
            {error}
          </p>
        )}

        <Button
          onClick={verifyOtp}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Verifying..." : "Verify & Continue"}
        </Button>

        {/* 🔁 Resend OTP */}
        <button
          onClick={resendOtp}
          disabled={resending || timer > 0}
          className="w-full text-sm text-blue-600 disabled:text-gray-400"
        >
          {timer > 0
            ? `Resend OTP in ${timer}s`
            : resending
            ? "Resending..."
            : "Resend OTP"}
        </button>
      </div>
    </div>
  );
}