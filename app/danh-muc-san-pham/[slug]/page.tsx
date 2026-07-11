import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import productsData from "@/data/products.json";
import ingredientsData from "@/data/ingredients.json";
import ShopeeButton from "@/components/affiliate/ShopeeButton";
import StickyShopeeCTA from "@/components/affiliate/StickyShopeeCTA";

export async function generateStaticParams() {
  return productsData.map((p) => ({
    slug: p.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const product = productsData.find((p) => p.id === resolvedParams.slug);
  return {
    title: `${product?.name || "Chi tiết sản phẩm"} — gocdadep.com`,
    description: `Bảng thành phần phân tích chi tiết của ${product?.name} từ hãng ${product?.brand}.`,
    alternates: {
      canonical: `https://gocdadep.com/danh-muc-san-pham/${resolvedParams.slug}`,
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = productsData.find((p) => p.id === resolvedParams.slug);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-background">
        <Header />
        <main className="max-w-md mx-auto px-6 py-20 text-center space-y-4 pt-24">
          <h1 className="font-display text-headline-lg text-accent">Không tìm thấy sản phẩm</h1>
          <Link href="/danh-muc-san-pham" className="text-accent underline font-semibold">
            Quay lại tra cứu
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Map hoạt chất
  const ingredients = product.ingredientIds.map((id) => {
    const detail = ingredientsData.find((ing) => ing.id === id);
    return detail || { id, name: id, safetyLevel: "UNKNOWN", description: "Chưa có dữ liệu chi tiết cho chất này." };
  });

  // Tính toán số liệu thống kê (%)
  const total = ingredients.length;
  const safe = ingredients.filter((ing) => ing.safetyLevel === "SAFE").length;
  const caution = ingredients.filter((ing) => ing.safetyLevel === "CAUTION").length;
  const danger = ingredients.filter((ing) => ing.safetyLevel === "DANGER").length;

  const safePercent = total > 0 ? Math.round((safe / total) * 100) : 0;
  const cautionPercent = total > 0 ? Math.round((caution / total) * 100) : 0;
  const dangerPercent = total > 0 ? Math.round((danger / total) * 100) : 0;

  // AI Summary Logic tĩnh
  const hasDanger = danger > 0;
  const aiSummary = hasDanger
    ? `Sản phẩm này chứa một số thành phần cần lưu ý. Kết luận: Cân nhắc kỹ trước khi dùng cho da nhạy cảm hoặc da đang kích ứng.`
    : `Sản phẩm sở hữu bảng thành phần an toàn ổn định. Kết luận: Phù hợp sử dụng hàng ngày cho hầu hết các loại da thông thường.`;

  // Check Cảnh báo
  const warnings: string[] = [];
  const hasAlcohol = product.ingredientIds.some((id) => id.includes("alcohol"));
  const hasParaben = product.ingredientIds.some((id) => id.includes("paraben"));
  if (hasAlcohol) {
    warnings.push("Phát hiện thành phần Cồn khô (Alcohol): Có thể gây khô da hoặc châm chích đối với làn da mỏng yếu.");
  }
  if (hasParaben) {
    warnings.push("Phát hiện thành phần Paraben: Chất bảo quản nhóm Paraben, có thể gây quá mẫn đối với da đặc biệt nhạy cảm.");
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": `https://gocdadep.com${product.image || "/favicon-cropped.png"}`,
    "description": `Bảng thành phần phân tích chi tiết của ${product.name} từ hãng ${product.brand}.`,
    "brand": {
      "@type": "Brand",
      "name": product.brand,
    },
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col justify-between transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      
      <main className="max-w-max-width mx-auto px-gutter py-xl flex-grow w-full flex flex-col md:flex-row gap-lg pt-24 z-10">
        {/* Main Analysis Content */}
        <div className="flex-grow md:w-[70%] space-y-md">
          {/* AI Summary Banner */}
          <section className="bg-primary-container/5 rounded-xl p-md border border-outline-variant flex items-start gap-md">
            <div className="bg-primary-container/10 p-sm rounded-lg text-accent shrink-0">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                smart_toy
              </span>
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-accent mb-xs">Tóm tắt AI: An toàn &amp; Hiệu quả</h2>
              <p className="text-on-surface-variant font-body-md leading-relaxed">
                {aiSummary}
              </p>
            </div>
          </section>

          {/* Danger Warning Banner */}
          {warnings.length > 0 && (
            <div className="space-y-xs">
              {warnings.map((warn, index) => (
                <section key={index} className="bg-error-container text-error p-md rounded-lg flex items-center gap-md border border-outline-variant">
                  <span className="material-symbols-outlined shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                    warning
                  </span>
                  <p className="font-label-md text-label-md">
                    <span className="font-bold uppercase">Cảnh báo: </span>{warn}
                  </p>
                </section>
              ))}
            </div>
          )}

          {/* Health Score Section */}
          <div className="grid grid-cols-3 gap-md">
            {/* Safe Circle */}
            <div className="bg-white p-md rounded-xl border border-outline-variant flex flex-col items-center justify-center text-center shadow-sm">
              <div className="relative w-20 h-20 flex items-center justify-center mb-xs">
                <svg className="absolute inset-0 transform -rotate-90 w-20 h-20">
                  <circle className="text-surface-container-high" cx="40" cy="40" fill="transparent" r="36" stroke="currentColor" strokeWidth="6"></circle>
                  <circle className="text-success-text transition-all duration-1000" cx="40" cy="40" fill="transparent" r="36" stroke="currentColor" strokeDasharray="226" strokeDashoffset={226 - (226 * safePercent) / 100} strokeWidth="6"></circle>
                </svg>
                <span className="font-headline-lg text-headline-lg text-on-surface">{safePercent}%</span>
              </div>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-success-text">An toàn</span>
            </div>
            {/* Warning Circle */}
            <div className="bg-white p-md rounded-xl border border-outline-variant flex flex-col items-center justify-center text-center shadow-sm">
              <div className="relative w-20 h-20 flex items-center justify-center mb-xs">
                <svg className="absolute inset-0 transform -rotate-90 w-20 h-20">
                  <circle className="text-surface-container-high" cx="40" cy="40" fill="transparent" r="36" stroke="currentColor" strokeWidth="6"></circle>
                  <circle className="text-tertiary transition-all duration-1000" cx="40" cy="40" fill="transparent" r="36" stroke="currentColor" strokeDasharray="226" strokeDashoffset={226 - (226 * cautionPercent) / 100} strokeWidth="6"></circle>
                </svg>
                <span className="font-headline-lg text-headline-lg text-on-surface">{cautionPercent}%</span>
              </div>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-tertiary">Lưu ý</span>
            </div>
            {/* Danger Circle */}
            <div className="bg-white p-md rounded-xl border border-outline-variant flex flex-col items-center justify-center text-center shadow-sm">
              <div className="relative w-20 h-20 flex items-center justify-center mb-xs">
                <svg className="absolute inset-0 transform -rotate-90 w-20 h-20">
                  <circle className="text-surface-container-high" cx="40" cy="40" fill="transparent" r="36" stroke="currentColor" strokeWidth="6"></circle>
                  <circle className="text-error transition-all duration-1000" cx="40" cy="40" fill="transparent" r="36" stroke="currentColor" strokeDasharray="226" strokeDashoffset={226 - (226 * dangerPercent) / 100} strokeWidth="6"></circle>
                </svg>
                <span className="font-headline-lg text-headline-lg text-on-surface">{dangerPercent}%</span>
              </div>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-error">Nguy hiểm</span>
            </div>
          </div>

          {/* Ingredient Grid */}
          <section className="space-y-sm">
            <h3 className="font-headline-lg text-headline-lg text-accent">Danh sách thành phần ({total})</h3>
            <div className="grid grid-cols-1 gap-xs">
              {ingredients.map((ing, index) => {
                let badgeClass = "bg-surface-container text-on-surface-variant";
                if (ing.safetyLevel === "SAFE") badgeClass = "bg-success-bg text-success-text";
                else if (ing.safetyLevel === "CAUTION") badgeClass = "bg-tertiary-fixed text-tertiary";
                else if (ing.safetyLevel === "DANGER") badgeClass = "bg-error-container text-error";

                return (
                  <div key={index} className="group bg-white border border-outline-variant rounded-lg p-md hover:shadow-md transition-shadow flex justify-between items-center">
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-on-surface group-hover:text-accent transition-colors">{ing.name}</span>
                      <span className="text-on-surface-variant text-label-sm">{ing.description}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full font-label-sm text-label-sm shrink-0 capitalize ${badgeClass}`}>
                      {ing.safetyLevel.toLowerCase()}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Sidebar Widget */}
        <aside className="md:w-[30%] space-y-md">
          <div className="sticky top-24 space-y-md">
            <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm text-left">
              <div className="aspect-square bg-surface-container-low flex items-center justify-center text-accent text-6xl">
                🧴
              </div>
              <div className="p-md space-y-sm">
                <h4 className="font-headline-md text-headline-md text-accent">{product.name}</h4>
                <p className="text-on-surface-variant text-label-md">Thương hiệu: <span className="font-bold">{product.brand}</span></p>
                <div className="pt-sm border-t border-outline-variant">
                  <div className="mb-sm text-xs font-bold text-on-surface-variant">GỢI Ý CHO BẠN</div>
                  <ShopeeButton 
                    url={product.shopeeUrl} 
                    subId="gocdadep_product" 
                    className="w-full text-sm" 
                  />
                </div>
              </div>
            </div>

            {/* Expertise Box */}
            <div className="bg-surface-container-low p-md rounded-xl space-y-sm text-left border border-outline-variant">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-accent" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
                <span className="font-label-md text-label-md font-bold text-accent">Chuyên gia khuyên dùng</span>
              </div>
              <p className="text-label-sm text-on-surface-variant leading-relaxed">
                Kết quả được tổng hợp từ dữ liệu khoa học tin cậy. Vui lòng tham khảo ý kiến bác sĩ chuyên khoa da liễu trước khi thay đổi liệu trình skincare của bạn.
              </p>
            </div>
          </div>
        </aside>
      </main>

      {/* Sticky CTA kích hoạt khi cuộn quá 30% */}
      <StickyShopeeCTA shopeeUrl={product.shopeeUrl} subId="gocdadep_product" />

      <Footer />
    </div>
  );
}
