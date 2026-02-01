// src/app/dashboard/page.tsx
"use client"; // we need client for fetch and useEffect

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/jwt";
import { authClient } from "@/lib/auth-client";
// import { cookies } from "next/headers";

type UserType = {
  id: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Client-side fetch to convert session → JWT
  useEffect(() => {
    async function ensureJwtAndFetchUser() {
      try {
        // Call session-to-jwt to get JWT cookie
        await fetch("/api/auth/session-to-jwt", {
          method: "POST",
          credentials: "include", // important to set cookie
        });

        // Now call /api/auth/me to get current user
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include", // include cookie
        });

        if (!res.ok) {
          // Not authenticated → redirect to login
          redirect("/login");
          return;
        }

        const data: UserType = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        redirect("/login");
      } finally {
        setLoading(false);
      }
    }

    ensureJwtAndFetchUser();
  }, []);

  async function logout() {
    // call API to delete cookie
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    redirect("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-semibold">
            {user.email[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back 👋</p>
          </div>
        </div>

        {/* User Info */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Email</span>
            <span className="font-medium">{user.email}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className="text-green-600 font-medium">✔ Verified</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8">
          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
