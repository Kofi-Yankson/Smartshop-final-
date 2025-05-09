import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import StoreNavbar from "@/components/Navbar/StoreNavbar";
import DeleteProductButton from "@/components/DeleteProductButton";

interface PageProps {
  params: { id: string };
}

export default async function ProductDetailsPage({ params }: PageProps) {
  if (!params?.id) return notFound(); // Handle invalid IDs properly

  // Fetch product details with store info
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { store: true },
  });
  
  
  
  if (!product) return notFound(); // Show a 404 if the product isn't found

  return (
    <>
      <StoreNavbar />
      <main className="max-w-4xl mx-auto p-6 mt-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image Section */}
          <img
            src={product.imagePath}
            alt={product.name}
            className="w-full md:w-1/2 h-96 object-cover rounded-xl shadow-lg"
          />

          {/* Product Details Section */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>
              <p className="text-gray-600 mt-2">{product.description}</p>

              <div className="mt-6">
                <span className="text-blue-600 text-2xl font-semibold">
                  GH₵ {(product.priceInPeswass / 100).toFixed(2)}
                </span>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Category: <span className="text-gray-700 font-medium">{product.category}</span>
              </p>

              {/* Availability Checkbox */}
              <div className="mt-4">
                <p className="text-sm text-gray-500">Availability:</p>
                <div className="flex items-center mt-1">
                  <input
                    type="checkbox"
                    checked={product.isAvailable}
                    disabled
                    className="mr-2 w-5 h-5"
                  />
                  <span className="text-gray-700 font-medium">
                    {product.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>
            </div>

            {/* Store Information Section (Kept As Is) */}
            <div className="mt-8 bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700">Store Information</h3>
              <p className="text-gray-600">{product.store?.name}</p>
              <p className="text-sm text-gray-500">{product.store?.location}</p>
            </div>

            {/* Edit & Delete Buttons */}
            <div className="mt-6 flex gap-4">
              <Link href={`/storefacing/dashboard/products/${product.id}/edit`}>
                <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                  Edit Product
                </button>
              </Link>

              {/* Delete Button */}
              <DeleteProductButton productId={product.id} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
