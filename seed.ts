import prisma from "@/lib/prisma"; // Ensure correct import

async function main() {
  // Create Electronic Store
  const store = await prisma.store.create({
    data: {
      name: "Electronic Store",
      category: "Electronics",
      description: "Your one-stop shop for quality electronic gadgets and accessories.",
      location: "Accra Mall",
      latitude: 5.6037,
      longitude: -0.1870,
      searchCount: 0,
    },
  });

  // Add products to the Electronic Store
  await prisma.product.createMany({
    data: [
      {
        name: "Charger",
        priceInPeswass: 5000,
        imagePath: "/images/charger.jpg",
        description: "Fast-charging power adapter compatible with most smartphones and tablets.",
        category: "Accessories",
        isAvailable: true,
        storeId: store.id,
      },
      {
        name: "Speaker",
        priceInPeswass: 15000,
        imagePath: "/images/charger.jpg", // Assuming same image for now
        description: "Portable Bluetooth speaker with high-quality sound and deep bass.",
        category: "Audio",
        isAvailable: true,
        storeId: store.id,
      },
    ],
  });

  console.log("Electronic Store and products added successfully!");
}

// Run the script
main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
