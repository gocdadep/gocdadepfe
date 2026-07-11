"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import productsData from "@/data/products.json";

import { Product } from "@/types/product";

export default function ProductSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      // Lazy load Fuse.js để giảm bundle size của trang ban đầu
      import("fuse.js").then(({ default: Fuse }) => {
        const fuse = new Fuse(productsData, {
          keys: ["name", "brand"],
          threshold: 0.4,
        });
        const matched = fuse.search(query).map((r) => r.item);
        setResults(matched);
      });
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const displayedResults = query.trim() ? results : [];

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <div className="relative">
        <input
          data-testid="input-product-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nhập tên sản phẩm hoặc hãng mỹ phẩm..."
          className="w-full px-4 py-3 rounded-2xl border border-card-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition"
        />
      </div>

      {displayedResults.length > 0 && (
        <div className="bg-card border border-card-border rounded-2xl overflow-hidden shadow-lg max-h-96 overflow-y-auto divide-y divide-card-border">
          {displayedResults.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="flex items-center gap-4 p-4 hover:bg-background transition group text-left"
            >
              <div className="flex-1">
                <span className="text-xs font-bold text-accent uppercase tracking-wider block">
                  {product.brand}
                </span>
                <h4 className="text-sm font-semibold text-foreground group-hover:text-accent transition">
                  {product.name}
                </h4>
              </div>
              <span className="text-xs text-text-secondary bg-background px-2.5 py-1 rounded-full capitalize">
                {product.category}
              </span>
            </Link>
          ))}
        </div>
      )}

      {query.trim() && displayedResults.length === 0 && (
        <div className="p-6 bg-card border border-card-border rounded-2xl text-center text-sm text-text-secondary">
          Không tìm thấy sản phẩm. Bạn có thể thử dùng{" "}
          <Link href="/analyzer" className="text-accent font-semibold underline">
            Công cụ phân tích bảng thành phần tự do
          </Link>
        </div>
      )}
    </div>
  );
}
