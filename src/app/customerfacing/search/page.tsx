"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import CustomerNavbar from "@/components/Navbar/CustomerNavbar"; // Include Navbar

interface Product {
  id: string;
  name: string;
  priceInPeswass: number;
  imagePath: string;
  store: {
    name: string;
    latitude: number;
    longitude: number;
  };
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState("price"); // Default sorting by price
  const [customerLocation, setCustomerLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCustomerLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error("Geolocation error:", error)
      );
    }
  }, []);

  useEffect(() => {
    if (query) {
      fetch(`/api/products/search?query=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          let sortedProducts = data;
          
          if (sortBy === "price") {
            sortedProducts = data.sort((a: Product, b: Product) => b.priceInPeswass - a.priceInPeswass);
          } else if (sortBy === "distance" && customerLocation) {
            sortedProducts = data.sort((a: Product, b: Product) => {
              const distanceA = getDistance(customerLocation.lat, customerLocation.lng, a.store.latitude, a.store.longitude);
              const distanceB = getDistance(customerLocation.lat, customerLocation.lng, b.store.latitude, b.store.longitude);
              return distanceA - distanceB;
            });
          }

          setProducts(sortedProducts);
        })
        .catch((error) => console.error("Error fetching products:", error));
    }
  }, [query, sortBy, customerLocation]);

  // Haversine formula to calculate distance
  function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  return (
    <>
      <CustomerNavbar /> {/* Add Navbar here */}
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>
        
        {/* Sorting Dropdown */}
        <div className="mb-4">
          <label className="mr-2 font-semibold">Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border p-2">
            <option value="price">Most Expensive</option>
            <option value="distance">Closest Store</option>
          </select>
        </div>

        {/* Product List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="border p-4 rounded-lg shadow-md">
                <img src={product.imagePath} alt={product.name} className="w-full h-40 object-cover rounded" />
                <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
                <p className="text-gray-600">GH₵ {(product.priceInPeswass / 100).toFixed(2)}</p>
                <p className="text-sm text-gray-500">Store: {product.store.name}</p>
                <Link href={`/customerfacing/dashboard/products/${product.id}`} className="text-blue-600 hover:underline">
                  View Details
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No products found.</p>
          )}
        </div>
      </main>
    </>
  );
}
