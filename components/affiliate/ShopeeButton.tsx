"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { trackAffiliateClick } from "@/components/analytics/GA4Provider";
import { generateStandardATLink } from "@/lib/affiliate";

interface ShopeeButtonProps {
  url: string;
  subId?: string;
  className?: string;
  text?: string;
  productId?: string;
  productName?: string;
}

export default function ShopeeButton({ 
  url, 
  subId = "gocdadep_product", 
  className = "", 
  text = "Shopee Mall",
  productId = "",
  productName = ""
}: ShopeeButtonProps) {
  const pathname = usePathname();
  
  const isTiki = url.includes("tiki.vn");
  const isShopee = url.includes("shopee.vn");
  const campaignId = isTiki ? "tiki" : "shopee";
  const buttonText = text !== "Shopee Mall" ? text : (isTiki ? "Tiki Trading" : "Shopee Mall");

  const finalUrl = (isTiki || isShopee)
    ? generateStandardATLink({
        rawProductUrl: url,
        articleId: subId,
        campaignId
      })
    : url;

  const redirectUrl = `/redirect?url=${encodeURIComponent(finalUrl)}`;

  const handleClick = () => {
    trackAffiliateClick({
      productId: productId || url,
      productName: productName || buttonText,
      sourcePage: pathname || "unknown",
      subId: subId
    });
  };

  return (
    <Link
      data-testid="btn-shopee-affiliate"
      href={redirectUrl}
      target="_blank"
      rel="nofollow noopener sponsored"
      onClick={handleClick}
      className={`bg-primary hover:bg-emerald-600 text-white font-semibold rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm cursor-pointer overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-center gap-2 w-full h-full min-h-[inherit] py-2.5 px-5">
        <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
        <span>{buttonText}</span>
      </div>
    </Link>
  );
}
