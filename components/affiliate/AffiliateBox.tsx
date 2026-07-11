import Image from "next/image";
import type { AffiliateProduct } from "@/types/affiliate";
import shopeeProducts from "@/data/shopee-affiliate-products.json";
import tikiProducts from "@/data/tiki-affiliate-products.json";
import ShopeeButton from "./ShopeeButton";

// const productsData = [...shopeeProducts, ...tikiProducts];
const productsData = [...tikiProducts];

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
      className="w-full bg-amber-50/60 border border-amber-200/50 rounded-2xl p-4 flex items-center gap-4 mb-6 shadow-sm hover:shadow-md transition duration-200"
      data-testid="affiliate-box-study"
    >
      <div className="flex-shrink-0 relative">
        <Image
          src={product.imagePath}
          alt={product.title}
          width={80}
          height={80}
          className="rounded-xl object-cover bg-white"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-0.5">
          Gợi ý dành cho bạn
        </p>
        <p className="font-bold text-sm text-slate-900 leading-snug truncate">
          {product.title}
        </p>
        <p className="text-xs text-slate-505 mt-0.5 line-clamp-2">
          {product.description}
        </p>
      </div>
      <ShopeeButton 
        url={product.shopeeUrl} 
        text="Xem" 
        productId={product.id}
        productName={product.title}
        subId="affiliate_box"
        className="flex-shrink-0 text-xs rounded-full font-bold px-4 h-9"
      />
    </div>
  );
}
