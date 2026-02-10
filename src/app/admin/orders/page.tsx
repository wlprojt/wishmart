"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then(res => res.json())
      .then(setOrders);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <div className="space-y-6">
        {orders.map(order => (
          <div key={order._id} className="border rounded-lg p-6 bg-white">
            
            {/* Billing */}
            <div className="mb-4">
              <h2 className="font-semibold">Billing Details</h2>
              <p>{order.billing.firstName} {order.billing.lastName}</p>
              <p>{order.email}</p>
              <p>{order.billing.phone}</p>
              <p>
                {order.billing.address}, {order.billing.city},{" "}
                {order.billing.state}, {order.billing.country}
              </p>
            </div>

            {/* Products */}
            <div className="space-y-3">
              {order.items.map((item: any) => (
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
            <div className="mt-4 font-bold">
              Total: ${order.totalAmount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
