// src/app/api/products/all/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") || 1);
  const sort = searchParams.get("sort");
  const category = searchParams.get("category");
  const minPrice = Number(searchParams.get("minPrice") || 0);
  const maxPrice = Number(searchParams.get("maxPrice") || 2000);

  const limit = 12;
  const skip = (page - 1) * limit;

  const match: any = {
    $expr: {
      $and: [
        { $gte: [{ $ifNull: ["$sale_price", "$price"] }, minPrice] },
        { $lte: [{ $ifNull: ["$sale_price", "$price"] }, maxPrice] },
      ],
    },
  };

  if (category) {
    match.category = new RegExp(`^${category}$`, "i");
  }

  let sortStage: any = { createdAt: -1 };

  switch (sort) {
    case "price-asc":
      sortStage = { sale_price: 1, price: 1 };
      break;
    case "price-desc":
      sortStage = { sale_price: -1, price: -1 };
      break;
    case "rating":
      sortStage = { rating: -1 };
      break;
    case "latest":
      sortStage = { createdAt: -1 };
      break;
  }

  const [result] = await Product.aggregate([
    { $match: match },
    {
      $facet: {
        products: [
          { $sort: sortStage },
          { $skip: skip },
          { $limit: limit },
        ],
        total: [{ $count: "count" }],
      },
    },
  ]);

  return NextResponse.json({
    products: result.products,
    total: result.total[0]?.count || 0,
    page,
    pages: Math.ceil((result.total[0]?.count || 0) / limit),
  });
}
