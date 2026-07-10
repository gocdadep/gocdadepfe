"use client";

import { useState } from "react";
import Link from "next/link";
import productsData from "@/data/products.json";
import ingredientsData from "@/data/ingredients.json";

export default function ProductFilter() {
  const [includes, setIncludes] = useState<string[]>([]);
  const [excludes, setExcludes] = useState<string[]>([]);

  // 1. Logic Lọc dữ liệu tĩnh
  const filteredProducts = productsData.filter((product) => {
    const matchesIncludes = includes.every((id) =>
      product.ingredientIds.includes(id)
    );
    const matchesExcludes = !excludes.some((id) =>
      product.ingredientIds.includes(id)
    );
    return matchesIncludes && matchesExcludes;
  });

  const toggleInclude = (id: string) => {
    if (includes.includes(id)) {
      setIncludes(includes.filter((item) => item !== id));
    } else {
      setIncludes([...includes, id]);
      setExcludes(excludes.filter((item) => item !== id)); // Đảm bảo không trùng lập loại trừ
    }
  };

  const toggleExclude = (id: string) => {
    if (excludes.includes(id)) {
      setExcludes(excludes.filter((item) => item !== id));
    } else {
      setExcludes([...excludes, id]);
      setIncludes(includes.filter((item) => item !== id)); // Đảm bảo không trùng lập bắt buộc
    }
  };

  const resetFilters = () => {
    setIncludes([]);
    setExcludes([]);
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

  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
      {/* Sidebar Bộ lọc */}
      <div className="md:col-span-1 bg-card border border-card-border p-4 rounded-2xl space-y-6 h-fit">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Bộ lọc tìm kiếm</h3>
          {(includes.length > 0 || excludes.length > 0) && (
            <button
              onClick={resetFilters}
              className="text-xs text-accent hover:underline font-semibold"
            >
              Xóa tất cả
            </button>
          )}
        </div>

        {/* Preset Filters */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-text-secondary block">Lọc nhanh:</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => applyPreset("no-alcohol")}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition font-semibold"
            >
              Không cồn
            </button>
            <button
              onClick={() => applyPreset("no-paraben")}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition font-semibold"
            >
              Không paraben
            </button>
            <button
              onClick={() => applyPreset("has-niacinamide")}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition font-semibold"
            >
              Có Niacinamide
            </button>
          </div>
        </div>

        {/* Chứa Hoạt Chất */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-text-secondary block">Yêu cầu chứa chất:</span>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {ingredientsData.map((ing) => (
              <label key={ing.id} className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={includes.includes(ing.id)}
                  onChange={() => toggleInclude(ing.id)}
                  className="rounded text-accent focus:ring-accent"
                />
                <span>{ing.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tránh Hoạt Chất */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-text-secondary block">Tránh hoạt chất:</span>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {ingredientsData.map((ing) => (
              <label key={ing.id} className="flex items-center gap-2 text-xs font-medium cursor-pointer text-red-650">
                <input
                  type="checkbox"
                  checked={excludes.includes(ing.id)}
                  onChange={() => toggleExclude(ing.id)}
                  className="rounded text-red-500 focus:ring-red-500"
                />
                <span>{ing.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Kết quả */}
      <div className="md:col-span-3 space-y-4">
        <span className="text-sm text-text-secondary font-semibold">
          Tìm thấy {filteredProducts.length} sản phẩm phù hợp
        </span>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-card border border-card-border p-4 rounded-2xl flex flex-col justify-between space-y-4 hover:shadow-sm transition"
              >
                <div className="space-y-2">
                  <span className="text-xs font-bold text-accent uppercase tracking-wider block">
                    {product.brand}
                  </span>
                  <Link href={`/products/${product.id}`} className="hover:underline">
                    <h4 className="font-bold text-sm text-foreground">{product.name}</h4>
                  </Link>
                  <p className="text-xs text-text-secondary">Nhãn: {product.category}</p>
                </div>

                <div className="border-t border-card-border pt-3 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-text-secondary">GỢI Ý CHO BẠN</span>
                  <Link
                    href={`/redirect?url=${encodeURIComponent(product.shopeeUrl)}`}
                    rel="sponsored nofollow"
                    className="text-xs font-bold text-white bg-accent px-3 py-1.5 rounded-lg hover:bg-green-700 transition"
                  >
                    Shopee Mall
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 bg-card border border-card-border rounded-2xl text-center text-sm text-text-secondary">
            Không tìm thấy sản phẩm phù hợp điều kiện lọc. Vui lòng bấm{" "}
            <button onClick={resetFilters} className="text-accent font-semibold underline">
              Xóa bộ lọc
            </button>{" "}
            để xem lại danh sách đầy đủ.
          </div>
        )}
      </div>
    </div>
  );
}
