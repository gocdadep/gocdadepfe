import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ingredientsData from "@/data/ingredients.json";
import { productsData } from "@/lib/products-store";
import { generateStandardATLink, CAMPAIGN_IDS } from "@/lib/affiliate";
import { ShieldCheck, ArrowLeft, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Ingredient {
  id: string;
  name: string;
  aliases?: string[];
  safetyLevel: string;
  functions?: string[];
  skinTypes?: string[];
  warnings?: string | null;
  description: string;
}

export async function generateStaticParams() {
  return ingredientsData.map((ing) => ({
    slug: ing.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const ingredient = (ingredientsData as Ingredient[]).find(
    (i) => i.id === resolvedParams.slug
  );
  return {
    title: `${ingredient?.name || "Hoạt chất"} - Thành phần mỹ phẩm — gocdadep.com`,
    description: `Tra cứu thông tin hoạt chất ${ingredient?.name}. ${ingredient?.description}`,
    alternates: {
      canonical: `https://gocdadep.com/ingredients/${resolvedParams.slug}`,
    },
  };
}

export default async function IngredientDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const ingredientSlug = resolvedParams.slug;
  const ingredient = (ingredientsData as Ingredient[]).find(
    (i) => i.id === ingredientSlug
  );

  if (!ingredient) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-white text-zinc-900">
        <Header />
        <main className="max-w-md mx-auto px-6 py-20 text-center space-y-4 pt-24">
          <h1 className="text-2xl font-bold text-zinc-900">Không tìm thấy hoạt chất</h1>
          <Link
            href="/danh-muc-san-pham"
            className="text-zinc-650 underline font-semibold flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại tra cứu
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Lọc trực tiếp sản phẩm chứa hoạt chất từ productsData
  const matchedProducts = productsData.filter((p) => {
    const nameLower = p.name.toLowerCase();
    const matchesName = nameLower.includes(ingredient.name.toLowerCase());
    const matchesAlias = ingredient.aliases?.some(alias => 
      nameLower.includes(alias.toLowerCase())
    ) || false;
    return matchesName || matchesAlias;
  });

  const enrichedProducts = matchedProducts.map((p) => {
    return {
      id: p.id,
      name: p.name,
      brand: p.brand,
      image: p.image,
      price: p.price || "Liên hệ",
      shopeeUrl: p.rawProductUrl,
      ctaLabel: p.ctaLabel || "Xem chi tiết",
      tags: p.tags || [],
      campaignId: p.source
    };
  }).slice(0, 4);

  const getSafetyStyle = (level: string) => {
    switch (level) {
      case "SAFE":
        return {
          label: "An toàn",
          badgeClass: "bg-green-50 text-green-700 border-green-200 hover:bg-green-50",
        };
      case "CAUTION":
        return {
          label: "Lưu ý",
          badgeClass: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
        };
      case "DANGER":
        return {
          label: "Cảnh báo",
          badgeClass: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50",
        };
      default:
        return {
          label: "Chưa rõ",
          badgeClass: "bg-zinc-100 text-zinc-500 border-zinc-200 hover:bg-zinc-100",
        };
    }
  };

  const safety = getSafetyStyle(ingredient.safetyLevel);

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col justify-between selection:bg-zinc-100">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-12 flex-grow w-full flex flex-col md:flex-row gap-8 pt-24 z-10 text-left">
        {/* Cột trái: Thông tin hoạt chất */}
        <div className="flex-grow md:w-[65%] space-y-6">
          <div className="space-y-4">
            <Link
              href="/danh-muc-san-pham"
              className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 font-semibold transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại danh mục sản phẩm</span>
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
                {ingredient.name}
              </h1>
              <Badge variant="outline" className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${safety.badgeClass}`}>
                Mức độ an toàn: {safety.label}
              </Badge>
            </div>

            {ingredient.aliases && ingredient.aliases.length > 0 && (
              <p className="text-xs text-zinc-500 font-medium">
                Tên gọi khác: {ingredient.aliases.join(", ")}
              </p>
            )}
          </div>

          <Separator className="bg-zinc-200" />

          {/* Chi tiết thông tin */}
          <div className="space-y-4 text-sm md:text-base leading-relaxed text-zinc-700">
            <div>
              <h3 className="font-bold text-zinc-900 mb-1 flex items-center gap-1.5 text-sm uppercase tracking-wider">
                <Info className="w-4 h-4 text-emerald-700" /> Mô tả hoạt chất
              </h3>
              <p>{ingredient.description}</p>
            </div>

            {ingredient.warnings && (
              <div className="bg-red-50/80 border border-red-250 rounded-xl p-4 text-red-800 text-xs md:text-sm">
                <h4 className="font-bold mb-1 uppercase tracking-wider">Lưu ý &amp; Cảnh báo:</h4>
                <p>{ingredient.warnings}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                <h4 className="font-bold text-zinc-900 text-xs uppercase tracking-wider mb-2">Chức năng chính</h4>
                <div className="flex flex-wrap gap-1.5">
                  {ingredient.functions?.map((f) => (
                    <Badge key={f} variant="secondary" className="text-[10px] font-semibold bg-zinc-200/80 text-zinc-800 border-none">
                      {f}
                    </Badge>
                  )) || <span className="text-xs text-zinc-400">Chưa cập nhật</span>}
                </div>
              </div>
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                <h4 className="font-bold text-zinc-900 text-xs uppercase tracking-wider mb-2">Phù hợp loại da</h4>
                <div className="flex flex-wrap gap-1.5">
                  {ingredient.skinTypes?.map((s) => (
                    <Badge key={s} variant="secondary" className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border-none">
                      {s === "all" ? "Mọi loại da" : s === "oily" ? "Da dầu" : s === "acne-prone" ? "Da mụn" : s}
                    </Badge>
                  )) || <span className="text-xs text-zinc-400">Chưa cập nhật</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải: Widget gợi ý sản phẩm affiliate */}
        <aside className="md:w-[35%] space-y-6">
          {enrichedProducts.length > 0 ? (
            <div className="sticky top-24 space-y-6" data-testid="ingredient-affiliate-widget" style={{ minHeight: "320px" }}>
              <Card className="border border-zinc-200 rounded-xl overflow-hidden shadow-sm text-left">
                <CardContent className="p-5 space-y-4">
                  <div className="border-b border-zinc-150 pb-2">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block mb-1">
                      Được tài trợ
                    </span>
                    <h3 className="font-bold text-sm text-zinc-900 leading-snug">
                      Gợi ý dành cho bạn
                    </h3>
                  </div>

                  <div className="space-y-4 divide-y divide-zinc-150">
                    {enrichedProducts.map((product) => {
                      const isTiki = product.shopeeUrl.includes("tiki.vn");
                      const isShopee = product.shopeeUrl.includes("shopee.vn");
                      const campaignId = isTiki ? "tiki" : (product.campaignId || "shopee");
                      const finalUrl = (isTiki || isShopee)
                        ? generateStandardATLink({
                            rawProductUrl: product.shopeeUrl,
                            articleId: `ingredient-${ingredientSlug}`,
                            campaignId: campaignId as keyof typeof CAMPAIGN_IDS
                          })
                        : product.shopeeUrl;
                      const redirectUrl = `/redirect?url=${encodeURIComponent(finalUrl)}`;

                      return (
                        <div key={product.id} className="pt-3 first:pt-0 space-y-3">
                          <div className="flex gap-3 items-start">
                            <div className="w-12 h-12 bg-white rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-zinc-150 relative">
                              <Image
                                src={product.image}
                                alt={product.name}
                                width={40}
                                height={40}
                                className="object-contain mix-blend-multiply"
                              />
                            </div>
                            <div className="space-y-0.5 min-w-0">
                              <span className="text-[9px] uppercase font-bold text-zinc-400 block">
                                {product.brand}
                              </span>
                              <h4 className="text-xs font-semibold text-zinc-900 line-clamp-2 leading-snug">
                                {product.name}
                              </h4>
                              <span className="text-[10px] font-bold text-emerald-700 block">
                                {product.price || "Liên hệ"}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {product.tags.slice(0, 2).map((t) => (
                              <Badge key={t} className="text-[8px] px-1.5 py-0 bg-zinc-100 text-zinc-650 hover:bg-zinc-100 border-none font-medium">
                                #{t}
                              </Badge>
                            ))}
                          </div>

                          <a
                            data-testid="btn-affiliate-cta"
                            href={redirectUrl}
                            target="_blank"
                            rel="nofollow noopener sponsored"
                            className="block w-full text-center py-2 bg-primary hover:bg-emerald-600 text-white text-xs font-bold rounded-full transition-all duration-200"
                          >
                            {product.ctaLabel}
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Disclaimer an toàn */}
              <div className="bg-zinc-50 p-4 rounded-xl space-y-2 text-left border border-zinc-200">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="font-bold text-[10px] text-zinc-900 uppercase tracking-wider">Tuyên bố miễn trừ</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                  Website gocdadep.com cung cấp thông tin dựa trên cơ sở khoa học mở. Tra cứu thành phần mỹ phẩm mang tính chất giáo dục chung. Hãy luôn test thử sản phẩm lên vùng da nhỏ trước khi dùng diện rộng.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: "none" }} />
          )}
        </aside>
      </main>

      <Footer />
    </div>
  );
}
