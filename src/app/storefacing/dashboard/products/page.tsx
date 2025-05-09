"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StoreNavbar from "@/components/Navbar/StoreNavbar";

interface Product {
  id: string;
  name: string;
  priceInPeswass: number;
  imagePath: string;
  description: string;
  category: string;
  isAvailable: boolean;
}

interface NewProduct {
  name: string;
  priceInPeswass: number;
  category: string;
  description: string;
  image: File | null;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: "",
    priceInPeswass: 0,
    category: "",
    description: "",
    image: null,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const storeId = localStorage.getItem("storeId");

        if (!storeId) {
          console.error("❌ No store ID found in local storage.");
          return;
        }

        const res = await fetch(`/api/products?storeId=${storeId}`);
        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();
        setProducts(data); // Store all products
        setRecentProducts(data.slice(0, 5)); // Get the first 5 recently added products
      } catch (error) {
        console.error("❌ Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {  // Ensure files is not null and has at least one file
      setNewProduct((prevState) => ({
        ...prevState,
        image: e.target.files[0], // Set the selected file
      }));
    }
  };

  const handleAddProduct = async () => {
    const storeId = localStorage.getItem("storeId");
    if (!storeId || !newProduct.image) return;

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", String(newProduct.priceInPeswass));
    formData.append("category", newProduct.category);
    formData.append("description", newProduct.description);
    formData.append("storeId", storeId);
    formData.append("image", newProduct.image);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        // Update the local state with the new product after successful addition
        setProducts((prev) => [data.product, ...prev]);

        // Clear the form after adding the product
        setNewProduct({
          name: "",
          priceInPeswass: 0,
          category: "",
          description: "",
          image: null,
        });
      } else {
        console.error("Failed to add product:", data.error);
      }
    } catch (error) {
      console.error("❌ Error adding product:", error);
    }
  };

  return (
    <>
      <StoreNavbar />
      <main className="p-6 max-w-7xl mx-auto">
        {/* Add New Product Form */}
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

            {/* Category Selection Dropdown */}
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
          >
            Add Product
          </button>
        </div>

        {/* Recently Added Products */}
        <h2 className="text-2xl font-bold mb-4 text-center">Recently Added Products</h2>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : recentProducts.length === 0 ? (
          <p className="text-center">No recently added products found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {recentProducts.map((product) => (
              <div key={product.id} className="border p-4 rounded shadow-md">
                <img
                  src={product.imagePath}
                  alt={product.name}
                  className="w-full h-40 object-cover mb-2"
                />
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.category}</p>
                <p className="font-bold">GH₵ {product.priceInPeswass / 100}</p>
                <p className={`text-sm ${product.isAvailable ? "text-green-600" : "text-red-600"}`}>
                  {product.isAvailable ? "Available" : "Out of Stock"}
                </p>
                {/* Action Buttons */}
                <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => router.push(`products/${product.id}`)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      View
                    </button>


                  </div>
              </div>
            ))}
          </div>
        )}

        {/* All Products from the Store */}
        <h2 className="text-2xl font-bold mb-4 text-center">All Products from Your Store</h2>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-center">No products found in your store.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => {
              return (
                <div key={product.id} className="border p-4 rounded shadow-md">
                  <img
                    src={product.imagePath}
                    alt={product.name}
                    className="w-full h-40 object-cover mb-2" />
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.category}</p>
                  <p className="font-bold">GH₵ {product.priceInPeswass / 100}</p>
                  <p className={`text-sm ${product.isAvailable ? "text-green-600" : "text-red-600"}`}>
                    {product.isAvailable ? "Available" : "Out of Stock"}
                  </p>
                  {/* Action Buttons */}
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => router.push(`products/${product.id}`)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      View
                    </button>


                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
