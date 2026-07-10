import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import blogsData from "@/data/blogs.json";

export const metadata: Metadata = {
  title: "Cẩm nang & Tin tức Skincare khoa học — gocdadep.com",
  description: "Tổng hợp các bài viết phân tích hoạt chất, chia sẻ kiến thức routine và cẩm nang chăm sóc da chuẩn khoa học.",
};

export default function BlogListPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white">
            Cẩm nang & Blog Skincare
          </h1>
          <p className="text-sm text-text-secondary max-w-lg mx-auto">
            Kiến thức chăm sóc da, phân tích hoạt chất chuyên sâu từ chuyên gia khoa học.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogsData.map((blog) => (
            <div
              key={blog.slug}
              className="bg-card border border-card-border p-6 rounded-2xl flex flex-col justify-between space-y-4 hover:shadow-sm transition text-left"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <span key={tag} className="text-[10px] bg-slate-100 dark:bg-zinc-800 text-text-secondary px-2 py-0.5 rounded-full font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link href={`/blog/post/${blog.slug}`} className="hover:underline">
                  <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                    {blog.title}
                  </h3>
                </Link>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {blog.metaDescription}
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-card-border pt-4 text-[10px] text-text-secondary font-semibold">
                <span>{new Date(blog.publishedAt).toLocaleDateString("vi-VN")}</span>
                <Link href={`/blog/post/${blog.slug}`} className="text-accent hover:underline">
                  Đọc tiếp &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
