"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import productsData from "@/data/products.json";
import ingredientsData from "@/data/ingredients.json";
import ShopeeButton from "@/components/affiliate/ShopeeButton";
import { ShieldCheck, Filter, RotateCcw } from "lucide-react";

function ProductFilterContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [includes, setIncludes] = useState<string[]>([]);
  const [excludes, setExcludes] = useState<string[]>([]);
  const [ingredientsDict, setIngredientsDict] = useState<Record<string, any>>({});

  useEffect(() => {
    const dict: Record<string, any> = {};
    ingredientsData.forEach((ing) => {
      dict[ing.id] = ing;
    });
    setIngredientsDict(dict);
  }, []);

  // 1. Logic Lọc dữ liệu tĩnh
  const filteredProducts = productsData.filter((product) => {
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
      if (ing && ing.safetyLevel === "DANGER") {
        hasDanger = true;
      }
    });

    if (hasDanger) return { label: "Warning", color: "bg-secondary text-white", textColor: "text-secondary", barColor: "bg-secondary" };
    return { label: "Safe", color: "bg-primary text-white", textColor: "text-primary", barColor: "bg-primary" };
  };

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-left selection:bg-primary-container/10">
      {/* Sidebar Bộ lọc */}
      <div className="md:col-span-1 bg-white border border-[#c0c9c0] p-5 rounded-xl space-y-6 h-fit shadow-sm">
        <div className="flex items-center justify-between border-b border-[#ecefe9] pb-3">
          <div className="flex items-center gap-1.5 text-primary font-semibold text-sm">
            <Filter className="w-4 h-4" />
            <span>Bộ lọc tìm kiếm</span>
          </div>
          {(includes.length > 0 || excludes.length > 0 || searchQuery !== "") && (
            <button
              onClick={resetFilters}
              className="text-xs text-[#0f5132] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Xóa bộ lọc</span>
            </button>
          )}
        </div>

        {/* Text Search Input */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#404942] block">Từ khóa sản phẩm:</span>
          <input
            data-testid="input-product-search"
            type="text"
            className="flex h-9 w-full rounded-md border border-[#c0c9c0] bg-white px-3 py-1 text-xs placeholder-[#707971] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-transparent transition-all"
            placeholder="Tìm tên hoặc thương hiệu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Preset Filters */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#404942] block">Lọc nhanh:</span>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => applyPreset("no-alcohol")}
              className={`text-xs text-left px-3 py-2 rounded-md transition font-medium cursor-pointer ${
                excludes.includes("alcohol-denat")
                  ? "bg-primary text-white"
                  : "bg-[#f2f4ef] text-primary hover:bg-[#e7e9e4]"
              }`}
            >
              [Không Cồn]
            </button>
            <button
              onClick={() => applyPreset("no-paraben")}
              className={`text-xs text-left px-3 py-2 rounded-md transition font-medium cursor-pointer ${
                excludes.includes("methylparaben")
                  ? "bg-primary text-white"
                  : "bg-[#f2f4ef] text-primary hover:bg-[#e7e9e4]"
              }`}
            >
              [Không Paraben]
            </button>
            <button
              onClick={() => applyPreset("has-niacinamide")}
              className={`text-xs text-left px-3 py-2 rounded-md transition font-medium cursor-pointer ${
                includes.includes("niacinamide")
                  ? "bg-primary text-white"
                  : "bg-[#f2f4ef] text-primary hover:bg-[#e7e9e4]"
              }`}
            >
              [Có Niacinamide]
            </button>
          </div>
        </div>

        {/* Yêu Cầu Chứa Hoạt Chất */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#404942] block">Yêu cầu chứa chất:</span>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {ingredientsData.map((ing) => (
              <label key={ing.id} className="flex items-center gap-2 text-xs font-medium cursor-pointer text-primary">
                <input
                  type="checkbox"
                  checked={includes.includes(ing.id)}
                  onChange={() => toggleInclude(ing.id)}
                  className="rounded border-[#c0c9c0] text-primary focus:ring-primary w-3.5 h-3.5"
                />
                <span>{ing.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tránh Hoạt Chất */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#404942] block">Tránh hoạt chất:</span>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {ingredientsData.map((ing) => (
              <label key={ing.id} className="flex items-center gap-2 text-xs font-medium cursor-pointer text-secondary">
                <input
                  type="checkbox"
                  checked={excludes.includes(ing.id)}
                  onChange={() => toggleExclude(ing.id)}
                  className="rounded border-[#c0c9c0] text-secondary focus:ring-secondary w-3.5 h-3.5"
                />
                <span>{ing.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Kết quả */}
      <div className="md:col-span-3 space-y-4">
        <div className="flex justify-between items-center bg-[#ecefe9] border border-[#c0c9c0] px-4 py-2.5 rounded-lg text-xs font-semibold text-primary">
          <span>Tìm thấy {filteredProducts.length} sản phẩm phù hợp</span>
          <span className="text-[10px] opacity-75">Cập nhật theo thời gian thực</span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProducts.map((product) => {
              const safety = getProductSafety(product.ingredientIds);
              return (
                <div
                  key={product.id}
                  className="bg-white border border-[#e5e5e5] rounded-xl flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md transition duration-200"
                >
                  <div className="h-36 bg-[#f2f4ef] flex items-center justify-center relative p-3">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={120}
                      height={120}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                    <div className="absolute top-2 left-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${safety.color}`}>
                        {safety.label}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col justify-between gap-3 text-left">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-[#707971] block">
                        {product.brand}
                      </span>
                      <h4 className="font-bold text-xs leading-snug line-clamp-2 h-8 text-primary">
                        {product.name}
                      </h4>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-1 flex-1 bg-[#e1e3de] rounded-full overflow-hidden">
                          <div className={`h-full ${safety.barColor} w-[80%]`}></div>
                        </div>
                        <span className={`text-[9px] font-bold ${safety.textColor}`}>{safety.label}</span>
                      </div>

                      <div className="border-t border-[#ecefe9] pt-2.5 flex items-center justify-between">
                        <span className="text-[9px] font-bold text-[#404942] tracking-wider">ĐƯỢC TÀI TRỢ</span>
                        <ShopeeButton url={product.shopeeUrl} className="h-7 px-3 text-[10px] rounded-md" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 bg-white border border-[#c0c9c0] rounded-xl text-center text-xs text-[#404942] shadow-sm">
            Không tìm thấy sản phẩm phù hợp điều kiện lọc. Vui lòng bấm{" "}
            <button onClick={resetFilters} className="text-[#0f5132] font-bold underline cursor-pointer">
              Xóa bộ lọc
            </button>{" "}
            để xem lại danh sách đầy đủ.
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductFilter() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-sm font-semibold text-primary">Đang tải bộ lọc sản phẩm...</p>
      </div>
    }>
      <ProductFilterContent />
    </Suspense>
  );
}
