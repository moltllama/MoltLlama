import { MetadataRoute } from "next";
import { getAllProtocolSlugs } from "@/data/protocols";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://moltllama.com";
  const CONTENT_UPDATED = new Date("2026-02-25");

  const protocolSlugs = getAllProtocolSlugs();

  return [
    {
      url: siteUrl,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/dashboard`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/dashboard/protocols`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/dashboard/yields`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/dashboard/dexs`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/dashboard/contracts`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...protocolSlugs.map((slug) => ({
      url: `${siteUrl}/dashboard/protocols/${slug}`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),
  ];
}
