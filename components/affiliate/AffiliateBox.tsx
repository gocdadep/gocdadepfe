import Image from "next/image";
import type { Product } from "@/types/product";
import { productsData } from "@/lib/products-store";
import AffiliateCtaButton from "./AffiliateCtaButton";

export default function AffiliateBox() {
  let product: Product | null = null;
  try {
    const products = productsData;
    product = products.find(p => p.category === "serum") ?? null;
  } catch (error) {
    console.error("Error loading affiliate product:", error);
    return null;
  }

  if (!product) return null;

  return (
    <div
      className="w-full bg-amber-50/60 border border-amber-200/50 rounded-2xl p-4 flex items-center gap-4 mb-6 shadow-sm hover:shadow-md transition duration-200"
      data-testid="affiliate-box-study"
    >
      <div className="flex-shrink-0 relative">
        <Image
          src={product.image}
          alt={product.name}
          width={80}
          height={80}
          style={{ width: "auto", height: "auto" }}
          className="rounded-xl object-cover bg-white"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-0.5">
          Gợi ý dành cho bạn
        </p>
        <p className="font-bold text-sm text-slate-900 leading-snug truncate">
          {product.name}
        </p>
        <p className="text-xs text-slate-505 mt-0.5 line-clamp-2">
          {product.description}
        </p>
      </div>
      <AffiliateCtaButton 
        url={product.rawProductUrl} 
        text="Xem chi tiết" 
        productId={product.id}
        productName={product.name}
        subId="affiliate_box"
        className="flex-shrink-0 text-xs rounded-full font-bold px-4 h-9"
      />
    </div>
  );
}
