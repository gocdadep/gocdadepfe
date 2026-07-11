"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Menu } from "lucide-react";


interface HeaderProps {
  isStatic?: boolean;
}

export default function Header({ isStatic = false }: HeaderProps) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [isSticky, setIsSticky] = useState(false);
  const lastScrollY = useRef(0);
  const scrollThreshold = 15; // Ngưỡng cuộn lên tối thiểu (px) để tránh giật lag
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // Xác định xem đây có phải là chuyển đổi giữa các bài viết chi tiết tin tức (Related Articles click)
    const isRelatedArticleClick =
      prevPathname.current.startsWith("/tin-tuc/") &&
      prevPathname.current !== "/tin-tuc" &&
      pathname.startsWith("/tin-tuc/") &&
      pathname !== "/tin-tuc" &&
      prevPathname.current !== pathname;

    const handleScrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: isRelatedArticleClick ? "smooth" : "instant",
      });
    };

    // Thực hiện cuộn ngay lập tức
    handleScrollToTop();

    // Thực hiện cuộn lại sau khi DOM/layout ổn định (tránh bị lệch do CLS ảnh)
    const timer = setTimeout(handleScrollToTop, 50);

    prevPathname.current = pathname;
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (isStatic) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 1. Xác định trạng thái Sticky (co lại, mờ kính)
      if (currentScrollY >= 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }

      // 2. Xác định trạng thái ẩn/hiện (Smart Sticky)
      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        // Cuộn xuống -> ẩn
        setIsVisible(false);
      } else if (lastScrollY.current - currentScrollY > scrollThreshold) {
        // Cuộn lên vượt ngưỡng -> hiện
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollListener, { passive: true });
    return () => window.removeEventListener("scroll", scrollListener);
  }, [isStatic]);

  const getLinkClass = (path: string) => {
    const isActive = pathname.startsWith(path);
    const baseClass = "text-xs font-bold uppercase tracking-wider transition-colors ";
    if (isActive) {
      return baseClass + "text-zinc-900 border-b-2 border-zinc-900 pb-1";
    }
    return baseClass + "text-zinc-500 hover:text-zinc-900 pb-1 border-b-2 border-transparent";
  };

  let headerClass = "left-0 right-0 w-full transition-all duration-300 ";
  
  if (isStatic) {
    headerClass += "relative bg-white border-b border-zinc-200 h-16";
  } else {
    headerClass += "fixed top-0 z-50 ";
    
    if (isVisible) {
      headerClass += "translate-y-0 ";
    } else {
      headerClass += "-translate-y-full ";
    }

    if (isSticky) {
      headerClass += "bg-white/90 backdrop-blur-md border-b border-zinc-200 h-14 shadow-sm";
    } else {
      headerClass += "bg-white border-b border-zinc-200 h-16";
    }
  }

  return (
    <>
      {/* Placeholder để tránh Layout Shift khi Header ở trạng thái fixed */}
      {!isStatic && <div className="h-16 shrink-0" />}
      <header className={headerClass} data-testid="header-container">
        <nav className="max-w-5xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-zinc-900 tracking-tight" data-testid="link-logo">
              <Image src="/favicon-cropped.png" alt="Góc Da Đẹp Logo" width={28} height={28} className="w-7 h-7 rounded-lg" />
              <span>Góc Da Đẹp</span>
            </Link>
            <div className="hidden md:flex gap-6">
              <Link href="/phan-tich-thanh-phan" className={getLinkClass("/phan-tich-thanh-phan")} data-testid="link-analyzer">
                Phân tích bảng chất
              </Link>
              <Link href="/danh-muc-san-pham" className={getLinkClass("/danh-muc-san-pham")} data-testid="link-products">
                Tra cứu sản phẩm
              </Link>
              <Link href="/cam-nang" className={getLinkClass("/cam-nang")} data-testid="link-blog">
                Cẩm nang
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <button 
                  type="button" 
                  className="inline-flex shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 h-9 w-9 p-0 md:hidden cursor-pointer" 
                  aria-label="Mở menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-white">
                <SheetTitle className="text-left font-bold text-lg text-zinc-900">Menu</SheetTitle>
                <SheetDescription className="sr-only">Điều hướng nhanh hệ thống Góc Da Đẹp</SheetDescription>
                <nav className="flex flex-col gap-5 mt-8">
                  <Link href="/phan-tich-thanh-phan" className="text-sm font-semibold text-zinc-650 hover:text-zinc-900 transition-colors">
                    Phân tích bảng chất
                  </Link>
                  <Link href="/danh-muc-san-pham" className="text-sm font-semibold text-zinc-650 hover:text-zinc-900 transition-colors">
                    Tra cứu sản phẩm
                  </Link>
                  <Link href="/cam-nang" className="text-sm font-semibold text-zinc-650 hover:text-zinc-900 transition-colors">
                    Cẩm nang
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>
    </>
  );
}
