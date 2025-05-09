import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET method to fetch all stores for the admin
export async function GET() {
  try {
    // Fetch all stores from the database
    const stores = await prisma.store.findMany({
      include: {
        products: true, // Optionally include products for each store
        storeAccount: true, // Optionally include the store's account details
      },
    });

    return NextResponse.json(stores, { status: 200 });
  } catch (error) {
    console.error("Error fetching stores:", error);
    return NextResponse.json({ error: "Failed to fetch stores" }, { status: 500 });
  }
}
