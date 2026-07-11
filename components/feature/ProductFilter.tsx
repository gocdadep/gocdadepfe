"use client";

import { useState, useMemo, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import productsData from "@/data/products.json";
import ingredientsData from "@/data/ingredients.json";
import ShopeeButton from "@/components/affiliate/ShopeeButton";
import { Filter, RotateCcw } from "lucide-react";
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

  // Nạp từ điển hoạt chất để tra cứu nhanh bằng useMemo, tránh render cascading
  const ingredientsDict = useMemo(() => {
    const dict: Record<string, Ingredient> = {};
    (ingredientsData as Ingredient[]).forEach((ing) => {
      dict[ing.id] = ing;
    });
    return dict;
  }, []);

  // 1. Logic Lọc dữ liệu tĩnh
  const filteredProducts = (productsData as Product[]).filter((product) => {
    // Lọc theo từ khóa tìm kiếm (tên hoặc hãng)
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

    return matchesSearch && matchesIncludes && matchesExcludes;
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
  };

  // Presets lọc nhanh
  const applyPreset = (type: "no-alcohol" | "no-paraben" | "has-niacinamide") => {
    resetFilters();
    if (type === "no-alcohol") {
      setExcludes(["alcohol-denat"]);
    } else if (type === "no-paraben") {
      setExcludes(["methylparaben"]);
    } else if (type === "has-niacinamide") {
      setIncludes(["niacinamide"]);
    }
  };

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
        badgeClass: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50", 
        textColor: "text-red-700", 
        barColor: "bg-red-650" 
      };
    }
    if (ingredientIds.every(id => !ingredientsDict[id] || ingredientsDict[id].safetyLevel === "SAFE")) {
      return { 
        label: "An toàn", 
        badgeClass: "bg-green-50 text-green-700 border-green-200 hover:bg-green-50", 
        textColor: "text-green-700", 
        barColor: "bg-green-650" 
      };
    }
    return { 
      label: "Lưu ý", 
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50", 
      textColor: "text-amber-700", 
      barColor: "bg-amber-650" 
    };
  };

  const renderSidebarFilters = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-1.5 text-zinc-900 font-semibold text-sm">
          <Filter className="w-4 h-4" />
          <span>Bộ lọc tìm kiếm</span>
        </div>
        {(includes.length > 0 || excludes.length > 0 || searchQuery !== "") && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="text-xs h-auto p-0 text-zinc-600 hover:bg-transparent hover:text-zinc-900 hover:underline font-bold flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Xóa bộ lọc</span>
          </Button>
        )}
      </div>

      {/* Text Search Input */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-zinc-500 block">Từ khóa sản phẩm:</span>
        <Input
          data-testid="input-product-search"
          type="text"
          className="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-xs placeholder-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-900 focus-visible:border-transparent transition-all"
          placeholder="Tìm tên hoặc thương hiệu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Preset Filters */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-zinc-500 block">Lọc nhanh:</span>
        <div className="flex flex-col gap-1.5">
          <Button
            variant={excludes.includes("alcohol-denat") ? "default" : "secondary"}
            onClick={() => applyPreset("no-alcohol")}
            className="text-xs justify-start h-9 transition font-medium cursor-pointer w-full"
          >
            [Không Cồn]
          </Button>
          <Button
            variant={excludes.includes("methylparaben") ? "default" : "secondary"}
            onClick={() => applyPreset("no-paraben")}
            className="text-xs justify-start h-9 transition font-medium cursor-pointer w-full"
          >
            [Không Paraben]
          </Button>
          <Button
            variant={includes.includes("niacinamide") ? "default" : "secondary"}
            onClick={() => applyPreset("has-niacinamide")}
            className="text-xs justify-start h-9 transition font-medium cursor-pointer w-full"
          >
            [Có Niacinamide]
          </Button>
        </div>
      </div>

      {/* Yêu Cầu Chứa Hoạt Chất */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-zinc-500 block">Yêu cầu chứa chất:</span>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
          {ingredientsData.map((ing) => (
            <label key={ing.id} className="flex items-center gap-2 text-xs font-medium cursor-pointer text-zinc-700">
              <input
                type="checkbox"
                checked={includes.includes(ing.id)}
                onChange={() => toggleInclude(ing.id)}
                className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 w-3.5 h-3.5 cursor-pointer"
              />
              <span>{ing.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tránh Hoạt Chất */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-zinc-500 block">Tránh hoạt chất:</span>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
          {ingredientsData.map((ing) => (
            <label key={ing.id} className="flex items-center gap-2 text-xs font-medium cursor-pointer text-zinc-700">
              <input
                type="checkbox"
                checked={excludes.includes(ing.id)}
                onChange={() => toggleExclude(ing.id)}
                className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 w-3.5 h-3.5 cursor-pointer"
              />
              <span>{ing.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-left selection:bg-zinc-100">
      
      {/* Mobile Drawer Trigger Bar */}
      <div className="flex md:hidden justify-between items-center bg-zinc-50 border border-zinc-200 p-3 rounded-lg">
        <span className="text-xs font-semibold text-zinc-700">Tìm thấy {filteredProducts.length} sản phẩm</span>
        
        <Drawer>
          <DrawerTrigger className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white hover:bg-zinc-50 h-8 text-xs px-3 font-medium gap-1 cursor-pointer">
            <Filter className="w-3.5 h-3.5" />
            <span>Bộ lọc</span>
          </DrawerTrigger>
          <DrawerContent className="p-6">
            <DrawerTitle className="text-left font-bold text-zinc-900">Bộ lọc</DrawerTitle>
            <DrawerDescription className="sr-only">Tùy chọn lọc sản phẩm theo thành phần</DrawerDescription>
            <div className="mt-4 max-h-[80vh] overflow-y-auto pb-8">
              {renderSidebarFilters()}
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Bộ lọc (Desktop) */}
        <div className="hidden md:block md:col-span-1 bg-white border border-zinc-200 p-5 rounded-xl space-y-6 h-fit shadow-sm">
          {renderSidebarFilters()}
        </div>

        {/* Grid Kết quả */}
        <div className="md:col-span-3 space-y-4">
          <div className="hidden md:flex justify-between items-center bg-zinc-50 border border-zinc-200 px-4 py-2.5 rounded-lg text-xs font-semibold text-zinc-700">
            <span>Tìm thấy {filteredProducts.length} sản phẩm phù hợp</span>
            <span className="text-[10px] opacity-75">Cập nhật theo thời gian thực</span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map((product) => {
                const safety = getProductSafety(product.ingredientIds);
                return (
                  <Card
                    key={product.id}
                    className="overflow-hidden border border-zinc-200 flex flex-col justify-between shadow-sm hover:shadow-md transition duration-200"
                  >
                    <div className="h-36 bg-zinc-50 flex items-center justify-center relative p-3">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={120}
                        height={120}
                        className="w-full h-full object-contain mix-blend-multiply"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge variant="outline" className={`${safety.badgeClass}`}>
                          {safety.label}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-4 flex-1 flex flex-col justify-between gap-3 text-left">
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase font-bold tracking-widest text-zinc-400 block">
                          {product.brand}
                        </span>
                        <h4 className="font-bold text-xs leading-snug line-clamp-2 h-8 text-zinc-900">
                          {product.name}
                        </h4>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-1 flex-1 bg-zinc-150 rounded-full overflow-hidden">
                            <div className={`h-full ${safety.barColor} w-[80%]`}></div>
                          </div>
                          <span className={`text-[9px] font-bold ${safety.textColor}`}>{safety.label}</span>
                        </div>

                        <div className="border-t border-zinc-100 pt-2.5 flex items-center justify-between">
                          <span className="text-[9px] font-bold text-zinc-400 tracking-wider">ĐƯỢC TÀI TRỢ</span>
                          <ShopeeButton url={product.shopeeUrl} className="h-7 px-3 text-[10px] rounded-md" />
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
              <Button variant="link" onClick={resetFilters} className="text-zinc-900 font-bold h-auto p-0 cursor-pointer hover:no-underline hover:text-zinc-650">
                Xóa bộ lọc
              </Button>{" "}
              để xem lại danh sách đầy đủ.
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
        <p className="text-sm font-semibold text-zinc-700">Đang tải bộ lọc sản phẩm...</p>
      </div>
    }>
      <ProductFilterContent />
    </Suspense>
  );
}
