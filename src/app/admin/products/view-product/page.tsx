import Products from "@/components/Products";
import { headers } from 'next/headers';

export default async function ProductsAdminPage() {
  

  return (
    <div className="bg-[#29293d]">
      <Products />
    </div>
  );
}