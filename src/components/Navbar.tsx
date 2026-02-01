"use client";

import Link from "next/link";
import { Search, ShoppingCart, CircleUser} from "lucide-react";
import Image from "next/image";
import { IoMdCart } from "react-icons/io";
import { Menu, X } from "lucide-react";
import { useState } from "react";


export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full">
      {/* Top bar */}
      <div className="bg-blue-700 text-white text-sm">
        <div className="hidden lg:flex max-w-7xl mx-auto justify-between items-center px-4 py-2">
          <span>24/7 Customer service 1-800-234-5678</span>
          <div className="flex gap-12">
            <Link href="#" className="hover:underline">
              Shipping & return
            </Link>
            <Link href="#" className="hover:underline">
              Track order
            </Link>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-6 px-4 py-4">
          <div className="flex items-center gap-2">
             {/* Menu Button */}
             <div className="flex lg:hidden items-center text-white">
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-white italic text-2xl font-bold">
            <Image
                src="/sllogo.png"
                alt="Logo"
                width={32}
                height={32}
                priority
                className="h-7 w-auto object-contain"
            />
            wishmart
           </Link>
          </div>

          {/* Search */}
          <div className="bg-white rounded-md">
            <div className="hidden lg:flex justify-between relative w-60">
              <input
                type="text"
                placeholder="Search product ..."
                className="w-full rounded-md px-4 py-2 pr-10 text-sm outline-none"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 w-4 h-4" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex lg:hidden items-center gap-5 text-white">
            <button className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-white w-4 h-4" />
            </button>

            <button className="relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-white text-blue-600 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>

            <Link href="/dashboard" className="font-normal hover:underline">
              <button className="relative">
              <CircleUser className="w-6 h-6" />
            </button>
            </Link>
          </div>
        </div>
      </div>
      <hr className="border-t border-gray-500" />

      {/* Mobile Menu */}
        {mobileMenuOpen && (
        <div className="lg:hidden bg-blue-600 border-t border-white/20">
            <nav className="flex flex-col text-white text-sm px-6 py-4 space-y-4">
            <Link href="#" onClick={() => setMobileMenuOpen(false)}>All products</Link>
            <Link href="#" onClick={() => setMobileMenuOpen(false)}>Home appliances</Link>
            <Link href="#" onClick={() => setMobileMenuOpen(false)}>Audio & video</Link>
            <Link href="#" onClick={() => setMobileMenuOpen(false)}>Refrigerator</Link>
            <Link href="#" onClick={() => setMobileMenuOpen(false)}>New arrivals</Link>
            <Link href="#" onClick={() => setMobileMenuOpen(false)}>Today&apos;s deal</Link>
            <Link href="#" onClick={() => setMobileMenuOpen(false)}>Gift cards</Link>
            </nav>
        </div>
        )}



      <div className="bg-blue-600">
        <div className="hidden lg:flex max-w-7xl mx-auto text-white font-bold flex justify-between items-center gap-6 px-4 py-3">


            <Link href="#" className="hover:opacity-80">All products</Link>
            <Link href="#" className="hover:opacity-80">Home appliances</Link>
            <Link href="#" className="hover:opacity-80">Audio & video</Link>
            <Link href="#" className="hover:opacity-80">Refrigerator</Link>
            <Link href="#" className="hover:opacity-80">New arrivals</Link>
            <Link href="#" className="hover:opacity-80">Today&apos;s deal</Link>
            <Link href="#" className="hover:opacity-80">Gift cards</Link>

            <button className="relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-white text-blue-600 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>

            <Link href="/dashboard" className="font-normal hover:underline">
              <button className="relative">
              <CircleUser className="w-6 h-6" />
            </button>
            </Link>

        </div>
      </div>
    </header>
  );
}
