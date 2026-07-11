import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Giới thiệu về Góc Da Đẹp - Tra cứu hoạt chất & skincare khoa học",
  description: "Góc Da Đẹp cung cấp các công cụ tra cứu độ an toàn hoạt chất mỹ phẩm độc lập và cẩm nang routine chăm sóc da khoa học tối giản.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-zinc-900 flex flex-col justify-between selection:bg-zinc-100">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-16 flex-1 w-full pt-24 space-y-6">
        <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight border-b pb-4">
          Về chúng mình – Góc Da Đẹp: Tra cứu hoạt chất &amp; Skincare khoa học
        </h1>
        <p className="text-xs text-slate-400 font-semibold italic">Cập nhật lần cuối: Ngày 11 tháng 07 năm 2026</p>

        <div className="prose max-w-none space-y-6 text-sm text-slate-700 leading-relaxed text-left">
          <p>
            Chào mừng bạn ghé thăm <strong>Góc Da Đẹp</strong>! 🚀
          </p>
          <p>
            Góc Da Đẹp ra đời với một mục tiêu đơn giản và độc lập duy nhất: Trở thành một trạm thông tin tra cứu hoạt chất mỹ phẩm và cẩm nang routine tối giản, giúp bạn trẻ hiểu rõ làn da, gỡ rối bảng thành phần hóa học phức tạp và tự tin hơn trên con đường skincare chuẩn khoa học.
          </p>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-950">Chúng mình mang đến những công cụ hữu ích nào?</h2>
            <p>Chúng mình tập trung phát triển các tiện ích cốt lõi hoàn toàn miễn phí phục vụ cộng đồng:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                📚 <strong>Tra cứu hoạt chất &amp; Phân tích độ an toàn:</strong> Nơi bạn dễ dàng kiểm tra danh mục thành phần mỹ phẩm xem có lành tính, cần lưu ý hay chứa chất cấm nào theo quy chuẩn y khoa mới nhất. Mọi phân tích được số hóa rõ ràng để bạn đọc là hiểu ngay.
              </li>
              <li>
                🎯 <strong>Cẩm nang &amp; Routine Skincare khoa học:</strong> Tổng hợp các bài viết mổ xẻ chuyên sâu về hoạt chất dưỡng da (BHA, Retinol, Niacinamide, Vitamin C, B5...) và các bước kết hợp routine tối giản từ các chuyên gia da liễu độc lập, không quảng cáo nói quá.
              </li>
              <li>
                🛒 <strong>Liên kết tiếp thị chính hãng:</strong> Kết nối trực tiếp đến các sản phẩm chính hãng uy tín trên các sàn đối tác uy tín. Toàn bộ link affiliate được dán nhãn minh bạch và có cơ chế bảo vệ SEO Link Juice nghiêm ngặt.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-slate-950">Cam kết độc lập và minh bạch</h2>
            <p>
              Góc Da Đẹp được xây dựng độc lập và cam kết duy trì nền tảng này <strong>100% miễn phí</strong>. Để có chi phí duy trì hệ thống máy chủ, trang web có hiển thị một số quảng cáo từ đối tác Google AdSense. Chúng mình cam kết sắp xếp vị trí quảng cáo tinh tế, chống nhảy layout (CLS) để không làm phiền trải nghiệm tra cứu của bạn.
            </p>
          </section>

          <section className="mt-8 pt-6 border-t border-slate-200 space-y-2">
            <h2 className="text-lg font-bold text-slate-950">Kết nối với chúng mình</h2>
            <p>
              Nếu bạn có bất kỳ thắc mắc nào, phát hiện sai sót dữ liệu hoạt chất, hoặc muốn đóng góp ý kiến để hoàn thiện website, vui lòng liên hệ:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Chịu trách nhiệm nội dung:</strong> Nguyễn Đức Tâm</li>
              <li><strong>Địa chỉ:</strong> Tổ 2, Phường Cầu Giấy, TP. Hà Nội, Việt Nam</li>
              <li><strong>Email hỗ trợ:</strong> contact@gocdadep.com</li>
              </ul>
          </section>

          {/* Khung link điều hướng Trạm sạc */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-center mt-6">
            <p className="text-xs text-slate-600 leading-relaxed mb-2">
              Để Góc Da Đẹp tiếp tục đồng hành và chia sẻ kiến thức miễn phí lâu dài, bạn có thể ủng hộ tụi mình một ly cà phê muối nha.
            </p>
            <Link
              href="/redirect?url=https%3A%2F%2Fshopee.vn"
              target="_blank"
              rel="nofollow noopener sponsored"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition duration-200 cursor-pointer"
            >
              Ghé thăm Trạm sạc năng lượng 🥤✨
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
