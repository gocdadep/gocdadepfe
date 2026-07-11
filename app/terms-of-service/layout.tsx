import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Điều khoản Dịch vụ — gocdadep.com",
  description: "Điều khoản sử dụng dịch vụ của Góc Da Đẹp. Vui lòng đọc kỹ các quy định và Tuyên bố miễn trừ trách nhiệm y khoa.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
