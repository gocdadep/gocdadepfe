import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { productsData } from "@/lib/products-store";
import ingredientsData from "@/data/ingredients.json";
import AffiliateCtaButton from "@/components/affiliate/AffiliateCtaButton";
import StickyAffiliateCTA from "@/components/affiliate/StickyAffiliateCTA";
import { ShieldCheck, AlertTriangle, Bot, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
      <div className="min-h-screen flex flex-col justify-between bg-white text-zinc-900">
        <Header />
        <main className="max-w-md mx-auto px-6 py-20 text-center space-y-4 pt-24">
          <h1 className="text-2xl font-bold text-zinc-900">Không tìm thấy sản phẩm</h1>
          <Link href="/danh-muc-san-pham" className="text-zinc-650 underline font-semibold flex items-center justify-center gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Quay lại tra cứu
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
  
  const isSupplement = product.brand.toLowerCase() === "dhc" || 
                       product.name.toLowerCase().includes("viên uống") || 
                       product.name.toLowerCase().includes("thực phẩm chức năng");
  if (isSupplement) {
    warnings.push("Chú ý: Sản phẩm này không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh.");
  }

  const getSafetyStyle = (level: string) => {
    switch (level) {
      case "SAFE":
        return { label: "An toàn", badgeClass: "bg-green-50 text-green-700 border-green-200 hover:bg-green-50" };
      case "CAUTION":
        return { label: "Lưu ý", badgeClass: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50" };
      case "DANGER":
        return { label: "Cảnh báo", badgeClass: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50" };
      default:
        return { label: "Chưa rõ", badgeClass: "bg-zinc-100 text-zinc-500 border-zinc-200 hover:bg-zinc-100" };
    }
  };

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
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col justify-between selection:bg-zinc-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      
      <main className="max-w-5xl mx-auto px-6 py-12 flex-grow w-full flex flex-col md:flex-row gap-8 pt-24 z-10 text-left">
        {/* Main Analysis Content */}
        <div className="flex-grow md:w-[70%] space-y-6">
          
          {/* AI Summary Banner */}
          <section className="bg-zinc-50 rounded-xl p-5 border border-zinc-200 flex items-start gap-4">
            <div className="bg-zinc-100 p-2.5 rounded-lg text-zinc-900 shrink-0">
              <Bot className="w-5 h-5 text-zinc-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 mb-1">Tóm tắt AI: An toàn &amp; Hiệu quả</h2>
              <p className="text-zinc-500 font-normal leading-relaxed text-sm">
                {aiSummary}
              </p>
            </div>
          </section>

          {/* Danger Warning Banner */}
          {warnings.length > 0 && (
            <div className="space-y-3">
              {warnings.map((warn, index) => (
                <Alert key={index} variant="destructive" className="border-red-200 bg-red-50 text-red-700">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-700" />
                  <AlertTitle className="font-bold text-sm">Cảnh báo hoạt chất</AlertTitle>
                  <AlertDescription className="text-xs font-medium text-red-650">
                    {warn}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          {/* Health Score Section */}
          <div className="grid grid-cols-3 gap-4">
            {/* Safe Box */}
            <div className="bg-white p-5 rounded-xl border border-zinc-200 flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-3xl font-bold tracking-tight text-green-700 mb-1">{safePercent}%</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-green-700">An toàn</span>
            </div>
            {/* Warning Box */}
            <div className="bg-white p-5 rounded-xl border border-zinc-200 flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-3xl font-bold tracking-tight text-amber-700 mb-1">{cautionPercent}%</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Lưu ý</span>
            </div>
            {/* Danger Box */}
            <div className="bg-white p-5 rounded-xl border border-zinc-200 flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-3xl font-bold tracking-tight text-red-700 mb-1">{dangerPercent}%</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-700">Cảnh báo</span>
            </div>
          </div>

          {/* Ingredient Grid */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-zinc-900 tracking-tight">Danh sách thành phần ({total})</h3>
            
            <div className="grid grid-cols-1 gap-3">
              {ingredients.map((ing, index) => {
                const style = getSafetyStyle(ing.safetyLevel);
                return (
                  <Link href={`/ingredients/${ing.id}`} key={index} className="group bg-white border border-zinc-200 rounded-lg p-4 hover:shadow-sm transition flex justify-between items-center gap-4 cursor-pointer">
                    <div className="flex flex-col text-left space-y-0.5">
                      <span className="font-semibold text-sm text-zinc-900 group-hover:text-emerald-700 transition-colors">{ing.name}</span>
                      <span className="text-zinc-500 text-xs">{ing.description}</span>
                    </div>
                    <Badge variant="outline" className={`text-[9px] font-bold px-2.5 py-1 rounded-full shrink-0 uppercase tracking-widest ${style.badgeClass}`}>
                      {style.label}
                    </Badge>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        {/* Sidebar Widget */}
        <aside className="md:w-[30%] space-y-6">
          <div className="sticky top-24 space-y-6">
            <Card className="border border-zinc-200 rounded-xl overflow-hidden shadow-sm text-left">
              <div className="aspect-square bg-zinc-50 flex items-center justify-center text-zinc-400 text-6xl">
                🧴
              </div>
              <CardContent className="p-5 space-y-3">
                <h4 className="font-bold text-base text-zinc-900 leading-snug">{product.name}</h4>
                <p className="text-zinc-550 text-xs">Thương hiệu: <span className="font-bold text-zinc-800">{product.brand}</span></p>
                
                <Separator className="bg-zinc-100" />
                
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">GỢI Ý DÀNH CHO BẠN</div>
                  <AffiliateCtaButton 
                    url={product.rawProductUrl} 
                    subId={`products-${product.id}`} 
                    className="w-full text-xs bg-zinc-900 hover:bg-zinc-800 text-white font-medium" 
                  />
                </div>
              </CardContent>
            </Card>

            {/* Expertise Box */}
            <div className="bg-zinc-50 p-5 rounded-xl space-y-2 text-left border border-zinc-200">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span className="font-bold text-xs text-zinc-900 uppercase tracking-wider">Khuyên dùng khoa học</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                Kết quả được tổng hợp khách quan từ các nghiên cứu khoa học. Vui lòng tham khảo ý kiến bác sĩ chuyên khoa da liễu để xây dựng routine phù hợp nhất cho làn da của bạn.
              </p>
            </div>
          </div>
        </aside>
      </main>

      {/* Sticky CTA kích hoạt khi cuộn quá 30% */}
      <StickyAffiliateCTA affiliateUrl={product.rawProductUrl} subId={`products-${product.id}`} />

      <Footer />
    </div>
  );
}
