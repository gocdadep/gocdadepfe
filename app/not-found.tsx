import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trang này đi đâu mất rồi — gocdadep.com",
  description: "Chúng mình không tìm thấy trang bạn yêu cầu.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-24 text-center sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-bold text-emerald-600">404</p>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">Ơ, trang trốn đâu mất rồi...</h1>
        <p className="mt-6 text-sm leading-7 text-zinc-500 max-w-md mx-auto">
          Chúng mình không tìm thấy trang bạn đang tìm kiếm. Đường dẫn có thể bị nhầm một xíu hoặc trang đã được dời đi chỗ khác rồi.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-full bg-emerald-500 px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-emerald-600 transition duration-200 cursor-pointer uppercase tracking-wider"
            id="btn-go-home"
          >
            Về trang chủ nha
          </Link>
        </div>
      </div>
    </div>
  );
}
