"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type OrderItem = {
  productId: string;
  title: string;
  price: number;
  qty: number;
  image: string;
};

type Billing = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

type Order = {
  _id: string;
  email: string;
  items: OrderItem[];
  billing: Billing;
  totalAmount: number;
  status: "pending" | "paid" | "failed";
  createdAt: string;
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders/my", {
          credentials: "include",
        });

        if (!res.ok) {
          router.replace("/login");
          return;
        }

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [router]);

  if (loading) {
    return <p className="text-center py-10">Loading orders...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <p className="text-gray-500">You have no orders yet.</p>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl border shadow-sm p-6"
              >
                {/* Header */}
                <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID
                    </p>
                    <p className="font-mono text-sm">
                      {order._id}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Order Date
                    </p>
                    <p className="text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : order.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Items */}
                <div className="divide-y">
                  {order.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-4 py-4"
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={64}
                        height={64}
                        className="rounded-lg border"
                      />

                      <div className="flex-1">
                        <p className="font-medium">
                          {item.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.qty}
                        </p>
                      </div>

                      <p className="font-semibold">
                        ${(item.price * item.qty).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Billing + Total */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6 mt-6">
                  <div>
                    <h3 className="font-semibold mb-2">
                      Billing Details
                    </h3>
                    <p className="text-sm text-gray-600">
                      {order.billing.firstName} {order.billing.lastName}
                      <br />
                      {order.billing.address}
                      {order.billing.apartment && `, ${order.billing.apartment}`}
                      <br />
                      {order.billing.city}, {order.billing.state}
                      <br />
                      {order.billing.country} - {order.billing.postalCode}
                      <br />
                      📞 {order.billing.phone}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Total Amount
                    </p>
                    <p className="text-2xl font-bold">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
