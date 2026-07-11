import Image from "next/image";
import type { AffiliateProduct } from "@/types/affiliate";
import productsData from "@/data/shopee-affiliate-products.json";

interface Props {
  currentPage?: number;
  seed?: string;
}

export default function AffiliateSidebarWidget({ currentPage, seed }: Props) {
  let product: AffiliateProduct | null = null;
  try {
    const products = productsData as AffiliateProduct[];
    if (currentPage && currentPage > 0) {
      // Chọn sản phẩm modulo theo trang
      const index = (currentPage - 1) % products.length;
      product = products[index] ?? null;
    } else if (seed) {
      // Hash seed (slug) để hiển thị sản phẩm cố định cho bài viết cụ thể
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
      className="w-full bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center text-center space-y-4 shadow-sm"
      data-testid="affiliate-sidebar-widget"
    >
      <div className="w-full text-left">
        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
          Gợi ý dành cho bạn
        </span>
      </div>

      <div className="relative w-full aspect-square max-w-[200px] overflow-hidden rounded-xl bg-slate-50">
        <Image
          src={product.imagePath}
          alt={product.title}
          width={200}
          height={200}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="space-y-1 w-full text-left">
        <h4 className="font-bold text-sm text-slate-900 leading-snug">
          {product.title}
        </h4>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </div>

      <a
        href={`/redirect?url=${encodeURIComponent(product.shopeeUrl)}`}
        target="_blank"
        rel="nofollow noopener sponsored"
        className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition duration-200 text-center block"
      >
        {product.ctaLabel || "Xem trên Shopee"}
      </a>
    </div>
  );
}
