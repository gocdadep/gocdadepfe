import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import blogsData from "@/data/blogs.json";
import AdSlot from "@/components/ads/AdSlot";
import { BookOpen, Calendar, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Cẩm nang & Tin tức Skincare khoa học — gocdadep.com",
  description: "Tổng hợp các bài viết phân tích hoạt chất, chia sẻ kiến thức routine và cẩm nang chăm sóc da chuẩn khoa học.",
};

export default function BlogListPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-primary-container/10">
      <Header />
      
      <main className="max-w-5xl mx-auto px-6 py-12 flex-1 w-full space-y-12 pt-24 z-10 relative">
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-[#ecefe9] border border-[#c0c9c0] px-4 py-1.5 rounded-full text-xs font-bold text-[#0f5132] uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span>Kiến thức skincare khoa học</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-primary">
            Cẩm nang &amp; Blog Skincare
          </h1>
          <p className="text-sm md:text-base text-[#404942] leading-relaxed font-medium">
            Chia sẻ chuyên sâu về hoạt chất dưỡng da, xây dựng routine chuẩn khoa học và tối giản từ chuyên gia độc lập.
          </p>
        </div>

        {/* Lưới bài viết (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogsData.map((blog) => (
            <div
              key={blog.slug}
              className="bg-white border border-[#e5e5e5] p-6 rounded-xl flex flex-col justify-between gap-5 hover:shadow-md hover:border-primary/20 transition-all duration-200 text-left"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] bg-[#f2f4ef] text-primary-container px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Link tiêu đề */}
                <Link
                  href={`/cam-nang/post/${blog.slug}`}
                  className="hover:text-primary transition-colors block"
                >
                  <h3 className="text-lg font-bold text-primary leading-snug">
                    {blog.title}
                  </h3>
                </Link>
                
                <p className="text-xs text-[#404942] leading-relaxed">
                  {blog.metaDescription}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-[#ecefe9] pt-4 text-[10px] text-[#707971] font-bold uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>{new Date(blog.publishedAt).toLocaleDateString("vi-VN")}</span>
                </div>
                <Link
                  href={`/cam-nang/post/${blog.slug}`}
                  className="text-primary hover:underline flex items-center gap-0.5 font-bold cursor-pointer"
                >
                  <span>Đọc tiếp</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Khung quảng cáo AdSense chống CLS */}
        <div className="pt-4">
          <div className="ad-container ad-h-banner min-h-[250px] w-full flex items-center justify-center border border-[#e5e5e5] rounded-xl bg-white">
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
