"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/Navbar/AdminNavbar";
import dynamic from "next/dynamic"; // Dynamic import for client-side rendering




export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminId = localStorage.getItem("AdminId");
    if (!adminId) {
      router.push("/admin");
      return;
    }

    const fetchAdminData = async () => {
      try {
        const res = await fetch("/api/admin");
        const json = await res.json();
        if (res.ok) {
          setData(json);
        } else {
          console.error("Error fetching admin data:", json.error);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [router]);

 



  return (
    <>
      <AdminNavbar />
      <main className="p-6 min-h-screen bg-gray-100 flex flex-col items-center justify-start">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

        
      </main>
    </>
  );
}
