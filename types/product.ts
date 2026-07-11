export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  skin_types: string[];
  concerns: string[];
  ingredientIds: string[];
  shopeeUrl: string;
  image: string;
  price?: string;
  rating?: number;
  reviewCount?: number;
  safetyScore?: number;
  description?: string;
}

export interface Blog {
  slug: string;
  title: string;
  metaDescription: string;
  publishedAt: string;
  thumbnail?: string;
  category?: string;
  skin_types?: string[];
  concerns?: string[];
  tags_ingredients?: string[];   // IDs hoạt chất nhắc trong bài
  target_skin_types?: string[];  // Dùng cho IngredientCTABlock URL params
  tags: string[];
  relatedProductIds: string[];
  contentMd: string;
}

export const SKIN_TYPES = [
  { id: "da-dau",      label: "Da dầu" },
  { id: "da-kho",      label: "Da khô" },
  { id: "da-hon-hop",  label: "Da hỗn hợp" },
  { id: "da-nhay-cam", label: "Da nhạy cảm" },
  { id: "da-thuong",   label: "Da thường" },
] as const;

export const CONCERNS = [
  { id: "tri-mun",       label: "Trị mụn" },
  { id: "tri-tham",      label: "Trị thâm" },
  { id: "chong-lao-hoa", label: "Chống lão hóa" },
  { id: "duong-am",      label: "Dưỡng ẩm" },
  { id: "kiem-soat-dau", label: "Kiểm soát dầu" },
  { id: "lam-sang-da",   label: "Làm sáng da" },
  { id: "phuc-hoi",      label: "Phục hồi da" },
  { id: "chong-nang",    label: "Chống nắng" },
] as const;

export const BLOG_CATEGORIES = [
  { id: "all",        label: "Tất cả" },
  { id: "san-pham",   label: "Sản phẩm" },
  { id: "thanh-phan", label: "Thành phần" },
  { id: "routine",    label: "Routine" },
  { id: "da-lieu",    label: "Da liễu" },
] as const;
