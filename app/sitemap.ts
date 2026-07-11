import { MetadataRoute } from "next";
import { productsData } from "@/lib/products-store";
import blogsData from "@/data/blogs.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const domain = "https://gocdadep.com";

  // Các trang tĩnh chính
  const staticPages = [
    { url: `${domain}/`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${domain}/danh-muc-san-pham`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${domain}/cam-nang`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
  ];

  // Trang chi tiết sản phẩm
  const productPages = productsData.map((p) => ({
    url: `${domain}/danh-muc-san-pham/${p.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Trang chi tiết bài viết
  const blogPages = blogsData.map((b) => ({
    url: `${domain}/cam-nang/post/${b.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...productPages, ...blogPages];
}
