"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

declare global {
  interface Window {
    google?: any;
  }
}

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId) {
        setError("Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID");
        setGoogleLoading(false);
        return;
      }

      if (!window.google?.accounts?.id) {
        setError("Google script not loaded. Refresh and try again.");
        setGoogleLoading(false);
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (resp: any) => {
          try {
            const idToken = resp?.credential;
            if (!idToken) throw new Error("No Google credential");

            const res = await fetch("/api/auth/google", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ idToken }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
              setError(data.error || data.message || "Google login failed");
              setGoogleLoading(false);
              return;
            }

            window.location.href = "/dashboard";
          } catch (e) {
            console.error(e);
            setError("Google login failed. Please try again.");
            setGoogleLoading(false);
          }
        },
      });

      window.google.accounts.id.prompt((notification: any) => {
        if (
          notification.isNotDisplayed?.() ||
          notification.isSkippedMoment?.() ||
          notification.isDismissedMoment?.()
        ) {
          setGoogleLoading(false);
        }
      });
    } catch (err) {
      console.error(err);
      setError("Google login failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // credentials: "include", // optional; not needed until JWT login
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || data.message || "Registration failed");
        setLoading(false);
        return;
      }

      // ✅ go verify OTP
      localStorage.setItem("verifyEmail", email);
      window.location.href = "/otp"; // or "/verify-otp" (match your route)
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md"
      >
        <Card className="rounded-2xl shadow-xl bg-white text-black">
          <CardContent className="p-6 space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-blue-600">Create account</h1>
              <p className="text-sm text-zinc-500">Sign up to get started</p>
            </div>

            <Button
                          onClick={handleGoogleLogin}
                          type="button"
                          disabled={googleLoading}
                          className="w-full py-2 rounded-lg flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 disabled:opacity-50"
                        >
                          {googleLoading ? (
                            <span>Signing in...</span>
                          ) : (
                            <>
                              <Image src="/google-icon.svg" alt="Google" width={18} height={18} />
                              Sign in with Google
                            </>
                          )}
                        </Button>
            
                        <div className="flex items-center">
                          <div className="flex-grow border-t border-gray-300" />
                          <span className="mx-2 text-gray-500 text-sm">OR</span>
                          <div className="flex-grow border-t border-gray-300" />
                        </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <Input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                {loading ? "Please wait..." : "Create Account"}
              </Button>
            </form>

            <p className="text-center text-sm text-zinc-500">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}