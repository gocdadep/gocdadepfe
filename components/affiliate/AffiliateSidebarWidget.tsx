import Image from "next/image";
import type { Product } from "@/types/product";
import { productsData } from "@/lib/products-store";
import AffiliateCtaButton from "./AffiliateCtaButton";

interface Props {
  currentPage?: number;
  seed?: string;
}

export default function AffiliateSidebarWidget({ currentPage, seed }: Props) {
  let product: Product | null = null;
  try {
    const products = productsData;
    if (currentPage && currentPage > 0) {
      const index = (currentPage - 1) % products.length;
      product = products[index] ?? null;
    } else if (seed) {
      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
      }
      const index = Math.abs(hash) % products.length;
      product = products[index] ?? null;
    } else {
      product = products.find(p => p.category === "sunscreen") ?? null;
    }
  } catch (error) {
    console.error("Error loading affiliate sidebar product:", error);
    return null;
  }

  if (!product) return null;

  return (
    <div
      className="w-full bg-white border border-zinc-150 rounded-2xl p-4 flex flex-col items-center text-center space-y-4 shadow-sm hover:shadow-md hover:scale-[1.01] transition duration-200"
      data-testid="affiliate-sidebar-widget"
    >
      <div className="w-full text-left">
        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
          Gợi ý dành cho bạn
        </span>
      </div>

      <div className="relative w-full aspect-square max-w-[200px] overflow-hidden rounded-xl bg-slate-50">
        <Image
          src={product.image}
          alt={product.name}
          width={200}
          height={200}
          style={{ width: "auto", height: "auto" }}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="space-y-1 w-full text-left">
        <h4 className="font-bold text-sm text-slate-900 leading-snug">
          {product.name}
        </h4>
        <p className="text-xs text-slate-550 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </div>

      <AffiliateCtaButton 
        url={product.rawProductUrl} 
        text={product.ctaLabel || "Xem chi tiết"}
        productId={product.id}
        productName={product.name}
        subId={`sidebar_${seed || "generic"}`}
        className="w-full text-xs rounded-full font-bold h-9"
      />
    </div>
  );
}
