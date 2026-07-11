import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IngredientAnalyzer from "@/components/feature/IngredientAnalyzer";

export const metadata: Metadata = {
  title: "Phân tích bảng thành phần mỹ phẩm tự do — gocdadep.com",
  description: "Dán bảng thành phần mỹ phẩm bất kỳ để kiểm tra mức độ lành tính, cảnh báo các chất có hại hay kích ứng cho da.",
};

export default function AnalyzerPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-3xl font-extrabold text-slate-950">
            Phân tích bảng thành phần mỹ phẩm
          </h1>
          <p className="text-sm text-text-secondary max-w-lg mx-auto">
            Dán danh sách hoạt chất ngăn cách bằng dấu phẩy để kiểm tra nhanh mức độ an toàn.
          </p>
          <p className="text-xs text-zinc-400 mt-2">
            ⚕️ Kết quả phân tích chỉ mang tính tham khảo. Tham khảo ý kiến bác sĩ da liễu trước khi sử dụng.
          </p>
        </div>
        <IngredientAnalyzer />
      </main>
      <Footer />
    </div>
  );
}
