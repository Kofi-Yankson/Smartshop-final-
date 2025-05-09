

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    const stores = await prisma.store.findMany();
    const customers = await prisma.customer.findMany();

    return NextResponse.json({
      products,
      stores,
      customers,
    });
  } catch (error) {
    console.error("Error fetching admin data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
