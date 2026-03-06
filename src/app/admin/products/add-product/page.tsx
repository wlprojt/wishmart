import Add from "@/components/Add";
import { headers } from 'next/headers';

export default async function AddProductPage() {

  return (
    <div className="bg-[#29293d]">
      <Add />
    </div>
  );
}