"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";


export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleloading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSignup = async () => {
  setGoogleLoading(true);
  setError(null);

  try {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}/dashboard`,
    });
  } catch (err) {
    console.error("Google signup failed:", err);
    setError("Google sign-in failed. Please try again.");
    setGoogleLoading(false);
  }
};



  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLogin && password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

    setLoading(true);
    setError("");

    const endpoint = isLogin
      ? "/api/auth/login"
      : "/api/auth/signup";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message || "Something went wrong");
      return;
    }

    // ✅ LOGIN → dashboard
    if (isLogin) {
      window.location.href = "/dashboard";
      return;
    }

    // ✅ SIGNUP → OTP verification
    localStorage.setItem("verifyEmail", email);
    window.location.href = "/otp";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="rounded-2xl shadow-xl bg-white text-black">
          <CardContent className="p-6 space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-blue-600">
                {isLogin ? "Welcome back" : "Create account"}
              </h1>
              <p className="text-sm text-zinc-400">
                {isLogin
                  ? "Login to continue"
                  : "Sign up to get started"}
              </p>
            </div>

            {/* Google sign-in */}
            <Button
              onClick={handleGoogleSignup}
              className="w-full py-2 text-white rounded-lg flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 transition disabled:opacity-50"
              disabled={googleloading}
            >
              {googleloading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <Image src="/google-icon.svg" alt="Google" width={20} height={20} />
                  {isLogin ? "Sign in with Google" : "Sign up with Google"}
                </>
              )}
            </Button>

            <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
            <span className="mx-2 text-gray-500 dark:text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <Input
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}

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
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {isLogin && (
                <div className="text-right">
                  <a
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
              )}



              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                disabled={loading}
              >
                {loading
                  ? "Please wait..."
                  : isLogin
                  ? "Login"
                  : "Create Account"}
              </Button>
            </form>

            <div className="text-center text-sm text-zinc-400">
              {isLogin ? "Don’t have an account?" : "Already have an account?"}
              <button
                type="button"
                className="ml-1 text-blue-600 hover:underline"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Sign up" : "Login"}
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}