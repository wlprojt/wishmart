"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-md p-8 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Order Placed Successfully 🎉
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Thank you for your purchase!  
          Your order has been confirmed and will be processed shortly.
        </p>

        {/* Info box */}
        <div className="bg-gray-50 border rounded-lg p-4 text-sm text-gray-600 mb-6">
          📩 A confirmation email has been sent to your registered email address.
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/orders"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            View My Orders
          </Link>

          <Link
            href="/"
            className="w-full border border-gray-300 hover:bg-gray-100 py-3 rounded-lg font-semibold transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
