import Products from "@/components/Products";
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function ProductsAdminPage() {
  // ✅ Fetch session inside async layout
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="bg-[#29293d]">
      <Products session={session} />
    </div>
  );
}