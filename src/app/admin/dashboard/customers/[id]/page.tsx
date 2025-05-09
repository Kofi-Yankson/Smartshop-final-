"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Customer {
  id: string;
  name: string;
  email: string;
  location: string;
  latitude: number;
  longitude: number;
}

export default function AdminCustomerProfileView() {
  const router = useRouter();
  const params = useSearchParams();
  const customerId = params.get("id");

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customerId) return;

    const fetchCustomer = async () => {
      try {
        const res = await fetch(`/api/customer/${customerId}`);
        const data = await res.json();
        setCustomer(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching customer:", error);
      }
    };

    fetchCustomer();
  }, [customerId]);

//   if (loading) return <p>Loading...</p>;
  if (!customer) return <p>Customer not found.</p>;

  return (
    <main className="max-w-4xl mx-auto p-6 mt-8 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Customer Profile (Admin View)</h1>
      <div className="space-y-3 text-gray-700">
        <p><strong>Name:</strong> {customer.name}</p>
        <p><strong>Email:</strong> {customer.email}</p>
        <p><strong>Location:</strong> {customer.location}</p>
        <p><strong>Latitude:</strong> {customer.latitude}</p>
        <p><strong>Longitude:</strong> {customer.longitude}</p>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={() => router.push(`/admins/dashboard/customers/${customer.id}/edit`)}
        >
          Edit Customer
        </button>
      </div>
    </main>
  );
}
