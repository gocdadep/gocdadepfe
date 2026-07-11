import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Điều khoản Dịch vụ — gocdadep.com",
  description: "Điều khoản sử dụng dịch vụ của Góc Da Đẹp. Vui lòng đọc kỹ các quy định và Tuyên bố miễn trừ trách nhiệm y khoa.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-zinc-900 flex flex-col justify-between selection:bg-zinc-100">
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-16 flex-1 w-full pt-24 space-y-8">
        <article className="prose max-w-none text-left space-y-6 text-slate-700">
          <h1 className="text-3xl font-extrabold text-slate-950 border-b pb-4">
            ĐIỀU KHOẢN DỊCH VỤ (TERMS OF SERVICE)
          </h1>
          <p className="text-xs text-slate-450 font-semibold italic">
            Ngày cập nhật cuối cùng: 11 tháng 07 năm 2026
          </p>
          <p className="text-sm leading-relaxed">
            Chào mừng bạn đến với <strong>Góc Da Đẹp</strong> (địa chỉ website: <code className="text-emerald-700 font-bold bg-zinc-100 px-1.5 py-0.5 rounded">gocdadep.com</code>). Bằng việc truy cập và sử dụng bất kỳ nội dung hoặc công cụ tra cứu nào trên trang web này, bạn đồng ý tuân thủ và chịu sự ràng buộc bởi các Điều khoản dịch vụ dưới đây. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng ngừng sử dụng trang web ngay lập tức.
          </p>

          <hr className="border-slate-200 my-6" />

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-950">
              1. Tuyên Bố Miễn Trừ Trách Nhiệm Y Khoa (Medical Disclaimer)
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
              <li>
                <strong>Thông tin mang tính tham khảo bách khoa:</strong> Toàn bộ nội dung hiển thị trên <code className="text-emerald-750 bg-zinc-100 px-1 rounded">gocdadep.com</code>, bao gồm từ điển hoạt chất, công dụng, hướng dẫn kết hợp, dữ liệu chất cấm và các bài viết chia sẻ kiến thức, chỉ mang tính chất thông tin và giáo dục bách khoa thuần túy.
              </li>
              <li>
                <strong>Không thay thế chẩn đoán chuyên môn:</strong> Thông tin trên website không được coi là lời khuyên y tế, chẩn đoán, phác đồ điều trị từ bác sĩ da liễu hoặc chuyên gia y tế có thẩm quyền.
              </li>
              <li>
                <strong>Trách nhiệm thử nghiệm thực tế:</strong> Làn da của mỗi cá nhân có cơ địa, tình trạng và mức độ nhạy cảm khác nhau. Chúng tôi không chịu trách nhiệm đối với bất kỳ tổn thương, kích ứng da, tác dụng phụ hoặc hậu quả nào phát sinh trực tiếp hoặc gián tiếp từ việc bạn tự áp dụng thông tin từ website mà không có sự tham vấn của chuyên gia y tế.
              </li>
            </ul>
          </section>

          <hr className="border-slate-200 my-6" />

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-950">
              2. Quyền Sở Hữu Trí Tuệ
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
              <li>
                <strong>Bản quyền nội dung:</strong> Toàn bộ văn bản, cách biên soạn, tổng hợp thông tin, cấu trúc từ điển hoạt chất và hệ thống đồ họa/hình ảnh tự thiết kế trên website đều thuộc quyền sở hữu trí tuệ của Ban quản trị <code className="text-emerald-750 bg-zinc-100 px-1 rounded">gocdadep.com</code>.
              </li>
              <li>
                <strong>Giới hạn sử dụng:</strong> Bạn chỉ được phép sử dụng nội dung cho mục đích cá nhân, phi thương mại. Nghiêm cấm mọi hành vi sao chép, tự động thu thập dữ liệu (cào data/scraping), phân phối lại hoặc tái xuất bản một phần hay toàn bộ nội dung của chúng tôi lên các nền tảng khác khi chưa có sự đồng ý bằng văn bản từ Ban quản trị.
              </li>
            </ul>
          </section>

          <hr className="border-slate-200 my-6" />

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-950">
              3. Quy Định Sử Dụng Website
            </h2>
            <p className="text-sm leading-relaxed">
              Khi truy cập và trải nghiệm trang web, bạn đồng ý <strong>KHÔNG</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
              <li>Sử dụng bất kỳ công cụ tự động, phần mềm hoặc mã độc nào nhằm mục đích can thiệp, phá hoại, làm chậm tốc độ tải trang hoặc làm quá tải hạ tầng máy chủ của website.</li>
              <li>Lợi dụng các công cụ tìm kiếm trên trang để thực hiện các hành vi spam hoặc dò tìm lỗ hổng bảo mật.</li>
            </ul>
            <p className="text-sm leading-relaxed font-semibold">
              *Lưu ý: Hệ thống hoạt động theo mô hình giao diện thông tin một chiều, không tích hợp các tính năng tương tác như đăng ký tài khoản, gửi email, bình luận hay bày tỏ cảm xúc (like), nhằm mục đích tối ưu hóa tối đa tốc độ hiển thị và an toàn dữ liệu.*
            </p>
          </section>

          <hr className="border-slate-200 my-6" />

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-950">
              4. Liên Kết Đến Bên Thứ Ba (Affiliate Links)
            </h2>
            <p className="text-sm leading-relaxed">
              Website có chứa các liên kết tiếp thị (Affiliate links) dẫn đến các sàn thương mại điện tử đối tác (như Shopee, Lazada...).
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
              <li>Chúng tôi chỉ gợi ý các sản phẩm dựa trên việc chứa hoạt chất tương ứng mà bạn đang tra cứu.</li>
              <li>Chúng tôi không sở hữu, không bán trực tiếp, không kiểm soát giá cả, chính sách giao hàng hay chất lượng của các sản phẩm tại các sàn thương mại điện tử này. Mọi giao dịch mua bán, khiếu nại về đơn hàng của bạn sẽ do bên sàn thương mại điện tử và nhà bán hàng chịu trách nhiệm xử lý theo điều khoản riêng của họ.</li>
            </ul>
          </section>

          <hr className="border-slate-200 my-6" />

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-950">
              5. Giới Hạn Trách Nhiệm Pháp Lý
            </h2>
            <p className="text-sm leading-relaxed">
              Trong phạm vi tối đa được pháp luật cho phép, Ban quản trị <code className="text-emerald-750 bg-zinc-100 px-1 rounded">gocdadep.com</code> sẽ không chịu trách nhiệm pháp lý đối với bất kỳ thiệt hại trực tiếp, gián tiếp, ngẫu nhiên hoặc do hậu quả nào phát sinh từ việc bạn sử dụng hoặc không thể sử dụng trang web, bao gồm nhưng không giới hạn ở các lỗi kỹ thuật, gián đoạn đường truyền, hoặc sự thiếu sót về mặt cập nhật dữ liệu hoạt chất tại thời điểm tra cứu.
            </p>
          </section>

          <hr className="border-slate-200 my-6" />

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-950">
              6. Thay Đổi Điều Khoản
            </h2>
            <p className="text-sm leading-relaxed">
              Chúng tôi có quyền sửa đổi, bổ sung hoặc thay thế các Điều khoản dịch vụ này bất kỳ lúc nào mà không cần thông báo trước. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải công khai trên trang này. Việc bạn tiếp tục sử dụng website sau khi các điều khoản thay đổi được đăng tải đồng nghĩa với việc bạn chấp nhận các điều khoản mới đó.
            </p>
          </section>

          <hr className="border-slate-200 my-6" />

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-950">
              7. Thông Tin Liên Hệ
            </h2>
            <p className="text-sm leading-relaxed">
              Mọi thắc mắc hoặc góp ý về nội dung và Điều khoản dịch vụ của website, vui lòng liên hệ với Ban quản trị qua email <strong>contact@gocdadep.com</strong>.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
