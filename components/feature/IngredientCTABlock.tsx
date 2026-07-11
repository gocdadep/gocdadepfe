import Link from "next/link";
import productsData from "@/data/products.json";
import ingredientsData from "@/data/ingredients.json";
import type { Product } from "@/types/product";

interface IngredientCTABlockProps {
  tagIngredientIds: string[];      // tags_ingredients từ blog
  targetSkinTypes?: string[];      // target_skin_types từ blog
}

export default function IngredientCTABlock({
  tagIngredientIds,
  targetSkinTypes = [],
}: IngredientCTABlockProps) {
  // Lấy hoạt chất đầu tiên hợp lệ
  const ingredientId = tagIngredientIds?.[0];
  if (!ingredientId) return null;

  // Tìm tên hiển thị của hoạt chất
  const ingredients = ingredientsData as Array<{ id: string; name: string }>;
  const ingredient = ingredients.find((i) => i.id === ingredientId);
  if (!ingredient) return null;

  // Đếm số sản phẩm match
  const products = productsData as Product[];
  const matchCount = products.filter((p) =>
    p.ingredientIds.includes(ingredientId)
  ).length;

  if (matchCount === 0) return null;

  // Build URL bộ lọc
  const params = new URLSearchParams({ ingredient: ingredientId });
  if (targetSkinTypes?.[0]) params.set("skin_type", targetSkinTypes[0]);
  const filterUrl = `/danh-muc-san-pham?${params.toString()}`;

  return (
    <div className="my-6 p-4 bg-emerald-50 border border-emerald-200/60 rounded-2xl flex items-center justify-between gap-4 min-h-[80px]"
      data-testid="ingredient-cta-block">
      <div className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
          Gợi ý sản phẩm
        </p>
        <p className="text-sm font-semibold text-slate-800 leading-snug">
          Khám phá {matchCount} sản phẩm chứa{" "}
          <span className="text-emerald-700">{ingredient.name}</span>{" "}
          phù hợp với da bạn
        </p>
      </div>
      <Link
        href={filterUrl}
        className="flex-shrink-0 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-full transition-all duration-200 whitespace-nowrap"
      >
        Xem ngay →
      </Link>
    </div>
  );
}
