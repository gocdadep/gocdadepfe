"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShopeeButton from "@/components/affiliate/ShopeeButton";
import productsData from "@/data/products.json";
import ingredientsData from "@/data/ingredients.json";
import { Search, Sparkles, ArrowRight, Verified, Group, ShieldCheck, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface Product {
  id: string;
  name: string;
  brand: string;
  image: string;
  shopeeUrl: string;
  ingredientIds: string[];
}

interface Ingredient {
  id: string;
  name: string;
  safetyLevel: string;
  description: string;
  aliases: string[];
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [textareaInput, setTextareaInput] = useState("");

  // Nạp từ điển hoạt chất để tra cứu nhanh bằng useMemo, tránh render cascading
  const ingredientsDict = useMemo(() => {
    const dict: Record<string, Ingredient> = {};
    (ingredientsData as Ingredient[]).forEach((ing) => {
      dict[ing.id] = ing;
    });
    return dict;
  }, []);

  // Xử lý tìm kiếm sản phẩm (fuzzy search in-memory đơn giản và nhanh)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim() === "") {
        setSearchResults([]);
        return;
      }
      const lowerQuery = searchQuery.toLowerCase();
      const matched = (productsData as Product[]).filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.brand.toLowerCase().includes(lowerQuery)
      );
      setSearchResults(matched);
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Hàm tính toán độ an toàn của sản phẩm dựa trên thành phần
  const getProductSafety = (ingredientIds: string[]) => {
    let hasDanger = false;
    
    ingredientIds.forEach((id) => {
      const ing = ingredientsDict[id];
      if (ing) {
        if (ing.safetyLevel === "DANGER") hasDanger = true;
      }
    });

    if (hasDanger) {
      return { 
        label: "Cảnh báo", 
        variant: "danger" as const, 
        badgeClass: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50", 
        textColor: "text-red-700", 
        barColor: "bg-red-600" 
      };
    }
    if (isActiveSafety(ingredientIds)) {
      return { 
        label: "An toàn", 
        variant: "safe" as const, 
        badgeClass: "bg-green-50 text-green-700 border-green-200 hover:bg-green-50", 
        textColor: "text-green-700", 
        barColor: "bg-green-600" 
      };
    }
    return { 
      label: "Lưu ý", 
      variant: "caution" as const, 
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50", 
      textColor: "text-amber-700", 
      barColor: "bg-amber-600" 
    };
  };

  const isActiveSafety = (ingredientIds: string[]) => {
    return ingredientIds.every(id => {
      const ing = ingredientsDict[id];
      return !ing || ing.safetyLevel === "SAFE";
    });
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col justify-between selection:bg-zinc-100">
      <Header />

      <main className="flex-grow pt-16 flex flex-col justify-between relative overflow-hidden">
        {/* Hero & Search Section */}
        <section className="relative z-10 w-full max-w-5xl mx-auto px-6 py-12 md:py-16 text-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-700 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Phân tích mỹ phẩm & Tra cứu hoạt chất skincare</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight max-w-4xl mx-auto leading-tight text-zinc-900">
              Thành phần nào đang nằm<br />
              <span className="text-emerald-700">trong hũ kem của bạn?</span>
            </h1>
            <p className="text-zinc-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-normal">
              Tra cứu hoạt chất và phân tích độ lành tính mỹ phẩm khoa học, khách quan, giúp bảo vệ làn da của bạn.
            </p>
          </div>

          {/* Search Input Container - Command Style */}
          <div className="relative max-w-lg mx-auto w-full group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-zinc-400 z-10">
              <Search className="w-5 h-5 group-focus-within:text-zinc-900 transition-colors" />
            </div>
            <Input
              data-testid="input-product-search"
              type="text"
              className="flex h-12 w-full rounded-lg border border-zinc-200 bg-white pl-10 pr-4 py-2 text-sm placeholder-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-900 focus-visible:border-transparent transition-all shadow-sm"
              placeholder="Gõ tên hoạt chất hoặc sản phẩm (ví dụ: Retinol, BHA...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Dropdown Results list */}
            {searchResults.length > 0 && (
              <div className="absolute z-30 top-14 left-0 right-0 bg-white border border-zinc-200 rounded-lg shadow-lg overflow-hidden text-left divide-y divide-zinc-100">
                {searchResults.map((p) => {
                  const safety = getProductSafety(p.ingredientIds);
                  return (
                    <Link
                      key={p.id}
                      href={`/danh-muc-san-pham?search=${encodeURIComponent(p.name)}`}
                      className="flex items-center justify-between p-3.5 hover:bg-zinc-50 transition duration-200"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">{p.brand}</span>
                        <h4 className="text-sm font-semibold text-zinc-900">{p.name}</h4>
                      </div>
                      <Badge variant="outline" className={`${safety.badgeClass}`}>
                        {safety.label}
                      </Badge>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Popular Search tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-zinc-500 font-semibold">Phổ biến:</span>
            {["Niacinamide", "Cồn khô", "Methylparaben"].map((tag) => (
              <Button
                key={tag}
                variant="secondary"
                size="sm"
                onClick={() => setSearchQuery(tag)}
                className="h-8 px-3 rounded-full cursor-pointer bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-none"
              >
                {tag}
              </Button>
            ))}
          </div>
        </section>

        {/* Free Form Ingredients Analyzer Module */}
        <section className="w-full max-w-5xl mx-auto px-6 py-6 md:py-8 z-10 relative">
          <Card className="max-w-lg mx-auto border border-zinc-200 bg-white shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-zinc-900" />
                <h3 className="font-semibold text-lg text-zinc-900 tracking-tight">Phân tích bảng thành phần tự do</h3>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Dán danh sách hoạt chất ngăn cách bởi dấu phẩy (Water, Niacinamide, Glycerin...) để kiểm tra độc hại nhanh.
              </p>
              <Textarea
                data-testid="textarea-ingredients-input"
                className="flex min-h-[120px] w-full rounded-md border border-zinc-200 bg-zinc-55 px-3 py-2 text-sm placeholder-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-900 resize-none text-zinc-900"
                placeholder="Ví dụ: Water, Glycerin, Phenoxyethanol..."
                value={textareaInput}
                onChange={(e) => setTextareaInput(e.target.value)}
              />
              <Button asChild className="w-full h-11 bg-zinc-900 text-white hover:bg-zinc-800 cursor-pointer">
                <Link
                  data-testid="btn-analyze-ingredients"
                  href={`/phan-tich-thanh-phan?ingredients=${encodeURIComponent(textareaInput)}`}
                >
                  Phân Tích Ngay
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Section Cảnh báo chất cấm từ Cục quản lý Dược */}
        <section className="w-full max-w-xl mx-auto px-6 py-4 z-10 relative">
          <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-700">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-700" />
            <AlertTitle className="font-bold text-sm">Cảnh báo hoạt chất</AlertTitle>
            <AlertDescription className="text-xs leading-relaxed text-red-600 font-medium">
              Các hoạt chất như Corticoid, Hydroquinone (nồng độ cao không kiểm soát) bị Cục Quản lý Dược khuyến cáo có thể gây tổn thương da nghiêm trọng nếu lạm dụng.
            </AlertDescription>
          </Alert>
        </section>

        {/* Trending Products Grid Slider */}
        <section className="w-full max-w-5xl mx-auto px-6 py-12 space-y-6 z-10 relative">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">Sản phẩm Xu hướng</h2>
            <Link
              href="/danh-muc-san-pham"
              className="text-zinc-600 font-semibold text-sm flex items-center gap-1 hover:underline underline-offset-4"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-none scroll-smooth">
            {productsData.map((p) => {
              const safety = getProductSafety(p.ingredientIds);
              return (
                <Card
                  key={p.id}
                  className="min-w-[170px] w-44 flex-shrink-0 border border-zinc-150 bg-white text-zinc-900 shadow-none overflow-hidden flex flex-col transition-all hover:shadow-sm"
                >
                  <div className="h-40 bg-zinc-50 flex items-center justify-center relative p-4">
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={160}
                      height={160}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge variant="outline" className={`${safety.badgeClass}`}>
                        {safety.label}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4 flex flex-col flex-1 justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">{p.brand}</span>
                      <h3 className="text-xs font-semibold leading-tight line-clamp-2 h-8 text-zinc-900">{p.name}</h3>
                    </div>
                    
                    <div className="space-y-2">
                      {/* Tỷ lệ thanh tiến trình an toàn */}
                      <div className="flex items-center gap-2">
                        <div className="h-1 flex-1 bg-zinc-150 rounded-full overflow-hidden">
                          <div className={`h-full ${safety.barColor} w-[80%]`}></div>
                        </div>
                        <span className={`text-[9px] font-bold ${safety.textColor}`}>{safety.label}</span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-1 border-t border-zinc-100">
                        <span className="text-[9px] font-bold text-zinc-400 uppercase">ĐƯỢC TÀI TRỢ</span>
                        <ShopeeButton url={p.shopeeUrl} className="h-7 px-2.5 rounded-md text-[10px]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Quality Metrics & Social Proof */}
        <section className="w-full max-w-5xl mx-auto px-6 py-6 md:py-12 grid grid-cols-2 md:grid-cols-4 gap-8 z-10 relative items-center">
          <div className="col-span-2 p-8 bg-zinc-950 text-white rounded-xl shadow-none flex flex-col justify-between min-h-[160px]">
            <div className="space-y-2">
              <h3 className="text-lg md:text-xl font-bold">Chỉ số An toàn Toàn diện</h3>
              <p className="text-xs font-medium opacity-80 leading-relaxed max-w-sm">
                Phân tích dựa trên EWG, CIR và các nghiên cứu khoa học mới nhất từ chuyên gia chăm sóc da.
              </p>
            </div>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-bold tracking-tighter">100%</span>
              <span className="text-xs font-semibold opacity-80 uppercase tracking-widest">Khách quan</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-start p-4 text-center md:text-left space-y-3 bg-white rounded-xl border border-transparent">
            <Verified className="w-8 h-8 text-emerald-700" />
            <div>
              <div className="text-3xl font-bold tracking-tight text-zinc-900">12K+</div>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-1">Hoạt chất</div>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-start p-4 text-center md:text-left space-y-3 bg-white rounded-xl border border-transparent">
            <Group className="w-8 h-8 text-zinc-700" />
            <div>
              <div className="text-3xl font-bold tracking-tight text-zinc-900">50K+</div>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-1">Người dùng</div>
            </div>
          </div>
        </section>

        {/* Google AdSense Anti-CLS container */}
        <div className="w-full max-w-5xl mx-auto px-6 py-4">
          <div className="ad-container ad-h-banner min-h-[250px] w-full flex items-center justify-center border border-zinc-200 rounded-xl bg-white">
            <ins className="adsbygoogle"
                 style={{ display: "block" }}
                 data-ad-client="ca-pub-xxx"
                 data-ad-slot="xxx"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
