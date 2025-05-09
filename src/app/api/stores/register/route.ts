import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received Request Body:", body);  // ✅ Debugging line

    const { name, category, location, description, latitude, longitude, email, password } = body;

    if (!name || !location || !email || !password || !latitude || !longitude) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Ensure latitude & longitude are numbers
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    if (isNaN(lat) || isNaN(lon)) {
      return NextResponse.json({ error: "Invalid latitude or longitude" }, { status: 400 });
    }

    // Check if the email is already registered
    const existingAccount = await prisma.storeAccount.findUnique({
      where: { email },
    });

    if (existingAccount) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    // Create store
    const store = await prisma.store.create({
      data: {
        name,
        category: category || "Retail",
        location,
        description,
        latitude: lat,
        longitude: lon,
      },
    });

    // Create store account
    const storeAccount = await prisma.storeAccount.create({
      data: {
        email,
        password, // 🚨 Consider hashing the password before saving!
        storeId: store.id,
      },
    });

    return NextResponse.json({ message: "Store registered successfully!" }, { status: 201 });

  } catch (error) {
    console.error("Error registering store:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
