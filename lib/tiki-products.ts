import rawTikiProducts from "@/data/tiki-affiliate-products.json";
import type { Product } from "@/types/product";

export const productsData: Product[] = rawTikiProducts.map((p) => {
  const ingredientIds: string[] = [];
  const nameLower = p.title.toLowerCase();
  
  if (nameLower.includes("niacinamide") || nameLower.includes("b3")) ingredientIds.push("niacinamide");
  if (nameLower.includes("retinol") || nameLower.includes("vit a") || nameLower.includes("retinoid")) ingredientIds.push("retinol");
  if (nameLower.includes("b5") || nameLower.includes("panthenol")) ingredientIds.push("panthenol");
  if (nameLower.includes("hyaluronic") || nameLower.includes("ha ") || nameLower.includes("cấp nước")) ingredientIds.push("hyaluronic-acid");
  if (nameLower.includes("salicylic") || nameLower.includes("bha")) ingredientIds.push("salicylic-acid");
  if (nameLower.includes("glycolic") || nameLower.includes("aha")) ingredientIds.push("glycolic-acid");
  if (nameLower.includes("rau má") || nameLower.includes("centella")) ingredientIds.push("centella-asiatica");
  if (nameLower.includes("bí đao") || nameLower.includes("winter melon")) ingredientIds.push("winter-melon");
  if (nameLower.includes("tràm trà") || nameLower.includes("tea tree")) ingredientIds.push("tea-tree-oil");

  const skin_types: string[] = [];
  if (nameLower.includes("da dầu") || nameLower.includes("oily") || nameLower.includes("kiềm dầu")) skin_types.push("oily");
  if (nameLower.includes("da khô") || nameLower.includes("dry") || nameLower.includes("cấp ẩm")) skin_types.push("dry");
  if (nameLower.includes("nhạy cảm") || nameLower.includes("sensitive") || nameLower.includes("phục hồi")) skin_types.push("sensitive");
  if (skin_types.length === 0) skin_types.push("oily", "dry", "combination", "sensitive");

  const concerns: string[] = [];
  if (nameLower.includes("mụn") || nameLower.includes("acne") || nameLower.includes("bha")) concerns.push("acne");
  if (nameLower.includes("thâm") || nameLower.includes("sáng da") || nameLower.includes("trắng da") || nameLower.includes("niacinamide") || nameLower.includes("vitamin c")) concerns.push("dark-spots");
  if (nameLower.includes("lão hóa") || nameLower.includes("wrinkle") || nameLower.includes("chống già") || nameLower.includes("retinol")) concerns.push("aging");
  if (nameLower.includes("lỗ chân lông") || nameLower.includes("pore")) concerns.push("pores");
  if (concerns.length === 0) concerns.push("acne", "dark-spots", "pores");

  return {
    id: p.id,
    name: p.title,
    brand: p.brand,
    category: p.category,
    skin_types,
    concerns,
    ingredientIds,
    shopeeUrl: p.rawTikiUrl,
    image: p.imagePath || "/images/product-placeholder.webp",
    price: p.price || "Liên hệ",
    rating: 5,
    reviewCount: 100,
    safetyScore: 90,
    description: p.description
  };
});
