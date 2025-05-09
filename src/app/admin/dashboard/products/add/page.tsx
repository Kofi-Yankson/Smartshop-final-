"use client";

import { useState } from "react";
import AdminNavbar from "@/components/Navbar/AdminNavbar";
import { useRouter } from "next/navigation";

interface NewProduct {
  name: string;
  priceInPeswass: number;
  category: string;
  description: string;
  image: File | null;
}

export default function AdminAddProductPage() {
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: "",
    priceInPeswass: 0,
    category: "",
    description: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewProduct((prevState) => ({
        ...prevState,
        image: e.target.files[0],
      }));
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.image) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", String(newProduct.priceInPeswass));
    formData.append("category", newProduct.category);
    formData.append("description", newProduct.description);
    formData.append("image", newProduct.image);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        router.push("/admin/products"); // Navigate to the product list after adding
      } else {
        console.error("Failed to add product:", data.error);
      }
    } catch (error) {
      console.error("❌ Error adding product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminNavbar />
      <main className="p-6 max-w-7xl mx-auto">
        <div className="bg-white shadow-lg rounded-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Add New Product</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              className="p-2 border border-gray-300 rounded"
              value={newProduct.name}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="priceInPeswass"
              placeholder="Price"
              className="p-2 border border-gray-300 rounded"
              value={newProduct.priceInPeswass}
              onChange={handleInputChange}
            />
            <select
              name="category"
              value={newProduct.category}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Groceries">Groceries</option>
              <option value="Furniture">Furniture</option>
              <option value="Books">Books</option>
              <option value="Toys">Toys</option>
              <option value="Beauty">Beauty</option>
              <option value="Sports">Sports</option>
            </select>

            <textarea
              name="description"
              placeholder="Description"
              className="p-2 border border-gray-300 rounded col-span-2"
              value={newProduct.description}
              onChange={handleInputChange}
            ></textarea>

            <input
              type="file"
              name="image"
              accept="image/*"
              className="col-span-2 p-2"
              onChange={handleFileChange}
            />
          </div>

          <button
            onClick={handleAddProduct}
            className="bg-green-500 text-white px-6 py-2 rounded mt-6 w-full hover:bg-green-600"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </main>
    </>
  );
}
