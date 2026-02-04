"use client";

import GooeyNav from "@/components/GooeyNav";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function Ahome({ session }: { session: any }) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Redirect safely
//   useEffect(() => {
//   if (!session) {
//     router.replace("/");
//     return;
//   }

//   const ADMIN_EMAIL = "rakeshvishwas730@gmail.com";

//   if (session.user?.email !== ADMIN_EMAIL) {
//     router.replace("/"); // 🚫 block non-admin
//   }
// }, [session, router]);


  // if (!session) return null;

  // ✅ Proper logout (Google + JWT)
  const handleLogout = async () => {
    try {
      await authClient.signOut(); // Google / OAuth logout

      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      }); // clear JWT cookie

      router.replace("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setImageUrl(data.url);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setLoading(false);
    }
  };

  const items = [
    { label: "Home", href: "/admin/products" },
    { label: "View Product", href: "/admin/products/view-product" },
    { label: "Add Product", href: "/admin/products/add-product" },
  ];

  return (
    <>
      {/* Navigation */}
      <div className="flex justify-center pt-10 bg-[#29293d] relative">
        <GooeyNav
          items={items}
          particleCount={15}
          particleDistances={[90, 10]}
          particleR={100}
          initialActiveIndex={0}
          animationTime={600}
          timeVariance={300}
          colors={[1, 2, 3, 1, 2, 3, 1, 4]}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#29293d]">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
          <h2 className="text-2xl text-gray-600 font-semibold mb-4">
            Upload Product Image
          </h2>

          <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-xl p-6 hover:border-blue-500 transition">
            <span className="text-gray-600 mb-2">Click to choose a file</span>
            <input type="file" className="hidden" onChange={handleUpload} />
          </label>

          {loading && (
            <p className="text-blue-500 font-medium mt-4 animate-pulse">
              Uploading...
            </p>
          )}

          {imageUrl && (
            <div className="mt-6">
              <img
                src={imageUrl}
                alt="Uploaded"
                className="w-full h-auto rounded-lg shadow-md"
              />
              <p className="text-gray-500 text-sm mt-2">Preview</p>
            </div>
          )}

          <Button
            onClick={handleLogout}
            className="text-lg mt-10 w-full h-14 bg-[#29293d]"
          >
            Logout
          </Button>
        </div>
      </div>
    </>
  );
}
