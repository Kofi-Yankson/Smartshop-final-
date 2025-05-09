import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Find the CustomerAccount by email and include the associated Customer
    const account = await prisma.customerAccount.findUnique({
      where: { email },
      include: { customer: true },
    });

    if (!account || !account.customer) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    // Directly compare passwords since they are stored in plain text
    if (password !== account.password) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    // Return customer data
    return NextResponse.json({
      id: account.customer.id,
      name: account.customer.name,
      email: account.email,
      location: account.customer.location,
      latitude: account.customer.latitude,
      longitude: account.customer.longitude,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
