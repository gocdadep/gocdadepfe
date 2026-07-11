import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.toLowerCase();

  // Pattern kiểm tra chứa từ khóa độc hại
  const blockContains = [
    ".env",
    ".aws",
    ".git",
    "wp-admin",
    "wp-includes",
    "/.github/",
    "/s3/",
    "backup",
  ];

  // Pattern kiểm tra kết thúc bằng đuôi độc hại
  const blockEndsWith = [
    ".sql",
    ".bak",
    ".cgi",
    "nuxt.config.js",
    "next.config.js",
  ];

  // Pattern kiểm tra bắt đầu bằng path độc hại
  const blockStartsWith = [
    "/data/",
    "/config/",
  ];

  const shouldBlock =
    blockContains.some((pattern) => pathname.includes(pattern)) ||
    blockEndsWith.some((ext) => pathname.endsWith(ext)) ||
    blockStartsWith.some((prefix) => pathname.startsWith(prefix));

  if (shouldBlock) {
    return new Response("Forbidden", { status: 403 });
  }

  return NextResponse.next();
}

// Cấu hình matcher loại trừ static assets để tối ưu Edge runtime
export const config = {
  matcher: [
    /*
     * Khớp với tất cả các request ngoại trừ:
     * - api (API routes nếu có)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt, ads.txt (metadata files)
     * - các file ảnh trong public như png, svg, jpg, jpeg, gif, webp
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|ads.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
