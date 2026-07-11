import Link from "next/link";
import { ShoppingCart } from "lucide-react";

interface ShopeeButtonProps {
  url: string;
  subId?: string;
  className?: string;
  text?: string;
}

export default function ShopeeButton({ 
  url, 
  subId = "gocdadep_product", 
  className = "", 
  text = "Shopee Mall" 
}: ShopeeButtonProps) {
  const finalUrl = url.includes("?") 
    ? `${url}&sub_id=${subId}` 
    : `${url}?sub_id=${subId}`;
  const redirectUrl = `/redirect?url=${encodeURIComponent(finalUrl)}`;

  return (
    <Link
      data-testid="btn-shopee-affiliate"
      href={redirectUrl}
      rel="sponsored nofollow"
      className={`inline-flex items-center justify-center gap-1.5 bg-[#EE4D2D] hover:bg-[#d73f21] text-white font-semibold rounded-lg transition duration-200 shadow-sm cursor-pointer ${className}`}
    >
      <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
      <span>{text}</span>
    </Link>
  );
}
