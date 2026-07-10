import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import productsData from "@/data/products.json";
import ingredientsData from "@/data/ingredients.json";

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
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = productsData.find((p) => p.id === resolvedParams.slug);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col justify-between">
        <Header />
        <main className="max-w-md mx-auto px-6 py-20 text-center space-y-4">
          <h1 className="text-xl font-bold">Không tìm thấy sản phẩm</h1>
          <Link href="/products" className="text-accent underline font-semibold">
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

  // AI Summary Logic tĩnh (BR-1)
  const hasDanger = ingredients.some((ing) => ing.safetyLevel === "DANGER");
  const aiSummary = hasDanger
    ? "Cần cân nhắc kỹ trước khi dùng cho da nhạy cảm."
    : "Phù hợp hầu hết các loại da thông thường.";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Header />
      
      <main className="max-w-3xl mx-auto px-6 py-12 flex-1 w-full space-y-8">
        {/* Product Info Header */}
        <div className="space-y-2 border-b border-card-border pb-6">
          <span className="text-sm font-bold text-accent uppercase tracking-wider block">
            {product.brand}
          </span>
          <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white">
            {product.name}
          </h1>
          <span className="inline-block text-xs bg-card border border-card-border px-3 py-1 rounded-full capitalize">
            {product.category}
          </span>
        </div>

        {/* AI Summary Badge */}
        <div className="p-4 rounded-2xl bg-card border border-card-border space-y-2">
          <h3 className="text-sm font-bold text-accent">Đánh giá chung (AI Summary)</h3>
          <p className="text-sm leading-relaxed text-text-secondary">{aiSummary}</p>
        </div>

        {/* Ingredients List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-950 dark:text-white">Bảng hoạt chất phân tích</h3>
          <div className="space-y-3">
            {ingredients.map((ing, index) => {
              let badgeClass = "bg-gray-100 text-gray-800";
              if (ing.safetyLevel === "SAFE") badgeClass = "bg-[#E8F5E9] text-[#2E7D32]";
              else if (ing.safetyLevel === "CAUTION") badgeClass = "bg-[#FFFDE7] text-[#F57F17]";
              else if (ing.safetyLevel === "DANGER") badgeClass = "bg-[#FFEBEE] text-[#C62828]";

              return (
                <div key={index} className="p-4 bg-card border border-card-border rounded-xl flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-semibold text-sm text-foreground">{ing.name}</h4>
                    <p className="text-xs text-text-secondary">{ing.description}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 self-start sm:self-center capitalize ${badgeClass}`}>
                    {ing.safetyLevel.toLowerCase()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shopee CTA Card */}
        <div className="p-6 bg-card border border-card-border rounded-2xl text-center space-y-4">
          <span className="text-xs font-bold text-text-secondary block">GỢI Ý DÀNH CHO BẠN</span>
          <h4 className="text-base font-bold text-foreground">Sản phẩm chính hãng có bán tại Shopee Mall</h4>
          <Link
            data-testid="btn-shopee-affiliate"
            href={`/redirect?url=${encodeURIComponent(product.shopeeUrl)}`}
            rel="sponsored nofollow"
            className="inline-block px-8 py-3 bg-[#EE4D2D] hover:bg-[#d73f21] text-white font-bold rounded-xl transition duration-200"
          >
            Xem giá tại Shopee Mall
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
