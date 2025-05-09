import prisma from "@/lib/prisma";
import CustomerNavbar from "@/components/Navbar/CustomerNavbar";
import Link from "next/link";

interface PageProps {
  params: { id: string };
}

export default async function StoreDetailsPage({ params }: PageProps) {
  const { id } = params;

  // Fetch store details from Prisma
  const store = await prisma.store.findUnique({
    where: { id },
    include: { products: true },
  });

  if (!store) {
    return <div className="text-center text-red-500">Store not found</div>;
  }

  return (
    <>
      <CustomerNavbar />
      <main className="p-6">
        <h1 className="text-3xl font-bold text-center mb-4">{store.name}</h1>
        <p className="text-center text-gray-600">Category: {store.category}</p>
        <p className="text-center text-gray-500 mb-6">{store.description}</p>

        <h2 className="text-2xl font-semibold mt-4 mb-4 text-center">Products Available</h2>

        {store.products.length === 0 ? (
          <p className="text-center text-red-500">No products available in this store.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {store.products.map((product) => (
              <div key={product.id} className="border p-4 rounded-lg shadow-lg bg-white">
                <img
                  src={product.imagePath}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600">Price: GH₵ {(product.priceInPeswass / 100).toFixed(2)}</p>
                <p className="text-gray-500 text-sm">{product.description}</p>

                <Link href={`/customerfacing/dashboard/products/${product.id}`}>
                  <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded w-full">
                    View Details
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
