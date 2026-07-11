"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, BookOpen, Layers } from "lucide-react";

export default function BottomNavBar() {
  const pathname = usePathname();
  
  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/phan-tich-thanh-phan", label: "Analyzer", icon: Search },
    { href: "/danh-muc-san-pham", label: "Products", icon: Layers },
    { href: "/cam-nang", label: "Blog", icon: BookOpen },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-zinc-200 shadow-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center w-1/4 gap-1 h-full min-h-[48px] transition-colors ${
                isActive ? "text-zinc-900 font-semibold" : "text-zinc-400 hover:text-zinc-650"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] uppercase tracking-wider">{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
