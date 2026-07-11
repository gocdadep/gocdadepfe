import rawProducts from "@/data/affiliate-products.json";
import type { Product } from "@/types/product";
import { CAMPAIGN_IDS } from "@/lib/affiliate";

type ValidSource = keyof typeof CAMPAIGN_IDS;
const validSources = Object.keys(CAMPAIGN_IDS) as ValidSource[];

const PLATFORM_BLACKLIST = ["shopee", "tiki", "lazada", "lazmail", "beautybox", "bestme", "con cưng", "the face shop"];

function sanitizeCtaLabel(label?: string): string {
  if (!label) return "Xem chi tiết";
  const lower = label.toLowerCase();
  if (PLATFORM_BLACKLIST.some(name => lower.includes(name))) return "Xem chi tiết";
  return label;
}

export const productsData: Product[] = rawProducts.map((p) => {
  const source = validSources.includes(p.source as ValidSource) ? p.source : "tiki";
  
  // Trích xuất ingredientIds, skin_types và concerns từ name (title) nếu rỗng để phục vụ tính năng lọc nâng cao
  const ingredientIds: string[] = p.ingredientIds || [];
  const nameLower = p.name.toLowerCase();
  
  if (ingredientIds.length === 0) {
    if (nameLower.includes("niacinamide") || nameLower.includes("b3")) ingredientIds.push("niacinamide");
    if (nameLower.includes("retinol") || nameLower.includes("vit a") || nameLower.includes("retinoid")) ingredientIds.push("retinol");
    if (nameLower.includes("b5") || nameLower.includes("panthenol")) ingredientIds.push("panthenol");
    if (nameLower.includes("hyaluronic") || nameLower.includes("ha ") || nameLower.includes("cấp nước")) ingredientIds.push("hyaluronic-acid");
    if (nameLower.includes("salicylic") || nameLower.includes("bha")) ingredientIds.push("salicylic-acid");
    if (nameLower.includes("glycolic") || nameLower.includes("aha")) ingredientIds.push("glycolic-acid");
    if (nameLower.includes("rau má") || nameLower.includes("centella")) ingredientIds.push("centella-asiatica");
    if (nameLower.includes("bí đao") || nameLower.includes("winter melon")) ingredientIds.push("winter-melon");
    if (nameLower.includes("tràm trà") || nameLower.includes("tea tree")) ingredientIds.push("tea-tree-oil");
  }

  const skin_types: string[] = p.skin_types || [];
  if (skin_types.length === 0) {
    if (nameLower.includes("da dầu") || nameLower.includes("oily") || nameLower.includes("kiềm dầu")) {
      skin_types.push("da-dau");
    }
    if (nameLower.includes("da khô") || nameLower.includes("dry") || nameLower.includes("cấp ẩm")) {
      skin_types.push("da-kho");
    }
    if (nameLower.includes("nhạy cảm") || nameLower.includes("sensitive") || nameLower.includes("phục hồi")) {
      skin_types.push("da-nhay-cam");
    }
    if (skin_types.length === 0) {
      skin_types.push("da-dau", "da-kho", "da-hon-hop", "da-nhay-cam", "da-thuong");
    }
  }

  const concerns: string[] = p.concerns || [];
  if (concerns.length === 0) {
    if (nameLower.includes("mụn") || nameLower.includes("acne") || nameLower.includes("bha")) concerns.push("tri-mun");
    if (nameLower.includes("thâm") || nameLower.includes("sáng da") || nameLower.includes("trắng da") || nameLower.includes("niacinamide") || nameLower.includes("vitamin c")) concerns.push("tri-tham");
    if (nameLower.includes("lão hóa") || nameLower.includes("wrinkle") || nameLower.includes("chống già") || nameLower.includes("retinol")) concerns.push("chong-lao-hoa");
    if (nameLower.includes("lỗ chân lông") || nameLower.includes("pore")) concerns.push("kiem-soat-dau");
    if (concerns.length === 0) {
      concerns.push("tri-mun", "tri-tham", "kiem-soat-dau");
    }
  }

  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category || "general",
    skin_types,
    concerns,
    ingredientIds,
    shopeeUrl: p.rawProductUrl,
    rawProductUrl: p.rawProductUrl,
    source,
    image: p.image || "/images/product-placeholder.webp",
    slug: p.slug,
    price: p.price || "Liên hệ",
    rating: 5,
    reviewCount: 100,
    safetyScore: 90,
    description: p.description || "Sản phẩm chính hãng.",
    tags: p.tags || [],
    ctaLabel: sanitizeCtaLabel(p.ctaLabel),
  } as Product;
});

// Export mảng copy cho các widgets tương thích ngược
export const affiliateProducts = productsData;
