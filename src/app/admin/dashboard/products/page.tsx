"use client";

import { useEffect, useState } from "react";
import AdminNavbar from "@/components/Navbar/AdminNavbar";
import { useRouter } from "next/navigation";

export default function AdminProductPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/admin/products");
        const data = await res.json();
        if (res.ok) {
          setProducts(data);
        } else {
          console.error("Error fetching products:", data.error);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle delete product
  const handleDelete = async (productId: string) => {
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setProducts(products.filter((product) => product.id !== productId));
      } else {
        console.error("Error deleting product:", data.error);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Handle edit button (redirect to product edit page)
  const handleEdit = (productId: string) => {
    router.push(`/admin/products/${productId}/edit`);
  };

  // Handle view details button (redirect to product details page)
  const handleDetails = (productId: string) => {
    router.push(`/admin/dashboard/products/${productId}`);
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
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">All Products</h1>

        {/* Add Product Button
        <div className="flex justify-end mb-4">
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
            onClick={() => router.push("/admin/dashboard/products/add")}
          >
            Add Product
          </button>
        </div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow p-4">
              <img
                src={product.imagePath}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-sm text-gray-500">Category: {product.category}</p>
              <p className="text-sm text-gray-500">Price: ₵{(product.priceInPeswass / 100).toFixed(2)}</p>
              <p className="text-sm text-gray-500">Store: {product.store?.name || "N/A"}</p>

              {/* Buttons: Edit, Details, Delete */}
              <div className="mt-4 flex gap-2">
                <button
                  className="bg-yellow-500 text-white py-1 px-3 rounded-lg"
                  onClick={() => handleEdit(product.id)}
                >
                  Edit
                </button>
                <button
                  className="bg-blue-500 text-white py-1 px-3 rounded-lg"
                  onClick={() => handleDetails(product.id)}
                >
                  Details
                </button>
                <button
                  className="bg-red-500 text-white py-1 px-3 rounded-lg"
                  onClick={() => handleDelete(product.id)}
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
