import { cookies } from "next/headers"

export async function POST() {
  // 👇 await cookies() in Next 16
  const c = await cookies()
  c.delete("sb-access-token")
  c.delete("sb-refresh-token")
  return new Response("ok")
}
