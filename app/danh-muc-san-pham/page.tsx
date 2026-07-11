import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductFilter from "@/components/feature/ProductFilter";

export const metadata: Metadata = {
  title: "Tra cứu & Lọc sản phẩm mỹ phẩm — gocdadep.com",
  description: "Tìm kiếm và lọc bảng thành phần chi tiết của các sản phẩm skincare thông dụng trên thị trường Việt Nam.",
};

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-12 flex-1 w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white">
            Tra cứu & Lọc sản phẩm
          </h1>
          <p className="text-sm text-text-secondary max-w-lg mx-auto">
            Lọc sản phẩm chứa chất bạn thích hoặc tránh chất bạn dị ứng dễ dàng.
          </p>
        </div>
        <ProductFilter />
      </main>
      <Footer />
    </div>
  );
}
