"use client";

import { useEffect, useState } from "react";
import AdminNavbar from "@/components/Navbar/AdminNavbar";
import { useRouter } from "next/navigation"; // ✅ Correct import for Next.js 13+ app routing

export default function AdminCustomerPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // ✅ Correct usage of useRouter hook

  // Fetch all customers with related customerAccount
  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/admin/customers");
      const data = await res.json();
      if (res.ok) {
        setCustomers(data);
      } else {
        console.error("Error fetching customers:", data.error);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete customer
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    try {
      const res = await fetch(`/api/admin/customers/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCustomers((prev) => prev.filter((c) => c.id !== id));
      } else {
        const errorData = await res.json();
        console.error("Delete failed:", errorData.error);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin h-10 w-10 border-t-4 border-blue-500 rounded-full"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <main className="p-6 min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">All Customers</h1>

        {/* Add Customer Button */}
        <div className="flex justify-end mb-4">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
            onClick={() => router.push("/admin/dashboard/customers/add")}
          >
            Add Customer
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <div key={customer.id} className="bg-white rounded-xl shadow p-4">
              <h2 className="text-xl font-semibold mb-1">{customer.name}</h2>
              <p className="text-gray-600 mb-1">{customer.email}</p>

              {/* Related customerAccount Info */}
              {customer.customerAccount ? (
                <div className="text-sm text-gray-700 mb-2">
                  <p><strong>Account ID:</strong> {customer.customerAccount.id}</p>
                  <p><strong>Account Type:</strong> {customer.customerAccount.accountType}</p>
                  {/* Add more fields as needed */}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-2 italic">No customer account linked</p>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded"
                  onClick={() => router.push(`/admin/dashboard/customers/${customer.id}`)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(customer.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
