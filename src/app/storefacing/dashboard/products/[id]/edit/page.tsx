"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import StoreNavbar from "@/components/Navbar/StoreNavbar"; // ✅ Import Navbar

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams(); // Get product ID from URL
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priceInPeswass: "",
    category: "",
    imagePath: "",
    isAvailable: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null); // ✅ New Image File State
  const [imagePreview, setImagePreview] = useState<string | null>(null); // ✅ Image Preview

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) {
        const product = await res.json();
        setFormData({
          name: product.name,
          description: product.description,
          priceInPeswass: (product.priceInPeswass / 100).toString(),
          category: product.category,
          imagePath: product.imagePath, // ✅ Store Existing Image
          isAvailable: product.isAvailable
        });
        setImagePreview(product.imagePath); // ✅ Set Preview
      }
    }
    if (id) fetchProduct();
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file); // ✅ Store the new image file
      setImagePreview(URL.createObjectURL(file)); // ✅ Generate preview
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const updatedData = { ...formData, priceInPeswass: parseInt(formData.priceInPeswass) * 100 };
    
    let uploadedImagePath = formData.imagePath;

    // ✅ Handle Image Upload if a new file is selected
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);

      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      if (uploadRes.ok) {
        const { imageUrl } = await uploadRes.json();
        uploadedImagePath = imageUrl; // ✅ Use new image URL
      }
    }

    // ✅ Send updated product data
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...updatedData, imagePath: uploadedImagePath }),
    });

    if (res.ok) {
      router.push(`/storefacing/dashboard/products/${id}`); // ✅ Redirect after update
    }
  }

  return (
    <>
      <StoreNavbar /> {/* ✅ Add Navbar */}
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Edit Product</h1>

        <div className="bg-white shadow-lg rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Product Image */}
            {imagePreview && (
              <div className="text-center">
                <img
                  src={imagePreview}
                  alt="Product"
                  className="w-48 h-48 object-cover mx-auto rounded-lg shadow"
                />
              </div>
            )}

            {/* File Input to Change Image */}
            <input
              type="file"
              name="image"
              accept="image/*"
              className="w-full p-2 border border-gray-300 rounded"
              onChange={handleFileChange}
            />

            {/* Product Name */}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Product Name"
              required
            />

            {/* Price */}
            <input
              type="number"
              name="priceInPeswass"
              value={formData.priceInPeswass}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Price (GHC)"
              required
            />

            {/* Category Dropdown */}
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
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

            {/* Description */}
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Description"
              required
            ></textarea>
          <label className="flex items-center space-x-2">
        <input
    type="checkbox"
    name="isAvailable"
    checked={formData.isAvailable}
    onChange={(e) =>
      setFormData({ ...formData, isAvailable: e.target.checked })
    }
    className="w-5 h-5"
  />
  <span>Available</span>
</label>


            {/* Submit Button */}
            <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded w-full hover:bg-blue-600">
              Update Product
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
