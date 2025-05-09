"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StoreNavbar from "./StoreNavbar";

export default function CustomerNavbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/customerfacing/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="bg-blue-700 text-white py-4 px-6 flex justify-between items-center">
      <h1 className="text-xl font-bold"><Link href="/customerfacing" className="hover:underline">
          Smart Shop
        </Link></h1>

      {/* Navigation Links */}
      <div className="space-x-4">
       
        <Link href="/customerfacing/dashboard/stores" className="hover:underline">
           Stores
        </Link>
        <Link href="/customerfacing/dashboard/products" className="hover:underline">
         | Products
        </Link>
        
        <Link href="/customerfacing/dashboard/profile" className="hover:underline">
         | Profile
        </Link>
        <Link href="/customerfacing/dashboard/chatbot" className="hover:underline">
         | Chatbot
        </Link>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex items-center bg-white rounded-lg overflow-hidden">
        <input
          type="text"
          placeholder="Search for products..."
          className="px-4 py-2 text-black outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} />
        <button
          type="submit"
          className="bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-800"
        >
          Search
        </button>
      </form>

      {/* Logout */}
      <Link href="/" className="bg-red-500 px-4 py-2 rounded-lg text-white font-semibold hover:bg-red-600">
        Log Out
      </Link>
    </nav>
  );
}
