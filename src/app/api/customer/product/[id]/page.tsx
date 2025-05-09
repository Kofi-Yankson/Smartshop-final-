import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET method to fetch a specific product by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  console.log("Fetching product with ID:", params.id);
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      console.log("Product not found:", params.id);
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// PUT method to update a specific product by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  console.log("Updating product with ID:", id);

  try {
    const { name, description, priceInPeswass, category, imagePath ,isAvailable} = await req.json();

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { name, description, priceInPeswass, category, imagePath ,isAvailable},
    });

    console.log("Product updated successfully:", updatedProduct);
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
  
}
// DELETE method to remove a product by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  try {
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}