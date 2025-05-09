import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

    // Create the customer with their selected location and coordinates
    const customer = await prisma.customer.create({
      data: {
        name,
        location,
        latitude,
        longitude,
      },
    });

    // Create the associated account
    await prisma.customerAccount.create({
      data: {
        email,
        password, // Still needs hashing in production!
        customerId: customer.id,
      },
    });

    return NextResponse.json({ message: "Registration successful!" }, { status: 201 });
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
