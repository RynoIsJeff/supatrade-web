export const runtime = "nodejs"
import { createClient } from "@supabase/supabase-js"

export async function GET(_: Request, { params }: { params: { path: string } }) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const decoded = decodeURIComponent(params.path) // e.g. "cvs/1730072458-CV.pdf"
  const { data, error } = await supabase.storage.from("uploads").createSignedUrl(decoded, 60 * 10) // 10 min
  if (error) return new Response("Unable to sign URL", { status: 500 })
  return Response.json({ url: data.signedUrl })
}
