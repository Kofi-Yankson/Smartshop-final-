"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Product deleted successfully!");
        router.push("/storefacing/dashboard/products");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete product.");
      }
    } catch (error) {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
    >
      {loading ? "Deleting..." : "Delete Product"}
    </button>
  );
}
