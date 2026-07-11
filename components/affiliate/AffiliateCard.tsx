"use client";

import React from "react";
import Image from "next/image";
import ShopeeButton from "./ShopeeButton";

interface AffiliateCardProps {
  product: {
    id: string;
    name: string;
    brand: string;
    image: string;
    shopeeUrl: string;
  };
  subId: string;
}

export default function AffiliateCard({ product, subId }: AffiliateCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-355 flex flex-col justify-between items-center text-center space-y-4 max-w-sm w-full">
      <div className="space-y-1">
        <span className="text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">
          Gợi ý dành cho bạn
        </span>
        <h4 className="font-bold text-slate-900 dark:text-white text-base leading-snug line-clamp-2">
          {product.name}
        </h4>
        <span className="text-xs text-accent font-semibold">{product.brand}</span>
      </div>
      
      {product.image && (
        <div className="relative w-32 h-32 flex items-center justify-center bg-slate-50 dark:bg-zinc-850 rounded-xl overflow-hidden">
          <Image 
            src={product.image} 
            alt={product.name} 
            width={128} 
            height={128}
            className="object-contain"
          />
        </div>
      )}

      <ShopeeButton 
        url={product.shopeeUrl} 
        subId={subId} 
        className="w-full text-sm" 
      />
    </div>
  );
}
