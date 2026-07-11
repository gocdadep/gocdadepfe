import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chính sách Bảo mật — gocdadep.com",
  description: "Chính sách bảo mật thông tin người dùng của Góc Da Đẹp. Chúng tôi tôn trọng và bảo vệ quyền riêng tư dữ liệu của bạn.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
