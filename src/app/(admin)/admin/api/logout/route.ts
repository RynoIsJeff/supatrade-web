import { cookies } from "next/headers"

export async function POST() {
  const c = await cookies()

  // Delete by name (no options param allowed)
  c.delete("sb-access-token")
  c.delete("sb-refresh-token")

  // Belt-and-braces: also overwrite with an expired cookie at path "/"
  const expired = { path: "/", expires: new Date(0) }
  c.set("sb-access-token", "", expired)
  c.set("sb-refresh-token", "", expired)

  return new Response("ok")
}