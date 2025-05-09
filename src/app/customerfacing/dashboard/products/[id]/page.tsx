import prisma from "@/lib/prisma";
import CustomerNavbar from "@/components/Navbar/CustomerNavbar";
import Image from "next/image";

interface PageProps {
  params: { id?: string };
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const productId = params?.id;

  if (!productId) {
    return <div className="text-center text-red-500 mt-10">Invalid product ID.</div>;
  }

  // Fetch product details
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { store: true },
  });

  if (!product) {
    return <div className="text-center text-red-500 mt-10">Product not found.</div>;
  }

  return (
    <>
      <CustomerNavbar />
      <main className="max-w-4xl mx-auto p-6 mt-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Product Image */}
          <div className="w-full md:w-1/2">
            {product.imagePath ? (
              <Image
                src={product.imagePath}
                alt={product.name}
                width={500}
                height={500}
                className="w-full h-96 object-cover rounded-xl shadow-lg"
                priority
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-xl">
                <span className="text-gray-500">No Image Available</span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-between w-full">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>
              <p className="text-gray-600 mt-2">{product.description || "No description available."}</p>

              <div className="mt-6">
                <span className="text-blue-600 text-2xl font-semibold">
                  GH₵ {(product.priceInPeswass / 100).toFixed(2)}
                </span>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                <span className="font-medium">Category:</span> {product.category || "N/A"}
              </p>
            </div>

            {/* Store Information */}
            <div className="mt-8 bg-gray-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700">Store Information</h3>
              <p className="text-gray-600">{product.store?.name || "Unknown Store"}</p>
              <p className="text-sm text-gray-500">{product.store?.location || "Location not available"}</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
