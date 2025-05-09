import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET method to fetch all products with store info
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        store: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
      },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching all products:", error);
    return NextResponse.json({ error: "Failed to fetch all products" }, { status: 500 });
  }
}
