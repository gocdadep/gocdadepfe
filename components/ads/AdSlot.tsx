import React from "react";

interface AdSlotProps {
  type?: "horizontal" | "vertical" | "sidebar";
}

export default function AdSlot({ type = "vertical" }: AdSlotProps) {
  let layoutClass = "ad-v-block";
  if (type === "horizontal") {
    layoutClass = "ad-h-banner";
  } else if (type === "sidebar") {
    layoutClass = "ad-sidebar";
  }

  return (
    <div 
      className={`ad-container ${layoutClass} w-full transition-colors duration-200`}
      data-testid="ads-container"
    >
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pointer-events-none mb-1">
        QUẢNG CÁO
      </span>
      <span className="text-xs text-slate-350 pointer-events-none">
        Liên kết được tài trợ
      </span>
    </div>
  );
}
