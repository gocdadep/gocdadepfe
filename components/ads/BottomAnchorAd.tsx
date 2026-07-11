"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { FEATURE_FLAGS } from "@/lib/config/features";
import Link from "next/link";

interface BottomAnchorAdProps {
  contextSlug?: string;
  contextConcern?: string;
}

export default function BottomAnchorAd({ contextSlug = "generic", contextConcern }: BottomAnchorAdProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const isClosed = sessionStorage.getItem(`bottom_ad_closed_${contextSlug}`);
    if (!isClosed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [contextSlug]);

  const handleClose = () => {
    sessionStorage.setItem(`bottom_ad_closed_${contextSlug}`, "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  // Render AdSense Anchor Ads
  if (FEATURE_FLAGS.ENABLE_ADSENSE) {
    return (
      <div className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-zinc-200 z-50 md:hidden h-[50px] flex items-center justify-between px-4 shadow-lg">
        <div className="flex-1 overflow-hidden flex items-center justify-center">
          <ins className="adsbygoogle"
               style={{ display: "inline-block", width: "320px", height: "50px" }}
               data-ad-client="ca-pub-xxx"
               data-ad-slot="xxx" />
        </div>
        <button 
          onClick={handleClose}
          className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-zinc-900 border border-zinc-200 rounded-full ml-2 shrink-0 bg-zinc-50"
          aria-label="Đóng quảng cáo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Render Custom Affiliate Anchor
  const targetUrl = contextConcern 
    ? `/danh-muc-san-pham?concern=${contextConcern}`
    : "/danh-muc-san-pham";

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-amber-50 border-t border-amber-200/60 z-50 md:hidden h-[50px] flex items-center justify-between pl-4 pr-2 shadow-lg transition duration-200">
      <Link href={targetUrl} className="flex-1 flex items-center gap-2 min-w-0">
        <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded uppercase shrink-0">GỢI Ý</span>
        <span className="text-xs font-bold text-slate-800 truncate">
          {contextConcern === "tri-mun" ? "🔥 Săn sữa rửa mặt BHA kiềm dầu mụn chỉ từ 195k" : "🎁 Bật mí routine skincare khoa học tối giản cho da dầu"}
        </span>
      </Link>
      <div className="flex items-center gap-1 shrink-0">
        <Link 
          href={targetUrl}
          className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold rounded-full transition"
        >
          Xem
        </Link>
        <button 
          onClick={handleClose}
          className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-900 shrink-0"
          aria-label="Đóng"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
