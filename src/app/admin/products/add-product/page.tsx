import Add from "@/components/Add";
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function AddProductPage() {
  // ✅ Fetch session inside async layout
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="bg-[#29293d]">
      <Add session={session} />
    </div>
  );
}