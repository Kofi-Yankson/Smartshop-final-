import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json({ error: "Missing store account ID" }, { status: 400 });
    }

    const store = await prisma.store.findUnique({
      where: { id },
      include: { storeAccount: true },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    return NextResponse.json(store, { status: 200 });
  } catch (error) {
    console.error("Error fetching store:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;
    const body = await req.json();
    const { name, location, category, latitude, longitude } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing store ID" }, { status: 400 });
    }

    const updatedStore = await prisma.store.update({
      where: { id },
      data: { name, location, category ,latitude, longitude },
    });

    return NextResponse.json(updatedStore, { status: 200 });
  } catch (error) {
    console.error("Error updating store:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
