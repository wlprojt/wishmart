import Ahome from "@/components/Ahome";
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export default async function UploadImage() {
  // ✅ Fetch session inside async layout
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <Ahome session={session} />
  );
}