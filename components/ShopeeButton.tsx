"use client";
import { ShoppingCart } from "lucide-react";

interface ShopeeButtonProps {
  url: string;
  subId?: string;
  className?: string;
}

export default function ShopeeButton({ url, subId = "gocdadep_product", className = "" }: ShopeeButtonProps) {
  // Chuyển hướng qua trang redirect an toàn
  const targetUrl = `/redirect?url=${encodeURIComponent(url)}&subId=${subId}`;

  return (
    <a
      data-testid="btn-shopee-affiliate"
      href={targetUrl}
      target="_blank"
      rel="sponsored nofollow"
      className={`inline-flex items-center justify-center rounded-lg bg-[#EE4D2D] hover:bg-[#EE4D2D]/90 text-white font-medium h-9 px-4 gap-2 text-xs transition duration-200 cursor-pointer ${className}`}
    >
      <ShoppingCart className="w-4 h-4 shrink-0" />
      <span>Shopee</span>
    </a>
  );
}
