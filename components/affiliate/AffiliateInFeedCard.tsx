import Image from "next/image";
import type { Product } from "@/types/product";
import { productsData } from "@/lib/products-store";
import { generateStandardATLink } from "@/lib/affiliate";

interface Props {
  currentPage?: number;
  rowIndex?: number;
}

export default function AffiliateInFeedCard({ currentPage, rowIndex }: Props) {
  let product: Product | null = null;
  try {
    const products = productsData;
    if (currentPage && currentPage > 0) {
      const globalIndex = (currentPage - 1) * 3 + (rowIndex ?? 0);
      const index = globalIndex % products.length;
      product = products[index] ?? null;
    } else {
      product = products.find(p => p.category === "sunscreen") ?? null;
    }
  } catch (error) {
    console.error("Error loading affiliate in-feed product:", error);
    return null;
  }

  if (!product) return null;

  const isTiki = product.rawProductUrl.includes("tiki.vn");
  const isShopee = product.rawProductUrl.includes("shopee.vn");
  const campaignId = isTiki ? "tiki" : "shopee";
  const finalUrl = (isTiki || isShopee)
    ? generateStandardATLink({
        rawProductUrl: product.rawProductUrl,
        articleId: `infeed_${currentPage || 1}`,
        campaignId
      })
    : product.rawProductUrl;

  const redirectUrl = `/redirect?url=${encodeURIComponent(finalUrl)}`;
  const buttonText = product.ctaLabel || "Xem chi tiết";

  return (
    <div
      className="relative group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition duration-300 flex flex-col justify-between"
      data-testid="affiliate-infeed-card"
    >
      <div className="h-44 overflow-hidden relative">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
            Gợi ý dành cho bạn
          </span>
          <h2 className="text-base font-bold text-slate-955 leading-snug">
            {product.name}
          </h2>
          <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            <span>Tài trợ</span>
          </div>
          <a
            href={redirectUrl}
            target="_blank"
            rel="nofollow noopener sponsored"
            className="text-xs font-bold text-primary group-hover:underline"
          >
            {buttonText} &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
