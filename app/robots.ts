import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/redirect", "/api/*"],
    },
    sitemap: "https://gocdadep.com/sitemap.xml",
  };
}
