export type AffiliateCategory = "study" | "dorm" | "collection" | "serum" | "sunscreen" | "toner" | "retinol" | "moisturizer" | "cleanser" | "acme" | "general";

export interface AffiliateProduct {
  id: string;
  slug: string;
  title: string;
  description: string;
  imagePath: string;
  category: AffiliateCategory;
  shopeeUrl: string;
  tags?: string[];
  ctaLabel?: string;
}
