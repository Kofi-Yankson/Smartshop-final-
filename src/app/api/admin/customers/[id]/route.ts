import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET method to fetch all stores with their products
export async function GET(req: Request, { params }: { params: { customerId: string } }) {
    try {
      const { customerId } = params;
  
      // Find the customer by ID and include related account info
      const customer = await prisma.customer.findUnique({
        where: { id: customerId },
        include: {
          account: true, // Include the associated account details
        },
      });
  
      if (!customer) {
        return NextResponse.json({ error: "Customer not found" }, { status: 404 });
      }
  
      return NextResponse.json(customer, { status: 200 });
    } catch (error) {
      console.error("Error fetching customer:", error);
      return NextResponse.json({ error: "Failed to fetch customer details" }, { status: 500 });
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
