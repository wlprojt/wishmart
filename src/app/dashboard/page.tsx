"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type UserType = {
  id: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function ensureJwtAndFetchUser() {
      try {
        // Convert Better-Auth session → JWT
        await fetch("/api/auth/session-to-jwt", {
          method: "POST",
          credentials: "include",
        });

        // Fetch current user
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          router.replace("/login");
          return;
        }

        const data: UserType = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }

    ensureJwtAndFetchUser();
  }, [router]);

  async function logout() {
  try {
    // 1️⃣ call logout API
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    // 2️⃣ clear client-side state
    setUser(null); // If Navbar stores user in useState

    // 3️⃣ refresh server components (if you rely on server session)
    router.refresh();

    // ✅ HARD reload + redirect
    window.location.href = "/login";
  } catch (err) {
    console.error("Logout failed:", err);
  }
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
