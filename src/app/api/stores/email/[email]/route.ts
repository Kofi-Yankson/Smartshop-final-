import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, context: { params: { email: string } }) {
  try {
    const { email } = context.params; // Properly destructuring params
    const decodedEmail = decodeURIComponent(email);

    console.log("🔹 Received email in API:", decodedEmail);

    // Find store account by email and include related store data
    const storeAccount = await prisma.storeAccount.findUnique({
      where: { email: decodedEmail },
      include: { store: true },
    });

    console.log("✅ Store account from DB:", storeAccount);

    if (!storeAccount || !storeAccount.store) {
      console.error("❌ Store account not found for:", decodedEmail);
      return NextResponse.json({ error: "Store account not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: storeAccount.store.id,
      name: storeAccount.store.name,
      category: storeAccount.store.category,
      description: storeAccount.store.description,
      location: storeAccount.store.location,
      latitude: storeAccount.store.latitude,
      longitude: storeAccount.store.longitude,
      searchCount: storeAccount.store.searchCount,
      email: storeAccount.email, // Keeping email for reference
    });
  } catch (error) {
    console.error("🔥 Error fetching store by email:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
