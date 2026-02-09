"use client";

import Link from "next/link";
import { Search, ShoppingCart, CircleUser} from "lucide-react";
import Image from "next/image";
import { IoMdCart } from "react-icons/io";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";



type UserType = {
  id: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

useEffect(() => {
  async function initAuthAndCart() {
    try {
      // 1️⃣ ensure JWT exists (Google → BetterAuth → JWT)
      await fetch("/api/auth/session-to-jwt", {
        method: "POST",
        credentials: "include",
      });

      // 2️⃣ fetch user
      const userRes = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (userRes.ok) {
        const data = await userRes.json();
        setUser(data);

        // 3️⃣ NOW cart is valid → load count
        await loadCartCount();
      } else {
        setUser(null);
        setCartCount(0);
      }
    } catch {
      setUser(null);
      setCartCount(0);
    } finally {
      setAuthLoading(false);
    }
  }

  initAuthAndCart();
}, []);


const loadCartCount = async () => {
  try {
    const res = await fetch("/api/cart/count", {
      credentials: "include",
    });
    const data = await res.json();
    setCartCount(data.count || 0);
  } catch {
    setCartCount(0);
  }
};


useEffect(() => {
  // initial load
  loadCartCount();

  // update on cart changes
  window.addEventListener("cart-updated", loadCartCount);

  return () => {
    window.removeEventListener("cart-updated", loadCartCount);
  };
}, []);


const fetchCartCount = async () => {
  const res = await fetch("/api/cart/count", {
    credentials: "include",
  });
  const data = await res.json();
  setCartCount(data.count || 0);
};



// if (authLoading) return null;


  useEffect(() => {
  if (!mobileSearchOpen) return;

  const handler = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest("#mobile-search")) {
      setMobileSearchOpen(false);
      setQuery("");
      setSuggestions([]);
    }
  };

  document.addEventListener("mousedown", handler);
  return () => document.removeEventListener("mousedown", handler);
}, [mobileSearchOpen]);



  useEffect(() => {
  if (query.length < 2) {
    setSuggestions([]);
    return;
  }

  const timer = setTimeout(async () => {
    setLoading(true);
    const res = await fetch(`/api/products/suggestions?q=${query}`);
    const data = await res.json();
    setSuggestions(data);
    setLoading(false);
  }, 300); // debounce

  return () => clearTimeout(timer);
}, [query]);



  return (
    <header className="w-full h-auto top-0 z-50 shadow-md">
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
            {/* <div className="hidden lg:flex justify-between relative w-60"> */}
              {/* Search */}
            <div
              className={`hidden lg:block relative transition-all duration-300 ease-in-out
                ${searchFocused ? "w-96" : "w-60"}
              `}
            >
              <input
                type="text"
                placeholder="Search product..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => {
                  // delay so click on suggestion still works
                  setTimeout(() => setSearchFocused(false), 150);
                }}
                className="w-full rounded-md px-4 py-2 pr-10 text-sm text-black outline-none"
              />

              <Search className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 w-4 h-4" />

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-xl rounded-md mt-1 z-[999] border">
                  {suggestions.map((item) => (
                    <Link
                      key={item._id}
                      href={`/products/${item._id}`}
                      onClick={() => {
                        setQuery("");
                        setSuggestions([]);
                        setSearchFocused(false);
                      }}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-sm text-black"
                    >
                      <Image
                        src={item.images?.[0] || "/placeholder.png"}
                        alt={item.title}
                        width={40}
                        height={40}
                        className="rounded object-cover"
                      />
                      <span className="line-clamp-1">{item.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>


              {/* <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 w-4 h-4" />
            </div> */}
          </div>

          {/* Actions */}
          <div className="flex lg:hidden items-center gap-5 text-white">
            <button onClick={() => setMobileSearchOpen(true)}>
              <Search className="w-5 h-5" />
            </button>

            <Link href="/cart">
            <button className="relative">
              <ShoppingCart className="w-5 h-5" />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-blue-600 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            </Link>


            {/* LOGIN */}
            {user ? (
              <Link href="/dashboard" className="font-normal hover:underline">
              <button className="relative">
              <CircleUser className="w-5 h-5" />
              </button>
              </Link>
            ) : (
              <Link href="/dashboard" className="font-normal hover:underline">
              <button className="relative">
              Login
              </button>
              </Link>
            )}
          </div>
        </div>
      </div>
      <hr className="border-t border-gray-500" />

      {/* Mobile Search */}
      <div
        id="mobile-search"
        className={`lg:hidden bg-blue-600 overflow-hidden transition-all duration-300
          ${mobileSearchOpen ? "max-h-960 py-3" : "max-h-0"}
        `}
      >

        <div className="relative px-4">
          <input
            type="text"
            autoFocus
            placeholder="Search product..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white rounded-md px-4 py-3 pr-10 text-sm text-black outline-none"
          />

          <button
            onClick={() => {
              setMobileSearchOpen(false);
              setSuggestions([]);
              setQuery("");
            }}
            className="absolute right-7 top-1/2 -translate-y-1/2"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="relative px-4 bg-white shadow-xl rounded-md mt-2 border">
              {suggestions.map((item) => (
                <Link
                  key={item._id}
                  href={`/products/${item._id}`}
                  onClick={() => {
                    setMobileSearchOpen(false);
                    setQuery("");
                    setSuggestions([]);
                  }}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 text-sm text-black"
                >
                  <Image
                    src={item.images?.[0] || "/placeholder.png"}
                    alt={item.title}
                    width={40}
                    height={40}
                    className="rounded object-cover"
                  />
                  <span className="line-clamp-1">{item.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>


      {/* Mobile Menu */}
        {mobileMenuOpen && (
        <div className="lg:hidden bg-blue-600 border-t border-white/20">
            <nav className="flex flex-col text-white text-sm px-6 py-4 space-y-4">
            <Link href="/shop" onClick={() => setMobileMenuOpen(false)}>All products</Link>
            <Link href="/shop?category=Home+appliances&page=1" onClick={() => setMobileMenuOpen(false)}>Home appliances</Link>
            <Link href="/shop?category=Audio+%26+video&page=1" onClick={() => setMobileMenuOpen(false)}>Audio & video</Link>
            <Link href="/shop?category=Refrigerator&page=1" onClick={() => setMobileMenuOpen(false)}>Refrigerator</Link>
            <Link href="#" onClick={() => setMobileMenuOpen(false)}>New arrivals</Link>
            <Link href="/sale" onClick={() => setMobileMenuOpen(false)}>Today&apos;s deal</Link>
            <Link href="#" onClick={() => setMobileMenuOpen(false)}>Gift cards</Link>
            </nav>
        </div>
        )}



      <div className="bg-blue-600">
        <div className="hidden lg:flex max-w-7xl mx-auto text-white font-bold flex justify-between items-center gap-6 px-4 py-3">


            <Link href="/shop" className="hover:opacity-80">All products</Link>
            <Link href="/shop?category=Home+appliances&page=1" className="hover:opacity-80">Home appliances</Link>
            <Link href="/shop?category=Audio+%26+video&page=1" className="hover:opacity-80">Audio & video</Link>
            <Link href="/shop?category=Refrigerator&page=1" className="hover:opacity-80">Refrigerator</Link>
            <Link href="#" className="hover:opacity-80">New arrivals</Link>
            <Link href="/sale" className="hover:opacity-80">Today&apos;s deal</Link>
            <Link href="#" className="hover:opacity-80">Gift cards</Link>
            <Link href="/cart">
            <button className="relative">
              <ShoppingCart className="w-5 h-5" />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-blue-600 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            </Link>

            {/* LOGIN */}
            {user ? (
              <Link href="/dashboard" className="font-normal hover:underline">
              <button className="relative">
              <CircleUser className="w-5 h-5" />
              </button>
              </Link>
            ) : (
              <Link href="/dashboard" className="font-normal hover:underline">
              <button className="relative">
              Login
              </button>
              </Link>
            )}

        </div>
      </div>
    </header>
  );
}
