"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShopeeButton from "@/components/affiliate/ShopeeButton";
import productsData from "@/data/products.json";
import ingredientsData from "@/data/ingredients.json";
import { Search, Sparkles, Biotech, ArrowRight, Verified, Group, ShieldCheck } from "lucide-react";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [textareaInput, setTextareaInput] = useState("");
  const [ingredientsDict, setIngredientsDict] = useState<Record<string, any>>({});

  // Nạp từ điển hoạt chất để tra cứu nhanh
  useEffect(() => {
    const dict: Record<string, any> = {};
    ingredientsData.forEach((ing) => {
      dict[ing.id] = ing;
    });
    setIngredientsDict(dict);
  }, []);

  // Xử lý tìm kiếm sản phẩm (fuzzy search in-memory đơn giản và nhanh)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim() === "") {
        setSearchResults([]);
        return;
      }
      const lowerQuery = searchQuery.toLowerCase();
      const matched = productsData.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.brand.toLowerCase().includes(lowerQuery)
      );
      setSearchResults(matched);
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Hàm tính toán độ an toàn của sản phẩm dựa trên thành phần
  const getProductSafety = (ingredientIds: string[]) => {
    let hasDanger = false;
    let hasCaution = false;
    
    ingredientIds.forEach((id) => {
      const ing = ingredientsDict[id];
      if (ing) {
        if (ing.safetyLevel === "DANGER") hasDanger = true;
        if (ing.safetyLevel === "CAUTION") hasCaution = true;
      }
    });

    if (hasDanger) return { label: "Warning", color: "bg-secondary text-secondary", textColor: "text-[#b62506]", barColor: "bg-[#b62506]" };
    if (isActiveSafety(ingredientIds)) return { label: "Safe", color: "bg-primary text-primary", textColor: "text-[#003820]", barColor: "bg-[#003820]" };
    return { label: "Neutral", color: "bg-[#ecefe9] text-[#191c1a]", textColor: "text-[#404942]", barColor: "bg-[#707971]" };
  };

  const isActiveSafety = (ingredientIds: string[]) => {
    return ingredientIds.every(id => {
      const ing = ingredientsDict[id];
      return !ing || ing.safetyLevel === "SAFE";
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-primary-container/10">
      <Header />

      <main className="flex-grow pt-16 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle Ambient Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#b0f1c7] rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#ffdad3] rounded-full blur-[120px]"></div>
        </div>

        {/* Hero & Search Section */}
        <section className="relative z-10 w-full max-w-5xl mx-auto px-6 py-12 md:py-16 text-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-[#ecefe9] border border-[#c0c9c0] px-4 py-1.5 rounded-full text-xs font-bold text-[#0f5132] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#2d6a48]" />
              <span>Phân tích mỹ phẩm & Tra cứu hoạt chất skincare</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight max-w-4xl mx-auto leading-tight text-primary">
              Tra cứu sản phẩm <br />
              <span className="text-primary-container">minh bạch &amp; khách quan.</span>
            </h1>
            <p className="text-[#404942] text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Kiểm tra tính an toàn của hàng nghìn sản phẩm mỹ phẩm với phân tích chi tiết từ chuyên gia và dữ liệu khoa học.
            </p>
          </div>

          {/* Search Input Container */}
          <div className="relative max-w-lg mx-auto w-full group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#707971]">
              <Search className="w-5 h-5 group-focus-within:text-primary transition-colors" />
            </div>
            <input
              data-testid="input-product-search"
              type="text"
              className="flex h-12 w-full rounded-lg border border-[#c0c9c0] bg-white px-10 py-2 text-sm placeholder-[#707971] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all shadow-sm"
              placeholder="Nhập tên sản phẩm hoặc thương hiệu cần tra cứu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Dropdown Results list */}
            {searchResults.length > 0 && (
              <div className="absolute z-30 top-14 left-0 right-0 bg-white border border-[#c0c9c0] rounded-lg shadow-lg overflow-hidden text-left divide-y divide-[#ecefe9]">
                {searchResults.map((p) => {
                  const safety = getProductSafety(p.ingredientIds);
                  return (
                    <Link
                      key={p.id}
                      href={`/danh-muc-san-pham?search=${encodeURIComponent(p.name)}`}
                      className="flex items-center justify-between p-3.5 hover:bg-[#f2f4ef] transition duration-200"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-[#707971] uppercase tracking-wider block">{p.brand}</span>
                        <h4 className="text-sm font-semibold text-primary">{p.name}</h4>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${safety.color}`}>
                        {safety.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Popular Search tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-[#404942] font-semibold">Phổ biến:</span>
            {["Niacinamide", "Cồn khô", "Methylparaben"].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-3 py-1 rounded-full bg-[#ecefe9] border border-[#c0c9c0] text-primary hover:bg-[#e7e9e4] transition font-medium cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        {/* Free Form Ingredients Analyzer Module */}
        <section className="w-full max-w-5xl mx-auto px-6 py-6 md:py-8 z-10 relative">
          <div className="max-w-lg mx-auto rounded-xl border border-[#c0c9c0] bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary-container" />
              <h3 className="font-semibold text-lg text-primary-container tracking-tight">Phân tích bảng thành phần tự do</h3>
            </div>
            <p className="text-xs text-[#404942] leading-relaxed">
              Dán danh sách hoạt chất ngăn cách bởi dấu phẩy (Water, Niacinamide, Glycerin...) để kiểm tra độc hại nhanh.
            </p>
            <textarea
              data-testid="textarea-ingredients-input"
              className="flex min-h-[120px] w-full rounded-md border border-[#c0c9c0] bg-[#f2f4ef] px-3 py-2 text-sm placeholder-[#707971] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none text-[#191c1a]"
              placeholder="Ví dụ: Water, Glycerin, Phenoxyethanol..."
              value={textareaInput}
              onChange={(e) => setTextareaInput(e.target.value)}
            />
            <Link
              data-testid="btn-analyze-ingredients"
              href={`/phan-tich-thanh-phan?ingredients=${encodeURIComponent(textareaInput)}`}
              className="inline-flex items-center justify-center rounded-md bg-primary text-white hover:opacity-90 h-11 px-8 w-full gap-2 shadow-sm font-semibold text-sm transition duration-200"
            >
              <span>Phân Tích Ngay</span>
            </Link>
          </div>
        </section>

        {/* Trending Products Grid Slider */}
        <section className="w-full max-w-5xl mx-auto px-6 py-12 space-y-6 z-10 relative">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-primary tracking-tight">Sản phẩm Xu hướng</h2>
            <Link
              href="/danh-muc-san-pham"
              className="text-[#0f5132] font-semibold text-sm flex items-center gap-1 hover:underline underline-offset-4"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-none scroll-smooth">
            {productsData.map((p) => {
              const safety = getProductSafety(p.ingredientIds);
              return (
                <div
                  key={p.id}
                  className="min-w-[170px] w-44 flex-shrink-0 rounded-xl border border-[#e5e5e5] bg-white text-card-foreground shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md"
                >
                  <div className="h-40 bg-[#f2f4ef] flex items-center justify-center relative p-4">
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={160}
                      height={160}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                    <div className="absolute top-2 left-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${safety.color}`}>
                        {safety.label}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#707971]">{p.brand}</span>
                      <h3 className="text-xs font-semibold leading-tight line-clamp-2 h-8 text-primary">{p.name}</h3>
                    </div>
                    
                    <div className="space-y-2">
                      {/* Tỷ lệ thanh tiến trình an toàn */}
                      <div className="flex items-center gap-2">
                        <div className="h-1 flex-1 bg-[#e1e3de] rounded-full overflow-hidden">
                          <div className={`h-full ${safety.barColor} w-[80%]`}></div>
                        </div>
                        <span className={`text-[9px] font-bold ${safety.textColor}`}>{safety.label}</span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-1 border-t border-[#ecefe9]">
                        <span className="text-xs font-bold text-primary">Được tài trợ</span>
                        <ShopeeButton url={p.shopeeUrl} className="h-7 px-2.5 rounded-md text-[10px]" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quality Metrics & Social Proof */}
        <section className="w-full max-w-5xl mx-auto px-6 py-6 md:py-12 grid grid-cols-2 md:grid-cols-4 gap-4 z-10 relative">
          <div className="col-span-2 p-8 bg-primary text-white rounded-xl shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-lg md:text-xl font-bold">Chỉ số An toàn Toàn diện</h3>
              <p className="text-xs font-medium opacity-80 leading-relaxed max-w-sm">
                Phân tích dựa trên EWG, CIR và các nghiên cứu khoa học mới nhất từ chuyên gia chăm sóc da.
              </p>
            </div>
            <div className="mt-8 flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-bold tracking-tighter">100%</span>
              <span className="text-xs font-semibold opacity-80 uppercase tracking-widest">Khách quan</span>
            </div>
          </div>
          <div className="rounded-xl border border-[#c0c9c0] bg-white p-6 shadow-sm flex flex-col justify-between">
            <Verified className="w-8 h-8 text-[#fd5837] mb-2" />
            <div>
              <div className="text-2xl font-bold tracking-tight text-primary">12K+</div>
              <div className="text-[11px] font-semibold text-[#404942] uppercase tracking-wider mt-1 opacity-70">Hoạt chất</div>
            </div>
          </div>
          <div className="rounded-xl border border-[#c0c9c0] bg-white p-6 shadow-sm flex flex-col justify-between">
            <Group className="w-8 h-8 text-primary mb-2" />
            <div>
              <div className="text-2xl font-bold tracking-tight text-primary">50K+</div>
              <div className="text-[11px] font-semibold text-[#404942] uppercase tracking-wider mt-1 opacity-70">Người dùng</div>
            </div>
          </div>
        </section>

        {/* Google AdSense Anti-CLS container */}
        <div className="w-full max-w-5xl mx-auto px-6 py-4">
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
