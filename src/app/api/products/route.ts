import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";

// POST method for adding a product
export async function POST(req: Request) {
  try {
    // Parse the form data
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const priceInPeswass = Number(formData.get("price"));
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const storeId = formData.get("storeId") as string;
    const image = formData.get("image") as File;

    // Check if required fields are provided
    if (!name || !priceInPeswass || !storeId || !image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify store exists
    const storeExists = await prisma.store.findUnique({ where: { id: storeId } });

    if (!storeExists) {
      return NextResponse.json({ error: "Store not found" }, { status: 400 });
    }

    // Save image locally
    const fileExtension = image.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExtension}`;
    const filePath = path.join(process.cwd(), "public/uploads", fileName);

    // Convert the image to a buffer and save it to the server
    const imageBuffer = Buffer.from(await image.arrayBuffer());
    await writeFile(filePath, imageBuffer);

    const imagePath = `/uploads/${fileName}`;

    // Save product to the database
    const newProduct = await prisma.product.create({
      data: {
        name,
        priceInPeswass,
        description,
        category,
        storeId,
        imagePath, // Store the image path in the database
      },
    });

    return NextResponse.json({ message: "Product added successfully!", product: newProduct }, { status: 201 });
  } catch (error: any) {
    console.error("Error adding product:", error);

    // Check for specific Prisma error codes
    if (error.code === "P2003") {
      return NextResponse.json({ error: "Foreign key constraint failed. Store may not exist." }, { status: 400 });
    }

    // Catch-all for internal server errors
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET method to fetch all products for a specific store
export async function GET(req: Request) {
  try {
    // Extract storeId from the query parameters
    const url = new URL(req.url);
    const storeId = url.searchParams.get("storeId");

    if (!storeId) {
      return NextResponse.json({ error: "Store ID is required" }, { status: 400 });
    }

    // Fetch all products from the store
    const products = await prisma.product.findMany({
      where: {
        storeId, // Filter by the store ID
      },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
