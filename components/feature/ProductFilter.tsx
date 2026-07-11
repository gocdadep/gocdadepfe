"use client";

import { useState, useMemo, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import productsData from "@/data/products.json";
import ingredientsData from "@/data/ingredients.json";
import ShopeeButton from "@/components/affiliate/ShopeeButton";
import { Filter, RotateCcw, Search, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";

interface Product {
  id: string;
  name: string;
  brand: string;
  image: string;
  shopeeUrl: string;
  ingredientIds: string[];
  price?: string;
  description?: string;
  category?: string;
}

interface Ingredient {
  id: string;
  name: string;
  safetyLevel: string;
  description: string;
  aliases: string[];
}

function ProductFilterContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [includes, setIncludes] = useState<string[]>([]);
  const [excludes, setExcludes] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Nạp từ điển hoạt chất
  const ingredientsDict = useMemo(() => {
    const dict: Record<string, Ingredient> = {};
    (ingredientsData as Ingredient[]).forEach((ing) => {
      dict[ing.id] = ing;
    });
    return dict;
  }, []);

  // Logic Lọc dữ liệu
  const filteredProducts = (productsData as Product[]).filter((product) => {
    // Lọc theo category tab
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    // Lọc theo từ khóa tìm kiếm
    const lowerQuery = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery.trim() === "" ||
      product.name.toLowerCase().includes(lowerQuery) ||
      product.brand.toLowerCase().includes(lowerQuery);

    // Lọc theo yêu cầu hoạt chất
    const matchesIncludes = includes.every((id) =>
      product.ingredientIds.includes(id)
    );

    // Lọc theo chất loại trừ
    const matchesExcludes = !excludes.some((id) =>
      product.ingredientIds.includes(id)
    );

    return matchesCategory && matchesSearch && matchesIncludes && matchesExcludes;
  });

  const toggleInclude = (id: string) => {
    if (includes.includes(id)) {
      setIncludes(includes.filter((item) => item !== id));
    } else {
      setIncludes([...includes, id]);
      setExcludes(excludes.filter((item) => item !== id));
    }
  };

  const toggleExclude = (id: string) => {
    if (excludes.includes(id)) {
      setExcludes(excludes.filter((item) => item !== id));
    } else {
      setExcludes([...excludes, id]);
      setIncludes(includes.filter((item) => item !== id));
    }
  };

  const resetFilters = () => {
    setIncludes([]);
    setExcludes([]);
    setSearchQuery("");
    setSelectedCategory("all");
  };

  // Presets lọc nhanh
  const handleQuickFilter = (type: "no-alcohol" | "no-paraben" | "has-niacinamide" | "has-retinol" | "has-vitamin-c") => {
    if (type === "no-alcohol") {
      if (excludes.includes("alcohol-denat")) {
        setExcludes(excludes.filter(id => id !== "alcohol-denat"));
      } else {
        setExcludes([...excludes, "alcohol-denat"]);
        setIncludes(includes.filter(id => id !== "alcohol-denat"));
      }
    } else if (type === "no-paraben") {
      if (excludes.includes("methylparaben")) {
        setExcludes(excludes.filter(id => id !== "methylparaben"));
      } else {
        setExcludes([...excludes, "methylparaben"]);
        setIncludes(includes.filter(id => id !== "methylparaben"));
      }
    } else if (type === "has-niacinamide") {
      if (includes.includes("niacinamide")) {
        setIncludes(includes.filter(id => id !== "niacinamide"));
      } else {
        setIncludes([...includes, "niacinamide"]);
        setExcludes(excludes.filter(id => id !== "niacinamide"));
      }
    } else if (type === "has-retinol") {
      if (includes.includes("retinol")) {
        setIncludes(includes.filter(id => id !== "retinol"));
      } else {
        setIncludes([...includes, "retinol"]);
        setExcludes(excludes.filter(id => id !== "retinol"));
      }
    } else if (type === "has-vitamin-c") {
      if (includes.includes("vitamin-c")) {
        setIncludes(includes.filter(id => id !== "vitamin-c"));
      } else {
        setIncludes([...includes, "vitamin-c"]);
        setExcludes(excludes.filter(id => id !== "vitamin-c"));
      }
    }
  };

  // Hàm tính toán độ an toàn của sản phẩm dựa trên thành phần
  const getProductSafety = (ingredientIds: string[]) => {
    let hasDanger = false;
    let hasCaution = false;
    
    ingredientIds.forEach((id) => {
      const ing = ingredientsDict[id];
      if (ing) {
        if (ing.safetyLevel === "DANGER") hasDanger = true;
        if (ing.safetyLevel === "CAUTION") hasCaution = true;
      }
    });

    if (hasDanger) {
      return { 
        label: "CẢN TRỌNG", 
        badgeClass: "bg-red-50 text-red-700 border-red-100 hover:bg-red-50", 
        textColor: "text-red-700", 
        barColor: "bg-red-500",
        percent: 45
      };
    }
    if (hasCaution) {
      return { 
        label: "CẦN TRỌNG", 
        badgeClass: "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-50", 
        textColor: "text-amber-700", 
        barColor: "bg-amber-500",
        percent: 72
      };
    }
    return { 
      label: "AN TOÀN", 
      badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-100 hover:bg-emerald-50", 
      textColor: "text-emerald-800", 
      barColor: "bg-emerald-700",
      percent: 95
    };
  };

  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "cleanser", name: "Làm sạch" },
    { id: "moisturizer", name: "Dưỡng ẩm" },
    { id: "sunscreen", name: "Chống nắng" },
    { id: "serum", name: "Tinh chất" },
  ];

  // Render các bộ lọc chi tiết cho Sidebar và Drawer
  const renderFilterOptions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
        <div className="flex items-center gap-1.5 text-slate-800 font-semibold text-sm">
          <Filter className="w-4 h-4 text-emerald-850" />
          <span>Bộ lọc hoạt chất</span>
        </div>
        {(includes.length > 0 || excludes.length > 0 || searchQuery !== "") && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="text-xs h-auto p-0 text-zinc-500 hover:bg-transparent hover:text-emerald-800 hover:underline font-bold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Xóa bộ lọc</span>
          </Button>
        )}
      </div>

      {/* Yêu Cầu Chứa Hoạt Chất */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold text-slate-700 block">Yêu cầu chứa chất:</span>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {ingredientsData.map((ing) => (
            <label key={ing.id} className="flex items-center gap-2 text-xs font-medium cursor-pointer text-slate-750">
              <input
                type="checkbox"
                checked={includes.includes(ing.id)}
                onChange={() => toggleInclude(ing.id)}
                className="rounded border-zinc-300 text-emerald-800 focus:ring-emerald-800 w-4 h-4 cursor-pointer"
              />
              <span>{ing.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tránh Hoạt Chất */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold text-slate-700 block">Tránh hoạt chất:</span>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {ingredientsData.map((ing) => (
            <label key={ing.id} className="flex items-center gap-2 text-xs font-medium cursor-pointer text-slate-755">
              <input
                type="checkbox"
                checked={excludes.includes(ing.id)}
                onChange={() => toggleExclude(ing.id)}
                className="rounded border-zinc-300 text-emerald-800 focus:ring-emerald-800 w-4 h-4 cursor-pointer"
              />
              <span>{ing.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-left selection:bg-emerald-50 selection:text-emerald-800">
      
      {/* Mobile Search & Navigation tabs */}
      <div className="block md:hidden space-y-4">
        {/* Mobile Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            data-testid="input-product-search"
            type="text"
            className="pl-9 h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 text-sm placeholder-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-800 transition-all"
            placeholder="Tìm kiếm mỹ phẩm, thành phần..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category horizontal scroll bar */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 -mx-6 px-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${
                selectedCategory === cat.id
                  ? "bg-emerald-800 border-emerald-800 text-white"
                  : "bg-zinc-50 border-zinc-200 text-slate-800 hover:bg-zinc-100"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Mobile Filter bar */}
        <div className="flex justify-between items-center bg-zinc-50/50 border border-zinc-150 p-3 rounded-xl">
          <div className="text-xs font-bold text-slate-800">
            PHÂN TÍCH BỞI CHUYÊN GIA • {filteredProducts.length} SẢN PHẨM
          </div>
          <Drawer>
            <DrawerTrigger className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 h-8 text-xs px-3 font-bold gap-1 cursor-pointer">
              <Filter className="w-3.5 h-3.5 text-emerald-800" />
              <span>Lọc</span>
            </DrawerTrigger>
            <DrawerContent className="p-6 bg-white">
              <DrawerTitle className="text-left font-bold text-zinc-900">Bộ lọc chi tiết</DrawerTitle>
              <DrawerDescription className="sr-only">Tùy chọn hoạt chất cho sản phẩm mỹ phẩm</DrawerDescription>
              <div className="mt-4 max-h-[70vh] overflow-y-auto pb-8">
                {renderFilterOptions()}
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      {/* Desktop Search & Header Filter Quick Bar */}
      <div className="hidden md:block space-y-5">
        {/* Desktop Search Input with Big Icon */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-emerald-800" />
          <Input
            data-testid="input-product-search"
            type="text"
            className="pl-9 h-9 w-full rounded-lg border border-zinc-150 bg-white text-xs placeholder-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-800 focus-visible:border-transparent transition-all"
            placeholder="Tìm kiếm sản phẩm, thương hiệu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Horizontal Quick Filter Tags Bar */}
        <div className="flex items-center gap-3 bg-white border border-zinc-200/45 px-5 py-3.5 rounded-xl shadow-sm">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            BỘ LỌC HOẠT CHẤT:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleQuickFilter("no-alcohol")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition duration-200 ${
                excludes.includes("alcohol-denat")
                  ? "bg-emerald-800 border-emerald-800 text-white"
                  : "bg-zinc-50 border-zinc-150 text-slate-800 hover:bg-zinc-100"
              }`}
            >
              [Không Cồn] {excludes.includes("alcohol-denat") && "✕"}
            </button>
            <button
              onClick={() => handleQuickFilter("no-paraben")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition duration-200 ${
                excludes.includes("methylparaben")
                  ? "bg-emerald-800 border-emerald-800 text-white"
                  : "bg-zinc-50 border-zinc-150 text-slate-800 hover:bg-zinc-100"
              }`}
            >
              [Không Paraben] {excludes.includes("methylparaben") && "✕"}
            </button>
            <button
              onClick={() => handleQuickFilter("has-retinol")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition duration-200 ${
                includes.includes("retinol")
                  ? "bg-emerald-800 border-emerald-800 text-white"
                  : "bg-zinc-50 border-zinc-150 text-slate-800 hover:bg-zinc-100"
              }`}
            >
              [Có Retinol] {includes.includes("retinol") && "✕"}
            </button>
            <button
              onClick={() => handleQuickFilter("has-niacinamide")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition duration-200 ${
                includes.includes("niacinamide")
                  ? "bg-emerald-800 border-emerald-800 text-white"
                  : "bg-zinc-50 border-zinc-150 text-slate-800 hover:bg-zinc-100"
              }`}
            >
              [Có Niacinamide] {includes.includes("niacinamide") && "✕"}
            </button>
            <button
              onClick={() => handleQuickFilter("has-vitamin-c")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition duration-200 ${
                includes.includes("vitamin-c")
                  ? "bg-emerald-800 border-emerald-800 text-white"
                  : "bg-zinc-50 border-zinc-150 text-slate-800 hover:bg-zinc-100"
              }`}
            >
              [Vitamin C] {includes.includes("vitamin-c") && "✕"}
            </button>

            {(includes.length > 0 || excludes.length > 0 || selectedCategory !== "all") && (
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-zinc-500 hover:text-emerald-800 underline ml-2"
              >
                Xóa tất cả
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Bộ lọc (Desktop) */}
        <div className="hidden md:block md:col-span-1 bg-white border border-zinc-200/45 p-5 rounded-xl space-y-6 h-fit shadow-sm">
          {renderFilterOptions()}
        </div>

        {/* Grid Kết quả */}
        <div className="md:col-span-3 space-y-6">
          <div className="hidden md:flex justify-between items-center bg-zinc-50 border border-zinc-100 px-4 py-2.5 rounded-lg text-xs font-semibold text-zinc-700">
            <span>Tìm thấy {filteredProducts.length} sản phẩm phù hợp</span>
            <span className="text-[10px] opacity-75">Cập nhật theo thời gian thực</span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {filteredProducts.map((product) => {
                const safety = getProductSafety(product.ingredientIds);
                return (
                  <Card
                    key={product.id}
                    className="overflow-hidden border border-zinc-100 flex flex-col justify-between shadow-sm hover:shadow-md transition duration-200 rounded-2xl bg-white"
                  >
                    {/* Image Area */}
                    <div className="h-44 md:h-36 bg-zinc-50/50 flex items-center justify-center relative p-3">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={120}
                        height={120}
                        className="w-full h-full object-contain mix-blend-multiply rounded-lg"
                      />
                      <div className="absolute top-2.5 left-2.5">
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
                        <p className="text-[10px] text-zinc-500 line-clamp-1">
                          {product.description}
                        </p>
                      </div>

                      {/* Safety Scale & CTA */}
                      <div className="space-y-3.5">
                        {/* Độ an toàn progress bar */}
                        <div className="space-y-1">
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

                        {/* Giá và nút Shopee */}
                        <div className="border-t border-zinc-100 pt-3 flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-orange-600">{product.price || "Liên hệ"}</span>
                            <span className="text-[8px] font-bold text-zinc-350 tracking-wider">TÀI TRỢ</span>
                          </div>
                          {/* Shopee Button full width on mobile, inline on desktop */}
                          <ShopeeButton 
                            url={product.shopeeUrl} 
                            text="Mua tại Shopee"
                            className="w-full text-xs rounded-xl font-bold"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="p-12 bg-white border border-zinc-200 rounded-xl text-center text-xs text-zinc-500 shadow-sm">
              Không tìm thấy sản phẩm phù hợp điều kiện lọc. Vui lòng bấm{" "}
              <Button variant="link" onClick={resetFilters} className="text-emerald-800 font-bold h-auto p-0 cursor-pointer hover:no-underline hover:text-emerald-900">
                Xóa bộ lọc
              </Button>{" "}
              để xem lại danh sách đầy đủ.
            </div>
          )}

          {/* Desktop/Mobile pagination */}
          {filteredProducts.length > 0 && (
            <div className="flex items-center justify-center gap-1.5 pt-4">
              <button className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-zinc-50 text-xs font-semibold cursor-pointer">
                &lt;
              </button>
              <button className="h-8 w-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center text-xs font-bold">
                1
              </button>
              <button className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-zinc-50 text-xs font-semibold cursor-pointer">
                2
              </button>
              <button className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-zinc-50 text-xs font-semibold cursor-pointer">
                3
              </button>
              <span className="px-1 text-zinc-400 text-xs">...</span>
              <button className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-zinc-50 text-xs font-semibold cursor-pointer">
                12
              </button>
              <button className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-zinc-50 text-xs font-semibold cursor-pointer">
                &gt;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductFilter() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-sm font-semibold text-emerald-800">Đang tải bộ lọc sản phẩm...</p>
      </div>
    }>
      <ProductFilterContent />
    </Suspense>
  );
}
