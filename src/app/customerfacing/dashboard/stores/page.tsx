import CustomerNavbar from "@/components/Navbar/CustomerNavbar";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CustomerStoresPage() {
  const stores = await prisma.store.findMany();

  if (stores.length === 0) {
    return <div className="text-center text-red-500">No stores available.</div>;
  }

  return (
    <>
      <CustomerNavbar />
      <main className="p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Available Stores</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {stores.map((store) => (
            <div key={store.id} className="border p-4 rounded-lg shadow-lg bg-white">
              <h2 className="text-lg font-semibold">{store.name}</h2>
              <p className="text-gray-600">Category: {store.category}</p>
              <p className="text-gray-500">Location: {store.location}</p>
              <Link href={`/customerfacing/dashboard/stores/${store.id}`}>
                <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
                  View Store
                </button>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
