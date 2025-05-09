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
      <h1 className="text-xl font-bold">Smart Shop</h1>

      {/* Navigation Links */}
      <div className="space-x-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/home/register" className="hover:underline">
        | Register
        </Link>
        <Link href="/home/login" className="hover:underline">
        | Login
        </Link>
        
      </div>

    </nav>
  );
}
