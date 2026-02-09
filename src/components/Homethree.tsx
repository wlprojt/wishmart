"use client";

import { useEffect, useState } from "react";
import AudioVideoSection from "./AudioVideoSection";
import TodayBestDeal from "./TodayBestDeal";
import PromoCategories from "./PromoCategories";
import HomeAppliances from "./HomeAppliances";
import AirConditioner from "./AirConditioner";
import Image from "next/image";
import KitchenAppliances from "./KitchenAppliances";
import PCsLaptop from "./PCsLaptop";
import Gadget from "./Gadget​";
import Refrigerator from "./Refrigerator";
import Link from "next/link";

type Product = {
  _id: string;
  title: string;
  price: number;
  sale_price?: number | null;
  images: string[];
};

export default function Homethree() {
  const [saleProducts, setSaleProducts] = useState<Product[]>([]);
  const [audioVideoProducts, setAudioVideoProducts] = useState<Product[]>([]);
  const [homeAppliancesProducts, setHomeAppliancesProducts] = useState<Product[]>([]);
  const [airConditionerProducts, setAirConditionerProducts] = useState<Product[]>([]);
  const [kitchenAppliancesProducts, setKitchenAppliancesProducts] = useState<Product[]>([]);
  const [refrigeratorProducts, setRefrigeratorProducts] = useState<Product[]>([]);
  const [pcsLaptopsProducts, setPcsLaptopsProducts] = useState<Product[]>([]);
  const [gadgetsProducts, setGadgetsProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [saleRes, audioRes, homeAppliancesRes, airConditionerRes, kitchenAppliancesRes, refrigeratorRes, pcsLaptopsRes, gadgetsRes] = await Promise.all([
          fetch("/api/products/sale"),
          fetch("/api/products?category=Audio%20%26%20Video"),
          fetch("/api/products?category=Home%20Appliances"),
          fetch("/api/products?category=Air%20Conditioner"),
          fetch("/api/products?category=Kitchen%20Appliances"),
          fetch("/api/products?category=Refrigerator"),
          fetch("/api/products?category=PCs%20%26%20Laptop"),
          fetch("/api/products?category=Gadgets"),
        ]);

        const saleData = await saleRes.json();
        const audioData = await audioRes.json();
        const homeAppliancesData = await homeAppliancesRes.json();
        const airConditionerData = await airConditionerRes.json();
        const kitchenAppliancesData = await kitchenAppliancesRes.json();
        const refrigeratorData = await refrigeratorRes.json();
        const pcsLaptopsData = await pcsLaptopsRes.json();
        const gadgetsData = await gadgetsRes.json();
        setSaleProducts(saleData);
        setAudioVideoProducts(audioData);
        setHomeAppliancesProducts(homeAppliancesData);
        setAirConditionerProducts(airConditionerData);
        setKitchenAppliancesProducts(kitchenAppliancesData);
        setRefrigeratorProducts(refrigeratorData);
        setPcsLaptopsProducts(pcsLaptopsData);
        setGadgetsProducts(gadgetsData);
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
    <>
      <div className="max-w-7xl lg:mx-auto mx-4 mb-8 border border-gray-300 shadow-sm rounded-lg overflow-hidden">
        <TodayBestDeal products={saleProducts} />
      </div>
      <PromoCategories />
      <div className="max-w-7xl lg:mx-auto mx-4 my-8 border border-gray-300 shadow-sm rounded-lg overflow-hidden">
        <AudioVideoSection products={audioVideoProducts} />
      </div>
      <div className="max-w-7xl lg:mx-auto mx-4 my-8 border border-gray-300 shadow-sm rounded-lg overflow-hidden">
        <HomeAppliances products={homeAppliancesProducts} />
      </div>
      <div className="max-w-7xl lg:mx-auto mx-4 my-8 border border-gray-300 shadow-sm rounded-lg overflow-hidden">
        <AirConditioner products={airConditionerProducts} />
      </div>
      <div className="max-w-7xl lg:mx-auto mx-4 my-8 shadow-sm rounded-lg overflow-hidden">
        <Link href="/shop?category=PCs+%26+laptop&page=1">
        <Image
          src="/bannerone.jpg"
          alt="Promotional Banner"
          width={1500}
          height={300}
        />
        </Link>
      </div>
      <div className="max-w-7xl lg:mx-auto mx-4 my-8 border border-gray-300 shadow-sm rounded-lg overflow-hidden">
        <KitchenAppliances products={kitchenAppliancesProducts} />
      </div>
      <div className="max-w-7xl lg:mx-auto mx-4 my-8 border border-gray-300 shadow-sm rounded-lg overflow-hidden">
        <Refrigerator products={refrigeratorProducts} />
      </div>
      <div className="max-w-7xl lg:mx-auto mx-4 my-8 shadow-sm rounded-lg overflow-hidden">
        <Image
          src="/bannertwo.jpg"
          alt="Promotional Banner"
          width={1500}
          height={300}
        />
      </div>
      <div className="max-w-7xl lg:mx-auto mx-4 my-8 border border-gray-300 shadow-sm rounded-lg overflow-hidden">
        <PCsLaptop products={pcsLaptopsProducts} />
      </div>
      <div className="max-w-7xl lg:mx-auto mx-4 my-8 border border-gray-300 shadow-sm rounded-lg overflow-hidden">
        <Gadget products={gadgetsProducts} />
      </div>
    </>
  );
}
