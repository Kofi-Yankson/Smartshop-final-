"use client";
import DefaultNavbar from "@/components/Navbar/DefaultNavbar";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  return (
    <>
      <DefaultNavbar />
      <main className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-full max-w-2xl space-y-8">

          {/* Customer Login Section */}
          <div className="bg-blue-100 p-6 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">Login as a Customer</h2>
            <p className="text-gray-600 mb-4">Access products and find nearby stores.</p>
            <button
              onClick={() => router.push("/customerfacing/login")}
              className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Login as Customer
            </button>
          </div>

          <p className="text-center text-gray-500 font-medium">OR</p>

          {/* Store Login Section */}
          <div className="bg-green-100 p-6 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-semibold text-green-700 mb-2">Login as a Store</h2>
            <p className="text-gray-600 mb-4">Manage your store and products.</p>
            <button
              onClick={() => router.push("/storefacing/login")}
              className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition duration-300"
            >
              Login as Store
            </button>
          </div>

        </div>
      </main>
    </>
  );
}
