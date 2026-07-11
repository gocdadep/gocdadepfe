import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AdSenseScript from "@/components/AdSenseScript";
import BottomNavBar from "@/components/BottomNavBar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "gocdadep.com — Tra cứu thành phần mỹ phẩm & Phân tích hoạt chất",
  description: "Phân tích bảng thành phần mỹ phẩm chi tiết, kiểm tra độ an toàn hoạt chất và tra cứu sản phẩm miễn phí cho người Việt.",
  icons: {
    icon: "/favicon-cropped.png",
    apple: "/favicon-cropped.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground pb-16 md:pb-0">
        {children}
        <BottomNavBar />
        <AdSenseScript />
      </body>
    </html>
  );
}


