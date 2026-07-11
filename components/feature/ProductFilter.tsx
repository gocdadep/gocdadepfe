"use client";

import { useState, useMemo, Suspense } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { productsData } from "@/lib/tiki-products";
import ingredientsData from "@/data/ingredients.json";
import ShopeeButton from "@/components/affiliate/ShopeeButton";
import InFeedAdSlot from "@/components/ads/InFeedAdSlot";
import { Filter, RotateCcw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Drawer, DrawerTrigger, DrawerContent, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import type { Product } from "@/types/product";
import { SKIN_TYPES, CONCERNS } from "@/types/product";

function ProductFilterContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialSearch = searchParams.get("search") || "";
  const initialSkinType = searchParams.get("skin_type") || "all";
  const initialConcern = searchParams.get("concern") || "";
  const initialIngredient = searchParams.get("ingredient") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedSkinType, setSelectedSkinType] = useState(initialSkinType);
  const [selectedConcern, setSelectedConcern] = useState(initialConcern);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [includes, setIncludes] = useState<string[]>(initialIngredient ? [initialIngredient] : []);
  const [excludes, setExcludes] = useState<string[]>([]);

  // Đồng bộ params từ URL bằng cách để key quản lý việc mount/unmount tự nhiên của Component con phía dưới

  // Nạp từ điển hoạt chất
  const ingredientsDict = useMemo(() => {
    const dict: Record<string, { id: string; name: string; safetyLevel: string }> = {};
    ingredientsData.forEach((ing) => {
      dict[ing.id] = ing;
    });
    return dict;
  }, []);

  // Sync state lên URL query parameters
  const updateUrlParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Logic Lọc dữ liệu
  const filteredProducts = useMemo(() => {
    return (productsData as Product[]).filter((product) => {
      // 1. Lọc theo category tab
      if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
      }

      // 2. Lọc theo skin_type
      if (selectedSkinType !== "all" && !(product.skin_types || []).includes(selectedSkinType)) {
        return false;
      }

      // 3. Lọc theo concern
      if (selectedConcern !== "" && !(product.concerns || []).includes(selectedConcern)) {
        return false;
      }

      // 4. Lọc theo từ khóa tìm kiếm
      const lowerQuery = searchQuery.toLowerCase().trim();
      if (lowerQuery !== "") {
        const matchesSearch =
          product.name.toLowerCase().includes(lowerQuery) ||
          product.brand.toLowerCase().includes(lowerQuery) ||
          (product.description || "").toLowerCase().includes(lowerQuery);
        if (!matchesSearch) return false;
      }

      // 5. Lọc theo yêu cầu hoạt chất (INCLUDES)
      const matchesIncludes = includes.every((id) =>
        product.ingredientIds.includes(id)
      );
      if (!matchesIncludes) return false;

      // 6. Lọc theo chất loại trừ (EXCLUDES)
      const matchesExcludes = !excludes.some((id) =>
        product.ingredientIds.includes(id)
      );
      if (!matchesExcludes) return false;

      return true;
    });
  }, [selectedCategory, selectedSkinType, selectedConcern, searchQuery, includes, excludes]);

  const toggleInclude = (id: string) => {
    let newIncludes;
    if (includes.includes(id)) {
      newIncludes = includes.filter((item) => item !== id);
    } else {
      newIncludes = [...includes, id];
      setExcludes(excludes.filter((item) => item !== id));
    }
    setIncludes(newIncludes);
    updateUrlParams({ ingredient: newIncludes[0] || "" });
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
    setSelectedSkinType("all");
    setSelectedConcern("");
    setSelectedCategory("all");
    router.replace(window.location.pathname, { scroll: false });
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
      const active = includes.includes("niacinamide");
      const next = active ? [] : ["niacinamide"];
      setIncludes(next);
      setExcludes(excludes.filter(id => id !== "niacinamide"));
      updateUrlParams({ ingredient: next[0] || "" });
    } else if (type === "has-retinol") {
      const active = includes.includes("retinol");
      const next = active ? [] : ["retinol"];
      setIncludes(next);
      setExcludes(excludes.filter(id => id !== "retinol"));
      updateUrlParams({ ingredient: next[0] || "" });
    } else if (type === "has-vitamin-c") {
      const active = includes.includes("vitamin-c");
      const next = active ? [] : ["vitamin-c"];
      setIncludes(next);
      setExcludes(excludes.filter(id => id !== "vitamin-c"));
      updateUrlParams({ ingredient: next[0] || "" });
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
        label: "CẨN TRỌNG", 
        badgeClass: "bg-rose-50 text-red-700 border-red-100 font-bold hover:bg-rose-50", 
        textColor: "text-red-700", 
        barColor: "bg-red-500",
        percent: 45
      };
    }
    if (hasCaution) {
      return { 
        label: "CẦN LƯU Ý", 
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
          <span>Bộ lọc nâng cao</span>
        </div>
        {(includes.length > 0 || excludes.length > 0 || searchQuery !== "" || selectedSkinType !== "all" || selectedConcern !== "") && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="text-xs h-auto p-0 text-zinc-500 hover:bg-transparent hover:text-emerald-850 hover:underline font-bold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Xóa bộ lọc</span>
          </Button>
        )}
      </div>

      {/* Lọc theo Loại Da */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-700 block">Phù hợp loại da:</span>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => {
              setSelectedSkinType("all");
              updateUrlParams({ skin_type: "all" });
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
              selectedSkinType === "all"
                ? "bg-emerald-800 border-emerald-800 text-white"
                : "bg-zinc-50 border-zinc-200 text-slate-800 hover:bg-zinc-100"
            }`}
          >
            Tất cả
          </button>
          {SKIN_TYPES.map((st) => (
            <button
              key={st.id}
              onClick={() => {
                setSelectedSkinType(st.id);
                updateUrlParams({ skin_type: st.id });
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                selectedSkinType === st.id
                  ? "bg-emerald-800 border-emerald-800 text-white"
                  : "bg-zinc-50 border-zinc-200 text-slate-800 hover:bg-zinc-100"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lọc theo Vấn đề Da */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-700 block">Vấn đề da:</span>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => {
              setSelectedConcern("");
              updateUrlParams({ concern: "" });
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
              selectedConcern === ""
                ? "bg-emerald-800 border-emerald-800 text-white"
                : "bg-zinc-50 border-zinc-200 text-slate-800 hover:bg-zinc-100"
            }`}
          >
            Tất cả
          </button>
          {CONCERNS.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedConcern(c.id);
                updateUrlParams({ concern: c.id });
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                selectedConcern === c.id
                  ? "bg-emerald-800 border-emerald-800 text-white"
                  : "bg-zinc-50 border-zinc-200 text-slate-800 hover:bg-zinc-100"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
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
            placeholder="Gõ hoạt chất (BHA, Retinol...) hoặc tên sản phẩm..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              updateUrlParams({ search: e.target.value });
            }}
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
            placeholder="Gõ hoạt chất (BHA, Retinol...) hoặc tên sản phẩm..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              updateUrlParams({ search: e.target.value });
            }}
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
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition duration-200 cursor-pointer ${
                excludes.includes("alcohol-denat")
                  ? "bg-emerald-800 border-emerald-800 text-white"
                  : "bg-zinc-50 border-zinc-150 text-slate-800 hover:bg-zinc-100"
              }`}
            >
              Không Cồn {excludes.includes("alcohol-denat") && "✕"}
            </button>
            <button
              onClick={() => handleQuickFilter("no-paraben")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition duration-200 cursor-pointer ${
                excludes.includes("methylparaben")
                  ? "bg-emerald-800 border-emerald-800 text-white"
                  : "bg-zinc-50 border-zinc-150 text-slate-800 hover:bg-zinc-100"
              }`}
            >
              Không Paraben {excludes.includes("methylparaben") && "✕"}
            </button>
            <button
              onClick={() => handleQuickFilter("has-retinol")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition duration-200 cursor-pointer ${
                includes.includes("retinol")
                  ? "bg-emerald-800 border-emerald-800 text-white"
                  : "bg-zinc-50 border-zinc-150 text-slate-800 hover:bg-zinc-100"
              }`}
            >
              Có Retinol {includes.includes("retinol") && "✕"}
            </button>
            <button
              onClick={() => handleQuickFilter("has-niacinamide")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition duration-200 cursor-pointer ${
                includes.includes("niacinamide")
                  ? "bg-emerald-800 border-emerald-800 text-white"
                  : "bg-zinc-50 border-zinc-150 text-slate-800 hover:bg-zinc-100"
              }`}
            >
              Có Niacinamide {includes.includes("niacinamide") && "✕"}
            </button>
            <button
              onClick={() => handleQuickFilter("has-vitamin-c")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition duration-200 cursor-pointer ${
                includes.includes("vitamin-c")
                  ? "bg-emerald-800 border-emerald-800 text-white"
                  : "bg-zinc-50 border-zinc-150 text-slate-800 hover:bg-zinc-100"
              }`}
            >
              Vitamin C {includes.includes("vitamin-c") && "✕"}
            </button>

            {(includes.length > 0 || excludes.length > 0 || selectedCategory !== "all" || selectedSkinType !== "all" || selectedConcern !== "") && (
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredProducts.flatMap((product, idx) => {
                const safety = getProductSafety(product.ingredientIds);
                const isAdInsert = (idx + 1) % 5 === 0;
                
                const cardElement = (
                  <Card
                    key={product.id}
                    className="overflow-hidden border border-zinc-100 flex flex-col justify-between shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 rounded-2xl bg-white"
                  >
                    {/* Image Area */}
                    <div className="h-44 md:h-36 bg-zinc-50/50 flex items-center justify-center relative p-3 rounded-t-2xl">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={120}
                        height={120}
                        className="w-full h-full object-contain mix-blend-multiply rounded-xl"
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
                        <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 block">
                          {product.brand}
                        </span>
                        <h4 className="font-bold text-xs leading-snug line-clamp-2 h-8 md:h-9 text-slate-800">
                          {product.name}
                        </h4>
                        
                        {/* Rating stars hiển thị tĩnh dựa trên data */}
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="flex items-center gap-0.5 text-amber-500">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <svg key={s} className={`w-2.5 h-2.5 ${s <= Math.floor(product.rating || 4.5) ? "fill-amber-400 text-amber-400" : "fill-zinc-200 text-zinc-200"}`} viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                              </svg>
                            ))}
                          </span>
                          <span className="text-[9px] text-zinc-400 font-bold">{(product.rating || 4.5).toFixed(1)}</span>
                        </div>

                        <p className="text-[10px] text-zinc-500 line-clamp-2 h-7 md:h-8 leading-relaxed mt-1">
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
                          <div className="flex items-end justify-between">
                            <div className="flex flex-col">
                              <span className="text-[8px] font-bold text-zinc-400 leading-none mb-1">Giá tham khảo</span>
                              <span className="text-xs font-extrabold text-orange-600 leading-none">{product.price || "Liên hệ"}</span>
                            </div>
                            <span className="text-[8px] font-bold text-zinc-400 tracking-wider uppercase">Được tài trợ</span>
                          </div>
                          <ShopeeButton 
                            url={product.shopeeUrl} 
                            text="Săn Deal Shopee"
                            productId={product.id}
                            productName={product.name}
                            subId="filter_list"
                            className="w-full text-xs rounded-full font-bold h-9"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );

                if (isAdInsert) {
                  return [
                    cardElement,
                    <InFeedAdSlot key={`ad-${product.id}`} index={Math.ceil((idx + 1) / 5)} />
                  ];
                }
                return [cardElement];
              })}
            </div>
          ) : (
            <div className="p-12 bg-white border border-zinc-200 rounded-xl text-center text-xs text-zinc-500 shadow-sm">
              Không tìm thấy sản phẩm phù hợp điều kiện lọc. Vui lòng bấm{" "}
              <button onClick={resetFilters} className="text-emerald-800 underline font-bold cursor-pointer">
                xóa tất cả bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductFilterWrapper() {
  const searchParams = useSearchParams();
  const key = `${searchParams.get("skin_type") || ""}-${searchParams.get("concern") || ""}-${searchParams.get("ingredient") || ""}-${searchParams.get("search") || ""}`;

  return (
    <ProductFilterContent key={key} />
  );
}

export default function ProductFilter() {
  return (
    <Suspense fallback={<div className="text-xs text-zinc-400 text-center py-12">Đang tải bộ lọc...</div>}>
      <ProductFilterWrapper />
    </Suspense>
  );
}
