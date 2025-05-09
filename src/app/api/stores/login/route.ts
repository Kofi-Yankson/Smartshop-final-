import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const storeAccount = await prisma.storeAccount.findUnique({
      where: { email },
    });

    if (!storeAccount || storeAccount.password !== password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    return NextResponse.json({ message: "Login successful", storeId: storeAccount.storeId }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
