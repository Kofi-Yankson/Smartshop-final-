"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/Navbar/AdminNavbar";

export default function AdminStoresPage() {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch("/api/admin/stores");
        const data = await res.json();
        if (res.ok) {
          setStores(data);
        } else {
          console.error("Error fetching stores:", data.error);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  // Handle delete store
  const handleDelete = async (storeId: string) => {
    try {
      const res = await fetch(`/api/admin/stores/${storeId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setStores(stores.filter((store) => store.id !== storeId));
      } else {
        console.error("Error deleting store:", data.error);
      }
    } catch (error) {
      console.error("Error deleting store:", error);
    }
  };

  // Handle edit button (redirect to store edit page)
  const handleEdit = (storeId: string) => {
    router.push(`/admin/stores/edit/${storeId}`);
  };

  // Handle view details button (redirect to store details page)
  const handleDetails = (storeId: string) => {
    router.push(`/admin/stores/details/${storeId}`);
  };

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
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Stores Management</h1>

        {/* Add Store Button */}
        <div className="flex justify-end mb-4">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
            onClick={() => router.push("/admin/stores/add")}
          >
            Add Store
          </button>
        </div>

        <section className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-4xl mb-8">
          <h2 className="text-xl font-semibold mb-4">Total Stores: {stores.length}</h2>

          {stores.length > 0 ? (
            <ul className="space-y-4">
              {stores.map((store) => (
                <li key={store.id} className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold">{store.name}</h3>
                  <p className="text-sm text-gray-500">Category: {store.category}</p>
                  <p className="text-sm text-gray-500">Location: {store.location}</p>

                  {/* Buttons: Edit, Details, Delete */}
                  <div className="mt-4 flex gap-2">
                    <button
                      className="bg-yellow-500 text-white py-1 px-3 rounded-lg"
                      onClick={() => handleEdit(store.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-blue-500 text-white py-1 px-3 rounded-lg"
                      onClick={() => handleDetails(store.id)}
                    >
                      Details
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-3 rounded-lg"
                      onClick={() => handleDelete(store.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No stores available</p>
          )}
        </section>
      </main>
    </>
  );
}
