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
          <h1 className="text-4xl font-extrabold text-emerald-900">
            Danh Mục Sản Phẩm
          </h1>
          <p className="text-sm text-zinc-500 max-w-2xl mx-auto leading-relaxed">
            Tuyển tập những sản phẩm skincare được phân tích khoa học, minh bạch về thành phần.
            <br />
            Lựa chọn giải pháp tối ưu cho làn da của bạn.
          </p>
        </div>
        <ProductFilter />
      </main>
      <Footer />
    </div>
  );
}
