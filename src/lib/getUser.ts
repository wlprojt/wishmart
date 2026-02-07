import { cookies } from "next/headers";

export async function getUser() {
  const cookieStore = cookies();

  // Convert cookies to header string
  const cookieHeader = (await cookieStore)
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/me`,
    {
      headers: {
        cookie: cookieHeader,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) return null;
  return res.json();
}
