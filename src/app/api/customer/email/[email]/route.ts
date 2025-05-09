import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { email: string } }) {
  try {
    const decodedEmail = decodeURIComponent(params.email);

    // Find customer by email in CustomerAccount and include related Customer data
    const account = await prisma.customerAccount.findUnique({
      where: { email: decodedEmail },
      include: { customer: true },
    });

    if (!account || !account.customer) {
      return NextResponse.json({ error: "Customer not found." }, { status: 404 });
    }

    return NextResponse.json({
      id: account.customer.id,
      name: account.customer.name,
      email: account.email,
      location: account.customer.location,
      latitude: account.customer.latitude,
      longitude: account.customer.longitude,
    });
  } catch (error) {
    console.error("Error fetching customer by email:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
