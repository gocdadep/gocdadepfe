"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Sparkles, Calendar, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ShopeeButton from "@/components/affiliate/ShopeeButton";
import { FEATURE_FLAGS } from "@/lib/config/features";
import { SKIN_TYPES } from "@/types/product";
import type { Product, Blog } from "@/types/product";

interface HomeClientProps {
  initialProducts: Product[];
  initialBlogs: Blog[];
}

// Concern mapping cho Quick Filter hàng 2
const POPULAR_CONCERNS = [
  { id: "tri-mun", label: "BHA Trị mụn" },
  { id: "chong-lao-hoa", label: "Retinol Anti-age" },
  { id: "lam-sang-da", label: "Vitamin C Sáng da" },
  { id: "kiem-soat-dau", label: "Niacinamide Thu lỗ" },
  { id: "phuc-hoi", label: "B5 Phục hồi" },
];

export default function HomeClient({ initialProducts, initialBlogs }: HomeClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [activeSkinType, setActiveSkinType] = useState<string | null>(null);
  const [activeConcern, setActiveConcern] = useState<string | null>(null);

  // Dropdown search sử dụng Fuse.js lazy load
  useEffect(() => {
    if (!searchQuery.trim()) {
      const timer = setTimeout(() => {
        setSearchResults([]);
      }, 0);
      return () => clearTimeout(timer);
    }

    const delayDebounceFn = setTimeout(() => {
      import("fuse.js").then(({ default: Fuse }) => {
        const fuse = new Fuse(initialProducts, {
          keys: ["name", "brand", "description"],
          threshold: 0.4,
        });
        const matched = fuse.search(searchQuery).map((r) => r.item).slice(0, 5);
        setSearchResults(matched);
      });
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, initialProducts]);

  // Độ an toàn của sản phẩm dựa trên thành phần (giả lập thuần client)
  const getProductSafety = (ingredientIds: string[]) => {
    const hasDanger = ingredientIds.some(id => id.includes("paraben") || id.includes("alcohol"));
    if (hasDanger) {
      return {
        label: "Cảnh báo",
        badgeClass: "bg-red-50 text-red-700 border-red-200",
        textColor: "text-red-700",
        barColor: "bg-red-600",
        percent: 45
      };
    }
    const hasWarning = ingredientIds.some(id => id.includes("fragrance") || id.includes("sulfate"));
    if (hasWarning) {
      return {
        label: "Lưu ý",
        badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
        textColor: "text-amber-700",
        barColor: "bg-amber-500",
        percent: 75
      };
    }
    return {
      label: "An toàn",
      badgeClass: "bg-green-50 text-green-700 border-green-200",
      textColor: "text-green-700",
      barColor: "bg-green-600",
      percent: 95
    };
  };

  // Bộ lọc sản phẩm in-memory
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (activeSkinType) {
      result = result.filter(p => p.skin_types?.includes(activeSkinType));
    }
    if (activeConcern) {
      result = result.filter(p => p.concerns?.includes(activeConcern));
    }

    return result.slice(0, 8);
  }, [activeSkinType, activeConcern, initialProducts]);

  // Lấy ra 6 blog hot nhất (publishedAt giảm dần)
  const hotBlogs = useMemo(() => {
    return [...initialBlogs]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 6);
  }, [initialBlogs]);

  const handleToggleSkinType = (id: string) => {
    setActiveSkinType(prev => prev === id ? null : id);
  };

  const handleToggleConcern = (id: string) => {
    setActiveConcern(prev => prev === id ? null : id);
  };

  const buildSeeMoreUrl = () => {
    const params = new URLSearchParams();
    if (activeSkinType) params.set("skin_type", activeSkinType);
    if (activeConcern) params.set("concern", activeConcern);
    return `/danh-muc-san-pham?${params.toString()}`;
  };

  return (
    <div className="w-full">
      {/* PHÂN ĐOẠN 1: Hero + Search + Quick Filter */}
      <section className="w-full max-w-5xl mx-auto px-6 py-12 md:py-16 text-center space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Tra cứu sản phẩm skincare thông minh cho Gen Z</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight text-slate-900">
            Tìm sản phẩm skincare phù hợp<br />
            <span className="text-emerald-500">với nhu cầu da của bạn</span>
          </h1>
          <p className="text-zinc-500 text-sm max-w-md mx-auto leading-relaxed">
            Tra cứu nhanh hoạt chất và kết nối các sản phẩm lành tính, an toàn được Shopee bảo trợ.
          </p>
        </div>

        {/* Search Input Container */}
        <div className="relative max-w-lg mx-auto w-full group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-400 z-10">
            <Search className="w-5 h-5 group-focus-within:text-zinc-900 transition-colors" />
          </div>
          <Input
            data-testid="input-product-search"
            type="text"
            className="flex h-14 w-full rounded-2xl border border-zinc-200 bg-white pl-12 pr-4 py-2 text-sm placeholder-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 focus-visible:border-transparent transition-all shadow-sm"
            placeholder="Tìm tên sản phẩm, hoạt chất, thương hiệu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Search suggestions */}
          {searchResults.length > 0 && (
            <div className="absolute z-30 top-16 left-0 right-0 bg-white border border-zinc-200 rounded-2xl shadow-lg overflow-hidden text-left divide-y divide-zinc-100">
              {searchResults.map((p) => {
                const safety = getProductSafety(p.ingredientIds);
                return (
                  <Link
                    key={p.id}
                    href={`/danh-muc-san-pham?search=${encodeURIComponent(p.name)}`}
                    className="flex items-center justify-between p-4 hover:bg-zinc-50 transition duration-200"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-zinc-450 uppercase tracking-wider block">{p.brand}</span>
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{p.name}</h4>
                    </div>
                    <Badge variant="outline" className={`${safety.badgeClass} rounded-full font-bold text-[9px]`}>
                      {safety.label}
                    </Badge>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Filter Tags */}
        <div className="max-w-xl mx-auto space-y-3 pt-2 text-left">
          {/* Hàng 1 (Loại da) */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider shrink-0 w-16">Loại da:</span>
            <div className="flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none pb-1">
              {SKIN_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleToggleSkinType(type.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition duration-200 cursor-pointer ${
                    activeSkinType === type.id
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "bg-white border border-zinc-200 text-zinc-650 hover:bg-zinc-50"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hàng 2 (Hoạt chất) */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider shrink-0 w-16">Vấn đề da:</span>
            <div className="flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none pb-1">
              {POPULAR_CONCERNS.map((concern) => (
                <button
                  key={concern.id}
                  onClick={() => handleToggleConcern(concern.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition duration-200 cursor-pointer ${
                    activeConcern === concern.id
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "bg-white border border-zinc-200 text-zinc-650 hover:bg-zinc-50"
                  }`}
                >
                  {concern.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PHÂN ĐOẠN 2: Lưới hiển thị Product Card */}
      <section className="w-full max-w-5xl mx-auto px-6 py-6 border-t border-zinc-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold tracking-tight text-slate-800 uppercase">
            {activeSkinType || activeConcern ? "Gợi ý sản phẩm phù hợp" : "Sản phẩm xu hướng nổi bật"}
          </h2>
          {(activeSkinType || activeConcern) && (
            <button 
              onClick={() => { setActiveSkinType(null); setActiveConcern(null); }}
              className="text-xs font-bold text-zinc-400 hover:text-zinc-700"
            >
              Reset bộ lọc
            </button>
          )}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredProducts.map((product) => {
              const safety = getProductSafety(product.ingredientIds);
              return (
                <Card
                  key={product.id}
                  className="overflow-hidden border border-zinc-100 flex flex-col justify-between shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 rounded-2xl bg-white"
                >
                  {/* Image Area */}
                  <div className="h-36 bg-zinc-50 flex items-center justify-center relative p-3">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={120}
                      height={120}
                      className="w-full h-full object-contain mix-blend-multiply rounded-lg"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge variant="outline" className={`${safety.badgeClass} text-[9px] font-bold py-0.5 px-2 rounded-full border`}>
                        {safety.label}
                      </Badge>
                    </div>
                  </div>

                  {/* Content Area */}
                  <CardContent className="p-4 flex-1 flex flex-col justify-between gap-3 text-left">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-400 block">
                        {product.brand}
                      </span>
                      <h4 className="font-bold text-xs leading-snug line-clamp-2 h-8 text-slate-800">
                        {product.name}
                      </h4>

                      <div className="space-y-1 pt-1.5">
                        <div className="flex justify-between items-center text-[9px] font-bold">
                          <span className="text-zinc-400">ĐỘ AN TOÀN</span>
                          <span className={`${safety.textColor}`}>{safety.percent}%</span>
                        </div>
                        <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${safety.barColor} transition-all duration-300`} 
                            style={{ width: `${safety.percent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Price and Button */}
                    <div className="border-t border-zinc-100 pt-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-orange-600">{product.price || "Liên hệ"}</span>
                        <span className="text-[8px] font-bold text-zinc-350 tracking-wider">TÀI TRỢ</span>
                      </div>
                      <ShopeeButton
                        url={product.shopeeUrl}
                        text="Mua tại Shopee"
                        productId={product.id}
                        productName={product.name}
                        subId="home_grid"
                        className="w-full text-xs rounded-full font-bold h-9"
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-medium text-zinc-400">
            Chưa tìm thấy sản phẩm phù hợp — thử chọn bộ lọc da/hoạt chất khác nhé.
          </div>
        )}

        {filteredProducts.length >= 8 && (
          <div className="flex justify-center mt-8">
            <Link
              href={buildSeeMoreUrl()}
              className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full text-xs font-bold uppercase tracking-wider transition"
            >
              Xem tất cả sản phẩm →
            </Link>
          </div>
        )}
      </section>

      {/* PHÂN ĐOẠN 3: Cẩm nang Skincare Hot */}
      <section className="w-full max-w-5xl mx-auto px-6 py-12 border-t border-zinc-100 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold tracking-tight text-slate-800 uppercase">Cẩm nang Skincare Hot tuần này</h2>
          <Link
            href="/cam-nang"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline uppercase tracking-wider"
          >
            Tất cả bài viết &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hotBlogs.map((blog) => (
            <Card
              key={blog.slug}
              className="border border-zinc-200 rounded-xl flex flex-col justify-between hover:shadow-md hover:border-zinc-300 transition-all duration-200 text-left"
            >
              <CardHeader className="p-6 pb-0 space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {blog.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-[9px] px-2.5 py-0.5 font-bold uppercase tracking-wider bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-none"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <Link
                  href={`/cam-nang/post/${blog.slug}`}
                  className="hover:text-zinc-700 transition-colors block"
                >
                  <h3 className="text-lg font-bold text-zinc-900 leading-snug">
                    {blog.title}
                  </h3>
                </Link>
              </CardHeader>

              <CardContent className="p-6 pt-2 pb-4">
                <p className="text-xs text-zinc-550 leading-relaxed line-clamp-2">
                  {blog.metaDescription}
                </p>
              </CardContent>
              
              <CardFooter className="p-6 pt-0 flex flex-col items-stretch gap-4">
                <Separator className="bg-zinc-100" />
                <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>{new Date(blog.publishedAt).toLocaleDateString("vi-VN")}</span>
                  </div>
                  <Link
                    href={`/cam-nang/post/${blog.slug}`}
                    className="text-zinc-800 hover:text-zinc-900 hover:underline flex items-center gap-0.5 font-bold cursor-pointer"
                  >
                    <span>Đọc tiếp</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <Link
            href="/cam-nang"
            className="px-6 py-3 border border-zinc-200 hover:bg-zinc-50 text-zinc-650 rounded-full text-xs font-bold uppercase tracking-wider transition"
          >
            Xem tất cả cẩm nang
          </Link>
        </div>
      </section>

      {/* PHÂN ĐOẠN AdSense (Tùy cấu hình) */}
      {FEATURE_FLAGS.ENABLE_ADSENSE && (
        <div className="w-full max-w-5xl mx-auto px-6 py-4">
          <div className="ad-container ad-h-banner min-h-[250px] w-full flex items-center justify-center border border-zinc-200 rounded-2xl bg-white">
            <ins className="adsbygoogle"
                 style={{ display: "block" }}
                 data-ad-client="ca-pub-xxx"
                 data-ad-slot="xxx"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
          </div>
        </div>
      )}
    </div>
  );
}
