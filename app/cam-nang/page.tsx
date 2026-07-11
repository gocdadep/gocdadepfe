import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import blogsData from "@/data/blogs.json";
import { BookOpen, Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BLOG_CATEGORIES } from "@/types/product";
import type { Blog } from "@/types/product";

export const metadata: Metadata = {
  title: "Cẩm nang & Tin tức Skincare khoa học — gocdadep.com",
  description: "Tổng hợp các bài viết phân tích hoạt chất, chia sẻ kiến thức routine và cẩm nang chăm sóc da chuẩn khoa học.",
};

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function BlogListPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const activeCategory = resolvedParams.category || "all";

  const filteredBlogs = (blogsData as Blog[]).filter(
    (blog) => activeCategory === "all" || blog.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col justify-between selection:bg-zinc-100">
      <Header />
      
      <main className="max-w-5xl mx-auto px-6 py-12 flex-1 w-full space-y-12 pt-24 z-10 relative">
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 px-4 py-1.5 rounded-full text-xs font-bold text-zinc-700 uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 shrink-0 text-zinc-655" />
            <span>Kiến thức skincare khoa học</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900">
            Cẩm nang &amp; Blog Skincare
          </h1>
          <p className="text-sm md:text-base text-zinc-500 leading-relaxed font-medium">
            Chia sẻ chuyên sâu về hoạt chất dưỡng da, xây dựng routine chuẩn khoa học và tối giản từ chuyên gia độc lập.
          </p>
        </div>

        {/* Category Filter Tab Links (RSC Friendly) */}
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-zinc-100 pb-6">
          {BLOG_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.id === "all" ? "/cam-nang" : `/cam-nang?category=${cat.id}`}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-150 border ${
                activeCategory === cat.id
                  ? "bg-emerald-800 border-emerald-800 text-white shadow-sm"
                  : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        {/* Lưới bài viết (Grid) */}
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBlogs.map((blog) => (
              <Card
                key={blog.slug}
                className="border border-zinc-200 rounded-xl flex flex-col justify-between hover:shadow-md hover:border-zinc-300 transition-all duration-200 text-left"
              >
                <CardHeader className="p-6 pb-0 space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {blog.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-[9px] px-2.5 py-0.5 font-bold uppercase tracking-wider bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-none"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Link tiêu đề */}
                  <Link
                    href={`/cam-nang/post/${blog.slug}`}
                    className="hover:text-zinc-700 transition-colors block"
                  >
                    <h3 className="text-lg font-bold text-zinc-900 leading-snug">
                      {blog.title}
                    </h3>
                  </Link>
                </CardHeader>

                <CardContent className="p-6 pt-2 pb-4">
                  <p className="text-xs text-zinc-550 leading-relaxed">
                    {blog.metaDescription}
                  </p>
                </CardContent>
                
                <CardFooter className="p-6 pt-0 flex flex-col items-stretch gap-4">
                  <Separator className="bg-zinc-100" />
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>{new Date(blog.publishedAt).toLocaleDateString("vi-VN")}</span>
                    </div>
                    <Link
                      href={`/cam-nang/post/${blog.slug}`}
                      className="text-zinc-800 hover:text-zinc-900 hover:underline flex items-center gap-0.5 font-bold cursor-pointer"
                    >
                      <span>Đọc tiếp</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-xs text-zinc-500 py-12">
            Không tìm thấy bài viết nào phù hợp danh mục này.
          </div>
        )}

        {/* Khung quảng cáo AdSense chống CLS */}
        <div className="pt-4">
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
