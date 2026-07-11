import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import blogsData from "@/data/blogs.json";
import AdSlot from "@/components/ads/AdSlot";

export const metadata: Metadata = {
  title: "Cẩm nang & Tin tức Skincare khoa học — gocdadep.com",
  description: "Tổng hợp các bài viết phân tích hoạt chất, chia sẻ kiến thức routine và cẩm nang chăm sóc da chuẩn khoa học.",
};

export default function BlogListPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-16 flex-1 w-full space-y-12 pt-24">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Cẩm nang & Blog Skincare
          </h1>
          <p className="text-base text-slate-500 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Kiến thức chăm sóc da chuyên sâu, phân tích hoạt chất lành tính từ chuyên gia da liễu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogsData.map((blog) => (
            <div
              key={blog.slug}
              className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 p-8 rounded-2xl flex flex-col justify-between space-y-6 hover:shadow-md hover:border-accent/10 transition-all duration-300 text-left"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <span key={tag} className="text-[10px] bg-slate-50 dark:bg-zinc-800/50 text-accent px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link href={`/cam-nang/post/${blog.slug}`} className="hover:text-accent transition-colors block">
                  <h3 className="text-xl font-bold text-slate-950 dark:text-white leading-snug">
                    {blog.title}
                  </h3>
                </Link>
                <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed font-normal">
                  {blog.metaDescription}
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-zinc-800/60 pt-4 text-xs text-slate-400 dark:text-zinc-500 font-semibold">
                <span>{new Date(blog.publishedAt).toLocaleDateString("vi-VN")}</span>
                <Link href={`/cam-nang/post/${blog.slug}`} className="text-accent hover:underline flex items-center gap-1 font-bold">
                  Đọc tiếp &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Chèn AdSlot quảng cáo chống CLS */}
        <AdSlot />
      </main>
      <Footer />
    </div>
  );
}
