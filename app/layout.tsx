import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AdSenseScript from "@/components/AdSenseScript";
import BottomNavBar from "@/components/BottomNavBar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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


