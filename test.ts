import prisma from "@/lib/prisma";
//Testing if items exist in the prisma database
async function checkProduct() {
  const product = await prisma.product.findUnique({
    where: { id: "c8b2b95c-9aa8-4743-ad02-b166c3466c49" },
  });

  console.log(product);
}

checkProduct();
