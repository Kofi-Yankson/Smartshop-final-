"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DefaultNavbar from "@/components/Navbar/DefaultNavbar";

export default function CustomerLogin() {
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
      const res = await fetch("/api/customer/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        // Store customer data in localStorage (since no session control)
        localStorage.setItem("customer", JSON.stringify(data));
        // Redirect to customer-facing page
        router.push("/customerfacing");
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <DefaultNavbar />
      <main className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">Customer Login</h2>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-6">

            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-4 text-sm">
            Don't have an account?{" "}
            <span
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={() => router.push("/customerfacing")}
            >
              Create one
            </span>
          </p>
        </div>
      </main>
    </>
  );
}
