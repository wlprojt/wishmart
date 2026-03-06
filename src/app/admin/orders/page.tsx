"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface OrderItem {
  productId: string;
  title: string;
  image: string;
  qty: number;
  price: number;
}

interface Billing {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

interface Order {
  _id: string;
  email: string;
  billing: Billing;
  items: OrderItem[];
  totalAmount: number;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch("/api/admin/orders");
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Failed to load orders", error);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  if (loading) {
    return <div className="p-8">Loading orders...</div>;
  }

  if (!orders.length) {
    return <div className="p-8">No orders found.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="border rounded-lg p-6 bg-white shadow">

            {/* Billing */}
            <div className="mb-4">
              <h2 className="font-semibold text-lg mb-1">Billing Details</h2>
              <p>{order.billing.firstName} {order.billing.lastName}</p>
              <p>{order.email}</p>
              <p>{order.billing.phone}</p>
              <p className="text-sm text-gray-600">
                {order.billing.address}, {order.billing.city},{" "}
                {order.billing.state}, {order.billing.country}
              </p>
            </div>

            {/* Products */}
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.productId} className="flex gap-4 items-center">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={50}
                    height={50}
                    className="rounded"
                  />

                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.qty} × ${item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-4 font-bold text-lg">
              Total: ${order.totalAmount}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}