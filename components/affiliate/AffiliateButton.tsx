"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { generateStandardATLink, CAMPAIGN_IDS } from "@/lib/affiliate";
import { trackAffiliateClick } from "@/components/analytics/GA4Provider";

interface AffiliateButtonProps {
  rawProductUrl: string;
  campaignId: keyof typeof CAMPAIGN_IDS;
  productName: string;
  articleId: string;
  className?: string;
  hideLabel?: boolean;
  ingredientTag?: string;
  saleSeason?: string;
}

export default function AffiliateButton({ 
  rawProductUrl, 
  campaignId, 
  productName, 
  articleId,
  className = "",
  hideLabel = false,
  ingredientTag = "general",
  saleSeason = "july-2026"
}: AffiliateButtonProps) {
  const pathname = usePathname();
  if (!rawProductUrl) return null;

  // Tạo link affiliate qua ACCESSTRADE
  const affiliateUrl = generateStandardATLink({
    rawProductUrl,
    articleId,
    campaignId,
    ingredientTag,
    saleSeason
  });

  // Chuyển hướng qua trang redirect trung gian để ẩn link thô
  const redirectUrl = `/redirect?url=${encodeURIComponent(affiliateUrl)}`;

  const handleClick = () => {
    trackAffiliateClick({
      productId: campaignId,
      productName: productName,
      sourcePage: pathname || "unknown",
      subId: `gocdadep_${articleId}`
    });
  };


  return (
    <div className={`my-4 flex flex-col items-center gap-1.5 w-full ${className}`}>
      <Link
        data-testid="btn-affiliate-cta"
        href={redirectUrl}
        target="_blank"
        rel="nofollow noopener sponsored"
        onClick={handleClick}
        className="w-full max-w-md bg-primary hover:bg-emerald-600 text-white font-semibold rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm cursor-pointer overflow-hidden"
      >
        <div className="flex items-center justify-center gap-2 w-full h-full py-2.5 px-5">
          <ShoppingBag className="w-4 h-4 shrink-0" />
          <span>Tham khảo chi tiết sản phẩm</span>
        </div>
      </Link>
      {/* Nhãn minh bạch bắt buộc theo chính sách của Google AdSense và Sàn */}
      {!hideLabel && (
        <span className="text-[10px] text-zinc-400 italic">
          * Sản phẩm gợi ý chính hãng dựa trên bảng thành phần lâm sàng
        </span>
      )}
    </div>
  );
}
