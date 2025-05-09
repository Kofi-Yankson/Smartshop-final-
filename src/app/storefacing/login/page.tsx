"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DefaultNavbar from "@/components/Navbar/DefaultNavbar";

export default function StoreLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/stores/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("storeId", data.storeId); // ✅ Store ID
        router.push("/storefacing"); // ✅ Redirect to store dashboard
      } else {
        setError(data.error || "Login failed.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <DefaultNavbar />
      <main className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold text-center mb-4 text-blue-500">Store Login</h2>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
