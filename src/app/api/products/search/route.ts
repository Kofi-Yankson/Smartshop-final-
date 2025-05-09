import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query")?.trim();

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: query,
        },
      },
      include: {
        store: true,
      },
    });

    if (!products.length) {
      return NextResponse.json({ message: "No products found" }, { status: 404 });
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    return NextResponse.json({ error: "Failed to search products" }, { status: 500 });
  }
}
