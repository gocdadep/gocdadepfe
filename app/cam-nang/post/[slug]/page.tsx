import { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { marked } from "marked";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import blogsData from "@/data/blogs.json";
import { productsData } from "@/lib/products-store";
import AffiliateButton from "@/components/affiliate/AffiliateButton";
import { CAMPAIGN_IDS } from "@/lib/affiliate";
import IngredientCTABlock from "@/components/feature/IngredientCTABlock";
import BottomAnchorAd from "@/components/ads/BottomAnchorAd";
import { FEATURE_FLAGS } from "@/lib/config/features";
import { BookOpen, Calendar, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import type { Blog } from "@/types/product";

export async function generateStaticParams() {
  return blogsData.map((b) => ({
    slug: b.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const blog = blogsData.find((b) => b.slug === resolvedParams.slug);
  return {
    title: `${blog?.title || "Bài viết cẩm nang"} — gocdadep.com`,
    description: blog?.metaDescription || "Cẩm nang và chia sẻ kiến thức skincare khoa học.",
    alternates: {
      canonical: `https://gocdadep.com/cam-nang/post/${resolvedParams.slug}`,
    },
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const blog = (blogsData as Blog[]).find((b) => b.slug === resolvedParams.slug);

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-white text-zinc-900">
        <Header />
        <main className="max-w-md mx-auto px-6 py-20 text-center space-y-4 pt-24">
          <h1 className="text-2xl font-bold text-zinc-900">Không tìm thấy bài viết</h1>
          <Link href="/cam-nang" className="text-zinc-650 underline font-semibold flex items-center justify-center gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Quay lại cẩm nang
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Lấy các sản phẩm liên quan từ relatedProductIds từ productsData của store
  const relatedProducts = (blog.relatedProductIds || []).map((id) => {
    const prod = productsData.find((p) => p.id === id || p.slug === id || p.id === `tiki-${id}`);
    if (!prod) return null;
    return {
      id: prod.id,
      name: prod.name,
      brand: prod.brand,
      image: prod.image,
      price: prod.price || "Liên hệ",
      shopeeUrl: prod.rawProductUrl,
      rawShopeeUrl: prod.rawProductUrl,
      campaignId: prod.source as keyof typeof CAMPAIGN_IDS,
      ctaLabel: prod.ctaLabel || "Xem chi tiết",
    };
  }).filter((p): p is NonNullable<typeof p> => p !== null);

  // Build URL bộ lọc từ concerns và skin_types của blog
  const buildFilterUrl = () => {
    const params = new URLSearchParams();
    if (blog.concerns?.[0]) params.set("concern", blog.concerns[0]);
    if (blog.target_skin_types?.[0]) params.set("skin_type", blog.target_skin_types[0]);
    return `/danh-muc-san-pham?${params.toString()}`;
  };

  const filterUrl = buildFilterUrl();
  const processedContent = blog.contentMd.replace(/\[(👉[^\]]+)\](?!\()/g, `[$1](${filterUrl})`);

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col justify-between selection:bg-zinc-100">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-12 flex-grow w-full flex flex-col md:flex-row gap-12 pt-24 z-10 relative">
        
        {/* Cột trái: Nội dung bài viết */}
        <article className="flex-grow md:w-[65%] max-w-[720px] space-y-6 text-left w-full">
          <div className="space-y-4">
            <Link href="/cam-nang" className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 font-semibold transition">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại cẩm nang</span>
            </Link>
            
            <div className="flex flex-wrap gap-1.5">
              {blog.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[9px] font-bold uppercase tracking-wider bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-none">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-zinc-900 leading-tight">
              {blog.title}
            </h1>

            <div className="flex items-center gap-1 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              <span>Đăng ngày {new Date(blog.publishedAt).toLocaleDateString("vi-VN")}</span>
            </div>
          </div>

          <Separator className="bg-zinc-200" />

          {/* Typography sạch sẽ tối ưu cho đọc tin tức */}
          <div className="prose prose-zinc max-w-none text-zinc-700 leading-relaxed font-normal text-base md:text-lg space-y-4">
            <p className="font-semibold text-zinc-900">{blog.metaDescription}</p>
            {/* Split Markdown đơn giản để render thô */}
            {processedContent.split("\n\n").map((para, i) => {
              const elements = [];
              const htmlContent = marked.parse(para) as string;
              elements.push(
                <div 
                  key={i} 
                  dangerouslySetInnerHTML={{ __html: htmlContent }} 
                  className="markdown-block"
                />
              );

              // US-005: Chèn inline banner gợi ý dẹt sau đoạn văn thứ 3 (index 2)
              if (i === 2) {
                elements.push(
                  <div key="inline-gift-banner" className="my-6 overflow-hidden border border-emerald-100 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 rounded-2xl p-5 text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider block">GỢI Ý DÀNH CHO BẠN</span>
                      <h4 className="font-bold text-xs md:text-sm text-zinc-900 leading-snug">Nhận miễn phí cẩm nang Routine mụn và voucher Shopee 50k!</h4>
                    </div>
                    <Link href={buildFilterUrl()} className="inline-block text-center px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-bold rounded-full transition shrink-0 cursor-pointer">
                      Khám phá sản phẩm phù hợp →
                    </Link>
                  </div>
                );
              }

              // US-004: Tự động chèn khối gợi ý IngredientCTABlock sau đoạn văn thứ 4 (hoặc index 3)
              if (i === 3 && blog.tags_ingredients && blog.tags_ingredients.length > 0) {
                elements.push(
                  <IngredientCTABlock 
                    key={`cta-${i}`}
                    tagIngredientIds={blog.tags_ingredients}
                    targetSkinTypes={blog.target_skin_types}
                  />
                );
              }
              return <Fragment key={i}>{elements}</Fragment>;
            })}
          </div>

          {/* Mobile Only: Section "Sản phẩm liên quan" ở cuối bài viết */}
          {relatedProducts.length > 0 && (
            <section className="md:hidden mt-10 space-y-4 border-t border-zinc-100 pt-6">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                Gợi ý dành cho bạn
              </span>
              <div className="flex gap-3 overflow-x-auto scrollbar-none pb-3 -mx-6 px-6">
                {relatedProducts.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex flex-col justify-between w-[200px] shrink-0 p-3 bg-zinc-50/50 border border-zinc-150 rounded-xl gap-3">
                    <div className="flex gap-2.5 items-center">
                      <div className="w-10 h-10 bg-white rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-zinc-150">
                        <Image src={product.image} alt={product.name} width={35} height={35} className="object-contain mix-blend-multiply" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[8px] uppercase font-bold text-zinc-400 block">{product.brand}</span>
                        <h4 className="text-[10px] font-bold text-zinc-900 truncate leading-snug">{product.name}</h4>
                        <span className="text-[10px] font-extrabold text-orange-600 block mt-0.5">{product.price || "Liên hệ"}</span>
                      </div>
                    </div>
                    <AffiliateButton 
                      rawProductUrl={product.rawShopeeUrl} 
                      campaignId={product.campaignId}
                      productName={product.name}
                      articleId={blog.slug}
                      ingredientTag={blog.tags_ingredients?.[0] || "general"}
                      hideLabel={true}
                      className="h-8 w-full text-[10px]" 
                    />
                  </div>
                ))}
              </div>
              <Link
                href={buildFilterUrl()}
                className="block w-full text-center py-2.5 border border-emerald-500 text-emerald-650 hover:bg-emerald-50/50 font-bold text-xs rounded-full transition"
              >
                Xem thêm sản phẩm liên quan →
              </Link>
            </section>
          )}
        </article>

        {/* Cột phải: Sidebar AdSense + Gợi ý Shopee */}
        <aside className="hidden md:block md:w-[35%] space-y-6">
          <div className="sticky top-24 space-y-6">
            
            {/* Box AdSense / Affiliate Placeholder */}
            {FEATURE_FLAGS.ENABLE_ADSENSE && (
              <div className="ad-container ad-sidebar min-h-[250px] w-full flex items-center justify-center border border-zinc-250 rounded-xl bg-zinc-50 p-4">
                <ins className="adsbygoogle"
                     style={{ display: "block" }}
                     data-ad-client="ca-pub-xxx"
                     data-ad-slot="xxx"
                     data-ad-format="rectangle"></ins>
              </div>
            )}

            {/* Hộp sản phẩm liên quan (Desktop Only) */}
            {relatedProducts.length > 0 && (
              <Card className="border border-zinc-150 bg-zinc-50/50 shadow-none text-left rounded-xl">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between text-zinc-900 font-bold text-xs uppercase tracking-wider border-b border-zinc-150 pb-2">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-emerald-700" />
                      <span>Sản phẩm liên quan</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4 divide-y divide-zinc-150">
                    {relatedProducts.map((product) => (
                      <div key={product.id} className="pt-3 first:pt-0 space-y-2.5">
                        <div className="flex gap-3 items-start">
                          <div className="w-12 h-12 bg-white rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-zinc-150">
                            <Image src={product.image} alt={product.name} width={40} height={40} className="object-contain mix-blend-multiply" />
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[9px] uppercase font-bold text-zinc-400 block">{product.brand}</span>
                            <h4 className="text-xs font-semibold text-zinc-900 line-clamp-2 leading-snug">{product.name}</h4>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wide">Được tài trợ</span>
                          <AffiliateButton 
                            rawProductUrl={product.rawShopeeUrl} 
                            campaignId={product.campaignId}
                            productName={product.name}
                            articleId={blog.slug}
                            ingredientTag={blog.tags_ingredients?.[0] || "general"}
                            hideLabel={true}
                            className="h-7 px-3 text-[10px]" 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link
                    href={buildFilterUrl()}
                    className="block text-center text-xs text-emerald-700 font-bold hover:underline pt-2 border-t border-zinc-150 cursor-pointer"
                  >
                    Xem tất cả sản phẩm →
                  </Link>
                </CardContent>
              </Card>
            )}
            
          </div>
        </aside>
      </main>

      <Footer />
      <BottomAnchorAd 
        contextSlug={blog.slug} 
        contextConcern={blog.concerns?.[0]} 
      />
    </div>
  );
}
