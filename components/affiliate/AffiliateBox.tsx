import Image from "next/image";
import type { AffiliateProduct } from "@/types/affiliate";
import productsData from "@/data/shopee-affiliate-products.json";

export default function AffiliateBox() {
  let product: AffiliateProduct | null = null;
  try {
    const products = productsData as AffiliateProduct[];
    product = products.find(p => p.category === "serum") ?? null;
  } catch (error) {
    console.error("Error loading affiliate product:", error);
    return null;
  }

  if (!product) return null;

  return (
    <div
      className="w-full bg-amber-50/60 border border-amber-200/50 rounded-2xl p-4 flex items-center gap-4 mb-6"
      data-testid="affiliate-box-study"
    >
      <div className="flex-shrink-0 relative">
        <Image
          src={product.imagePath}
          alt={product.title}
          width={80}
          height={80}
          className="rounded-xl object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-0.5">
          Gợi ý dành cho bạn
        </p>
        <p className="font-bold text-sm text-slate-900 leading-snug truncate">
          {product.title}
        </p>
        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
          {product.description}
        </p>
      </div>
      <a
        href={`/redirect?url=${encodeURIComponent(product.shopeeUrl)}`}
        target="_blank"
        rel="nofollow noopener sponsored"
        className="flex-shrink-0 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition duration-200 whitespace-nowrap"
        data-testid="affiliate-box-cta"
      >
        Xem trên Shopee
      </a>
    </div>
  );
}
