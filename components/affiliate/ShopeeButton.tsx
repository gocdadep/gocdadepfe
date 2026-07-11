import Link from "next/link";

interface ShopeeButtonProps {
  url: string;
  subId: string;
  className?: string;
  text?: string;
}

export default function ShopeeButton({ 
  url, 
  subId, 
  className = "", 
  text = "Xem giá tại Shopee Mall" 
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
      className={`inline-flex items-center justify-center bg-[#EE4D2D] hover:bg-[#d73f21] text-white font-bold px-6 py-3 rounded-xl transition duration-200 min-h-[48px] min-w-[150px] shadow-sm ${className}`}
    >
      {text}
    </Link>
  );
}
