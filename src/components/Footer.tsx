"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
    const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 500);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  if (!visible) return null;


  return (
    <footer className="bg-[#2b3645] text-gray-300">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Image
              src="/sllogo.png"
              alt="Wishmart Logo"
              width={30}
              height={30}
            />
            <span className="text-white text-2xl font-bold">wishmart</span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs">
            We bring you the latest in electronics, gadgets, and smart
            home solutions—all in one place.
          </p>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-white text-xl font-bold mb-4">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#">Hot deals</Link></li>
            <li><Link href="#">Categories</Link></li>
            <li><Link href="#">Brands</Link></li>
            <li><Link href="#">Rebates</Link></li>
            <li><Link href="#">Weekly deals</Link></li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="text-white text-xl font-bold mb-4">Need help?</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#">About</Link></li>
            <li><Link href="#">Contact</Link></li>
            <li><Link href="#">Order tracking</Link></li>
            <li><Link href="#">FAQs</Link></li>
            <li><Link href="#">Return policy</Link></li>
            <li><Link href="#">Privacy policy</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white text-xl font-bold mb-4">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li>123 Fifth Avenue, New York, NY 10160</li>
            <li>contact@info.com</li>
            <li>929-242-6868</li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-600/40" />

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <p className="text-gray-400">
          © 2026 Electronic Store. Powered by Electronic Store
        </p>

        <div className="flex items-center gap-3">
          <Image src="/payment.png" alt="Amazon" width={300} height={100} />
        </div>
      </div>

      {/* Scroll to top */}
      <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white w-8 h-8 rounded-md
                 flex items-center justify-center shadow-lg hover:bg-blue-700 transition"
      aria-label="Scroll to top"
    >
      ↑
    </button>
    </footer>
  );
}
