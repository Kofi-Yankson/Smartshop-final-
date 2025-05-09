"use client";
import DefaultNavbar from "@/components/Navbar/DefaultNavbar";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <DefaultNavbar />
      <main className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-full max-w-2xl space-y-8">

          {/* Customer Section */}
          <div className="bg-green-100 p-6 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-semibold text-green-700 mb-2">Create a Customer Account</h2>
            <p className="text-gray-600 mb-4">Explore and find products and stores near your area.</p>
            <button
              onClick={() => router.push("/customerfacing/register")}
              className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 transition duration-300"
            >
              Register as a Customer
            </button>
          </div>

          <p className="text-center text-gray-500 font-medium">OR</p>

          {/* Store Section */}
          <div className="bg-blue-100 p-6 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">Create a Store Account</h2>
            <p className="text-gray-600 mb-4">Manage and showcase your store's products to nearby customers.</p>
            <button
              onClick={() => router.push("/storefacing/register")}
              className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Register as a Store
            </button>
          </div>

        </div>
      </main>
    </>
  );
}
