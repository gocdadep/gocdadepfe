import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AdSenseScript from "@/components/AdSenseScript";
import GA4Provider from "@/components/analytics/GA4Provider";
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
  title: "Góc Da Đẹp — Tra cứu sản phẩm & cẩm nang skincare khoa học",
  description: "Tra cứu sản phẩm và cẩm nang skincare khoa học dành cho người Việt.",
  icons: {
    icon: "/favicon-cropped.png",
    apple: "/favicon-cropped.png",
  },
  openGraph: {
    title: "Góc Da Đẹp — Tra cứu sản phẩm & cẩm nang skincare khoa học",
    description: "Tra cứu sản phẩm và cẩm nang skincare khoa học dành cho người Việt.",
    url: "https://gocdadep.com",
    siteName: "Góc Da Đẹp",
    images: [
      {
        url: "https://gocdadep.com/favicon-cropped.png",
        width: 512,
        height: 512,
        alt: "Góc Da Đẹp Logo",
      },
    ],
    locale: "vi_VN",
    type: "website",
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
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <AdSenseScript />
        <GA4Provider />
      </body>
    </html>
  );
}


