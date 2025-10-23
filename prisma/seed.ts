/* eslint-disable no-console */
import { PrismaClient, Brand, JobType, JobStatus, Role } from "@prisma/client"
import fs from "node:fs"
import path from "node:path"

import { prisma } from "@/lib/prisma"

async function seedStores() {
  const csv = path.join(process.cwd(), "data", "stores.csv")
  if (!fs.existsSync(csv)) return
  const rows = fs.readFileSync(csv, "utf-8").split(/\r?\n/).slice(1).filter(Boolean)
  for (const row of rows) {
    const [brand,name,town,address,phone,lat,lng,hours] =
      row.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(s => s.replace(/^"|"$/g, "").trim())
    try {
      await prisma.store.upsert({
        where: { name },
        update: {},
        create: {
          brand: brand as Brand,
          name, town, address, phone,
          latitude: lat ? Number(lat) : null,
          longitude: lng ? Number(lng) : null,
          hours: hours || null,
        },
      })
    } catch (e) {
      console.error("Store upsert error:", e)
    }
  }
}

async function seedAdmin() {
  return prisma.user.upsert({
    where: { email: "admin@supatrade.co.za" },
    update: {},
    create: { email: "admin@supatrade.co.za", name: "SupaTrade Admin", role: Role.SUPER_ADMIN },
  })
}

async function seedJob(adminId: string) {
  await prisma.job.upsert({
    where: { slug: "store-manager-pongola" },
    update: {},
    create: {
      title: "Store Manager",
      slug: "store-manager-pongola",
      brand: Brand.BUILD_IT,
      type: JobType.FULL_TIME,
      status: JobStatus.PUBLISHED,
      description: "<p>Lead daily operations and team performance at Build It SupaTrade Pongola.</p>",
      store: { connect: { name: "Build It SupaTrade Pongola" } },
      createdBy: { connect: { id: adminId } }, // 👈 relation connect, not raw FK
    },
  })
}

async function main() {
  await seedStores()
  const admin = await seedAdmin()
  await seedJob(admin.id)
  console.log("Seed complete ✅")
}

main().finally(async () => prisma.$disconnect())
