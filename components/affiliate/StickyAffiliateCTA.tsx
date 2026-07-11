"use client";

import React, { useState, useEffect } from "react";
import AffiliateCtaButton from "./AffiliateCtaButton";

interface StickyAffiliateCTAProps {
  affiliateUrl: string;
  subId: string;
}

export default function StickyAffiliateCTA({ affiliateUrl, subId }: StickyAffiliateCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      
      const scrollPercent = (window.scrollY / scrollHeight) * 100;
      if (scrollPercent > 30) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      className={`fixed bottom-6 right-6 z-40 transition-all duration-300 transform ${
        isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <AffiliateCtaButton 
        url={affiliateUrl} 
        subId={subId} 
        text="Xem ngay" 
        className="shadow-lg border border-emerald-100/10 !rounded-full py-3 px-6 text-sm" 
      />
    </div>
  );
}
