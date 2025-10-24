import { MetadataRoute } from "next"
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.SITE_URL || "http://localhost:3000"
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/careers`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/stores`, changeFrequency: "weekly", priority: 0.8 },
  ]
}
