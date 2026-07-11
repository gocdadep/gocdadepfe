import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Chính sách Bảo mật — gocdadep.com",
  description: "Chính sách bảo mật thông tin người dùng của Góc Da Đẹp. Chúng tôi tôn trọng và bảo vệ quyền riêng tư dữ liệu của bạn.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-16 flex-1 w-full pt-24 space-y-8">
        <article className="prose dark:prose-invert max-w-none text-left space-y-6">
          <h1 className="text-3xl font-extrabold text-slate-950 dark:text-white border-b pb-4">
            CHÍNH SÁCH BẢO MẬT (PRIVACY POLICY)
          </h1>
          <p className="text-xs text-slate-400 dark:text-zinc-550 font-semibold italic">
            Ngày cập nhật cuối cùng: 11 tháng 07 năm 2026
          </p>
          <p className="text-sm leading-relaxed">
            Chào mừng bạn đến với <strong>Góc Da Đẹp</strong> (tại địa chỉ website: <code className="text-accent">gocdadep.com</code>). Chúng tôi cam kết bảo vệ quyền riêng tư và an toàn dữ liệu của bạn khi bạn truy cập và tra cứu thông tin hoạt chất mỹ phẩm hoặc đọc các bài viết chia sẻ kiến thức trên website của chúng tôi.
          </p>
          <p className="text-sm leading-relaxed">
            Vui lòng đọc kỹ Chính sách bảo mật dưới đây để hiểu rõ cách thức chúng tôi xử lý dữ liệu khi bạn trải nghiệm trang web.
          </p>

          <hr className="border-slate-200 dark:border-zinc-800 my-6" />

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">1. Dữ Liệu Chúng Tôi Thu Thập</h2>
            <p className="text-sm leading-relaxed">
              Khi bạn tương tác với <code className="text-accent">gocdadep.com</code>, hệ thống tự động ghi nhận các thông tin kỹ thuật tiêu chuẩn từ trình duyệt của bạn (Dữ liệu Log), bao gồm:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Địa chỉ IP.</li>
              <li>Loại trình duyệt và hệ điều hành.</li>
              <li>Các trang nội dung bạn đã xem trên website của chúng tôi.</li>
              <li>Thời gian truy cập và các liên kết bạn đã nhấp vào.</li>
            </ul>
            <p className="text-sm leading-relaxed font-semibold">
              *Lưu ý: Website của chúng tôi không có chức năng đăng ký, gửi thư điện tử, bình luận hay bày tỏ cảm xúc (like), do đó chúng tôi hoàn toàn không thu thập các thông tin cá nhân định danh như Họ tên, Email hoặc Số điện thoại của bạn.*
            </p>
          </section>

          <hr className="border-slate-200 dark:border-zinc-800 my-6" />

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">2. Cách Thức Sử Dụng Dữ Liệu</h2>
            <p className="text-sm leading-relaxed">
              Chúng tôi sử dụng các thông tin kỹ thuật thu thập được cho các mục đích hợp pháp sau:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Duy trì, vận hành và tối ưu hóa hiệu năng, tốc độ tải trang của hệ thống website.</li>
              <li>Cải thiện nội dung công cụ tra cứu và nâng cao trải nghiệm của người dùng.</li>
              <li>Ngăn chặn các hành vi tấn công bảo mật hoặc truy cập bất hợp pháp gây ảnh hưởng tới hoạt động của website.</li>
            </ul>
          </section>

          <hr className="border-slate-200 dark:border-zinc-800 my-6" />

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">3. Chính Sách Cookie và Công Nghệ Theo Dõi</h2>
            <p className="text-sm leading-relaxed">
              <code className="text-accent">gocdadep.com</code> sử dụng &quot;Cookie&quot; (các tệp văn bản nhỏ được đặt trên thiết bị của bạn) để phân tích lưu lượng truy cập và ghi nhớ một số tùy chọn giao diện cơ bản của bạn. Bạn có thể tùy chọn tắt cookie trong phần cài đặt của trình duyệt, tuy nhiên điều này có thể ảnh hưởng đến khả năng hiển thị của một số tính năng trên trang web.
            </p>
          </section>

          <hr className="border-slate-200 dark:border-zinc-800 my-6" />

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">4. Tích Hợp Dịch Vụ Từ Bên Thứ Ba (Quảng Cáo và Tiếp Thị Liên Kết)</h2>
            <p className="text-sm leading-relaxed">
              Để duy trì chi phí hoạt động, trang web có tích hợp dịch vụ từ các đối tác uy tín sau:
            </p>
            <ul className="list-disc pl-5 space-y-4 text-sm">
              <li>
                <strong>Google AdSense:</strong> Google, với tư cách là nhà cung cấp bên thứ ba, sử dụng cookie để phân phối quảng cáo dựa trên các lượt truy cập trước đó của người dùng vào <code className="text-accent">gocdadep.com</code> và các trang web khác trên Internet. Người dùng có thể tùy chọn từ chối việc sử dụng cookie này bằng cách truy cập chính sách bảo mật của mạng quảng cáo và nội dung Google.
              </li>
              <li>
                <strong>Mạng lưới Tiếp thị Liên kết (Affiliate Marketing):</strong> Khi bạn nhấp vào các liên kết gợi ý sản phẩm chứa hoạt chất hướng tới các sàn thương mại điện tử đối tác (như Shopee, Lazada...), một cookie của bên thứ ba sẽ được lưu lại trong thời gian ngắn để ghi nhận đơn hàng hoàn thành nhằm trích xuất hoa hồng cho chúng tôi. Quy trình này hoạt động tự động và hoàn toàn không thu thập thông tin cá nhân nhạy cảm hay tài khoản ngân hàng của bạn.
              </li>
            </ul>
          </section>

          <hr className="border-slate-200 dark:border-zinc-800 my-6" />

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">5. Bảo Mật Thông Tin</h2>
            <p className="text-sm leading-relaxed">
              Chúng tôi áp dụng các biện pháp bảo mật tiêu chuẩn để bảo vệ toàn vẹn dữ liệu hệ thống, ngăn chặn các hành vi truy cập, thay đổi, tiết lộ hoặc phá hủy dữ liệu trái phép từ bên ngoài.
            </p>
          </section>

          <hr className="border-slate-200 dark:border-zinc-800 my-6" />

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">6. Thay Đổi Chính Sách Bảo Mật</h2>
            <p className="text-sm leading-relaxed">
              Chúng tôi có quyền cập nhật hoặc thay đổi Chính sách bảo mật này bất kỳ lúc nào để phù hợp với sự thay đổi của công nghệ hoặc các quy định pháp luật hiện hành. Mọi thay đổi sẽ có hiệu lực ngay khi được đăng tải công khai trên trang này kèm theo ngày cập nhật mới nhất.
            </p>
          </section>

          <hr className="border-slate-200 dark:border-zinc-800 my-6" />

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">7. Liên Hệ Với Chúng Tôi</h2>
            <p className="text-sm leading-relaxed">
              Nếu bạn có bất kỳ câu hỏi hoặc đóng góp nào liên quan đến Chính sách bảo mật này, vui lòng liên hệ với Ban quản trị qua biểu mẫu tại trang Liên hệ của chúng tôi.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
