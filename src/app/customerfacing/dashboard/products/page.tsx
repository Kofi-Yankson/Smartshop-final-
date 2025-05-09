import CustomerNavbar from "@/components/Navbar/CustomerNavbar";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CustomerProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      store: {
        select: { name: true },
      },
    },
  });

  if (products.length === 0) {
    return <div className="text-center text-red-500">No products available.</div>;
  }

  return (
    <>
      <CustomerNavbar />
      <main className="p-8">
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">Available Products</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white border rounded-2xl shadow-md hover:shadow-lg transition p-4"
            >
              {/* Product Image */}
              <img
                src={product.imagePath}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />

              {/* Product Name */}
              <h2 className="text-xl font-semibold text-gray-800 mb-1">{product.name}</h2>

              {/* Store Name */}
              <p className="text-sm text-gray-500 mb-2">Sold by: {product.store.name}</p>

              {/* Price and Availability */}
              <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-bold text-blue-600">GH₵ {(product.priceInPeswass / 100).toFixed(2)}</p>
                <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
                  In Stock
                </span>
              </div>

              {/* View Details Button */}
              <Link href={`/customerfacing/dashboard/products/${product.id}`}>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md">
                  View Product
                </button>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
