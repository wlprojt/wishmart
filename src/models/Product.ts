import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  title: string;
  price: number;
  sale_price?: number | null;
  images: string[];
  description: string;
  features: string[];      // ⭐ NEW
  category: string;
  stock: number;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    sale_price: { type: Number, default: null },
    images: { type: [String], required: true },
    description: { type: String, required: true },
    features: { type: [String], required: true }, // ⭐ NEW
    category: { type: String, required: true },
    stock: { type: Number, required: true },
  },
  { timestamps: true }
);

export default (mongoose.models.Product as Model<IProduct>) ||
  mongoose.model<IProduct>("Product", ProductSchema);
