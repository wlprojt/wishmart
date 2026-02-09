"use client";

import BrandDealBanner from '@/components/BrandDealBanner';
import TodayDeal from '@/components/TodaysDeal'
import Image from 'next/image';
import { useEffect, useState } from "react";

type Product = {
  _id: string;
  title: string;
  price: number;
  sale_price?: number | null;
  images: string[];
};

const sale = () => {
    const [saleProducts, setSaleProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const fetchAll = async () => {
      try {
        const [saleRes] = await Promise.all([
          fetch("/api/products/sale")
        ]);

        const saleData = await saleRes.json();
        setSaleProducts(saleData);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className=" bg-gray-100 ">
    
        {/* Header */}
        <div className='w-full bg-white h-30 border border-gray-300 shadow-sm'>
        <div className="max-w-7xl lg:mx-auto mx-4 my-8 flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <h1 className="text-6xl font-bold text-gray-700">
            Today&apos;s deal
            </h1>
            <p className="max-w-md text-gray-500 mt-4 md:mt-0 md:border-l md:pl-8">
            Saepe doloribus deserunt in. At beatae neque pariatur harum vel.
            Possimus fugiat aut nemo.
            </p>
        </div>
        </div>
        <div className="max-w-7xl lg:mx-auto mx-4 my-8 shadow-sm rounded-lg overflow-hidden">
            <Image
                src="/bannertwo.jpg"
                alt="Promotional Banner"
                width={1500}
                height={300}
            />
        </div>
       <div className="max-w-7xl lg:mx-auto mx-4 mb-8 border border-gray-300 shadow-sm rounded-lg overflow-hidden">
            <TodayDeal products={saleProducts} />
        </div>
        <div className='pb-4'>
            <BrandDealBanner />
        </div>
    </div>
  )
}

export default sale