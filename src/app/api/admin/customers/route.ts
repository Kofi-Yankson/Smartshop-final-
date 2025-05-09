import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET method to fetch all customers for the admin
export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        account: true,
      },
    });

    return NextResponse.json(customers, { status: 200 });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

// POST method to register a new customer (admin-side)
export async function POST(req: Request) {
  try {
    const { name, email, password, location, latitude, longitude } = await req.json();

    // Check if email already exists
    const existingAccount = await prisma.customerAccount.findUnique({
      where: { email },
    });

    if (existingAccount) {
      return NextResponse.json({ error: "Email is already in use." }, { status: 400 });
    }

    // Create customer profile
    const customer = await prisma.customer.create({
      data: {
        name,
        location,
        latitude,
        longitude,
      },
    });

    // Create associated login account
    await prisma.customerAccount.create({
      data: {
        email,
        password, // ⚠️ Password should be hashed in production!
        customerId: customer.id,
      },
    });

    return NextResponse.json({ message: "Customer added successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Admin error adding customer:", error);
    return NextResponse.json({ error: "Failed to add customer" }, { status: 500 });
  }
}
