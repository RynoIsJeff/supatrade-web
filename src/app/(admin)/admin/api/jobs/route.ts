import { z } from "zod"
const JobSchema = z.object({
  title: z.string().min(3),
  brand: z.enum(["SPAR","SAVEMOR","ENGEN","STEERS","DEBONAIRS","BUILD_IT"]),
  type: z.enum(["FULL_TIME","PART_TIME","TEMPORARY","CASUAL","CONTRACT"]).default("FULL_TIME"),
  status: z.enum(["DRAFT","PUBLISHED","CLOSED"]).default("PUBLISHED"),
  storeId: z.string().uuid().nullable().optional(),
  closingDate: z.string().datetime().nullable().optional(),
  description: z.string().default(""),
})
// in POST:
const parsed = JobSchema.safeParse(await req.json())
if (!parsed.success) return new Response("Invalid payload", { status: 400 })
const b = parsed.data
