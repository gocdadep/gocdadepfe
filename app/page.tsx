"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sparkles, Newspaper, Calculator, Search } from "lucide-react";



export default function LandingPortalPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between transition-colors duration-200">
      <Header />

      <main className="max-w-5xl mx-auto px-6 py-16 flex-1 flex flex-col justify-center space-y-16 w-full text-center">
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-green-50 dark:bg-zinc-900 border border-green-200/50 dark:border-zinc-800 px-4 py-1.5 rounded-full text-xs font-bold text-accent uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Phân tích mỹ phẩm & Tra cứu hoạt chất skincare</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight text-slate-950 dark:text-white">
            Tra cứu thành phần & <br />
            <span className="bg-gradient-to-r from-accent to-green-600 bg-clip-text text-transparent">Phân tích mỹ phẩm chuyên sâu</span> khoa học
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Hỗ trợ tra cứu nhanh độ an toàn hoạt chất mỹ phẩm, đối chiếu phân loại theo loại da và phân tích bảng thành phần tự do hoàn toàn miễn phí.
          </p>
          <div className="pt-4">
            <Link
              href="/phan-tich-thanh-phan"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent hover:bg-green-700 text-white font-bold rounded-2xl shadow-md transition duration-200 hover:scale-[1.02]"
            >
              Phân tích bảng thành phần ngay
            </Link>
          </div>
        </div>

        {/* 3 Pillars Section */}
        <div className="space-y-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-950 dark:text-white">
            Công cụ hỗ trợ skincare khoa học
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full">
            {/* Card 1: Blog */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-accent/20 dark:hover:border-accent/20 transition duration-300 flex flex-col justify-between text-left space-y-4">
              <div className="space-y-2">
                <Newspaper className="w-8 h-8 text-accent shrink-0" />
                 <h3 className="text-lg font-bold text-slate-950 dark:text-white">Cẩm nang & Blog Skincare</h3>
                <p className="text-slate-500 dark:text-zinc-400 text-xs leading-relaxed">
                  Các bài viết phân tích hoạt chất, chia sẻ routine chuẩn khoa học và cẩm nang chăm sóc da hữu ích.
                </p>
              </div>
              <Link
                href="/cam-nang"
                className="w-full text-center py-2.5 bg-slate-900 dark:bg-zinc-850 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
              >
                Đọc cẩm nang &rarr;
              </Link>
            </div>

            {/* Card 2: Calculator */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-accent/20 dark:hover:border-accent/20 transition duration-300 flex flex-col justify-between text-left space-y-4">
              <div className="space-y-2">
                <Calculator className="w-8 h-8 text-accent shrink-0" />
                <h3 className="text-lg font-bold text-slate-950 dark:text-white">Công cụ Phân tích tự do</h3>
                <p className="text-slate-500 dark:text-zinc-400 text-xs leading-relaxed">
                  Dán bảng thành phần mỹ phẩm bất kỳ của bạn để kiểm tra nhanh mức độ an toàn và các hoạt chất kích ứng tiềm ẩn.
                </p>
              </div>
              <Link
                href="/phan-tich-thanh-phan"
                className="w-full text-center py-2.5 bg-accent hover:bg-green-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
              >
                Phân tích ngay &rarr;
              </Link>
            </div>

            {/* Card 3: Finder */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-accent/20 dark:hover:border-accent/20 transition duration-300 flex flex-col justify-between text-left space-y-4">
              <div className="space-y-2">
                <Search className="w-8 h-8 text-accent shrink-0" />
                <h3 className="text-lg font-bold text-slate-950 dark:text-white">Tra cứu sản phẩm</h3>
                <p className="text-slate-500 dark:text-zinc-400 text-xs leading-relaxed">
                  Tìm kiếm thông tin chi tiết của hàng ngàn sản phẩm dưỡng da, kem chống nắng, toner và serum thông dụng.
                </p>
              </div>
              <Link
                href="/danh-muc-san-pham"
                className="w-full text-center py-2.5 bg-slate-900 dark:bg-zinc-850 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
              >
                Tra cứu ngay &rarr;
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
