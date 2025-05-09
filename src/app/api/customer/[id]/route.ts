import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET method to fetch all stores with their products
export async function GET() {
  try {
    const stores = await prisma.store.findMany({
      include: {
        products: true,
        storeAccount: true,
      },
    });

    const customers = await prisma.customer.findMany({
      include: {
        account: true,
      },
    });

    return NextResponse.json({ stores, customers }, { status: 200 });
  } catch (error) {
    console.error("Error fetching stores and customers:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

// POST method to create a new store
export async function POST(req: Request) {
  try {
    const { name, category, description, location, latitude, longitude } = await req.json();

    const newStore = await prisma.store.create({
      data: {
        name,
        category,
        description,
        location,
        latitude,
        longitude,
      },
    });

    return NextResponse.json(newStore, { status: 201 });
  } catch (error) {
    console.error("Error creating store:", error);
    return NextResponse.json({ error: "Failed to create store" }, { status: 500 });
  }
}
