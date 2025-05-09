"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CustomerNavbar from "@/components/Navbar/CustomerNavbar";
import ProductSlider from "@/components/ProductSlider";

export default function HomePage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);

  useEffect(() => {
    const storedCustomer = localStorage.getItem("customer");

    if (storedCustomer) {
      setCustomer(JSON.parse(storedCustomer));
    } else {
      router.push("/customerfacing/login");
    }
  }, [router]);

  if (!customer) {
    return <div className="text-center text-gray-600">Loading customer data...</div>;
  }

  return (
    <>
      <CustomerNavbar />
      <main className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold">Welcome, {customer.name}</h1>
        

        {/* Product Slider */}
        <div className="w-full my-8">
          <ProductSlider />
        </div>

        {/* Google Maps iframe */}
        <div className="w-full h-[500px] my-8">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31717.47631917297!2d-0.2095646!3d5.6884777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9a0e15522909%3A0xd17d2158761e22ef!2sAcademic%20City%20University!5e0!3m2!1sen!2sgh!4v1709889703704!5m2!1sen!2sgh"
            width="100%"
            height="100%"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </main>
    </>
  );
}
