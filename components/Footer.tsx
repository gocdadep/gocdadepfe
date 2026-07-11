import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="bg-zinc-50 border-t border-zinc-200 mt-20 min-h-[200px]">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Image src="/favicon-cropped.png" alt="Góc Da Đẹp Logo" width={24} height={24} className="w-6 h-6 rounded-lg" />
              <span className="text-xl font-bold text-zinc-900">Góc Da Đẹp</span>
            </div>
            <p className="text-sm font-semibold text-zinc-700">Cổng tra cứu hoạt chất và phân tích thành phần mỹ phẩm khoa học.</p>
            <div className="space-y-1.5 text-xs text-zinc-500">
              <p>Chịu trách nhiệm nội dung: Nguyễn Đức Tâm</p>
              <p>Địa chỉ: Tổ 2, Phường Cầu Giấy, TP. Hà Nội</p>
              <p>Email hỗ trợ: contact@gocdadep.com</p>
            </div>
          </div>
          <div className="space-y-3 md:text-right">
            <h4 className="text-xs font-bold text-zinc-900 tracking-widest uppercase">Thông tin pháp lý</h4>
            <div className="flex flex-col md:items-end gap-2 text-xs text-zinc-500">
              <Link href="/gioi-thieu" className="hover:text-zinc-900 transition">
                Giới thiệu
              </Link>
              <Link href="/terms-of-service" className="hover:text-zinc-900 transition">
                Điều khoản dịch vụ
              </Link>
              <Link href="/privacy-policy" className="hover:text-zinc-900 transition">
                Chính sách bảo mật
              </Link>
            </div>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="text-center space-y-2">
          <p className="text-[10px] text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            ⚕️ Thông tin trên Góc Da Đẹp chỉ mang tính chất tham khảo bách khoa. Không thay thế chỉ định, phác đồ điều trị của bác sĩ da liễu có chuyên môn.
          </p>
          <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
            © 2026 gocdadep.com. Tất cả các quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
