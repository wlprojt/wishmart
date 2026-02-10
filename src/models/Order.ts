import mongoose, { Schema, models } from "mongoose";

const OrderSchema = new Schema(
  {
    userId: String,
    email: String,

    billing: {
      firstName: String,
      lastName: String,
      phone: String,
      address: String,
      apartment: String,
      country: String,
      state: String,
      city: String,
      postalCode: String,
    },

    items: [
      {
        productId: String,
        title: String,
        price: Number,
        qty: Number,
        image: String,
      },
    ],

    totalAmount: Number,
    currency: { type: String, default: "USD" },

    razorpayOrderId: String,
    razorpayPaymentId: String,

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default models.Order || mongoose.model("Order", OrderSchema);
