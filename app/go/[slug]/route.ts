import { NextResponse } from "next/server";
import affiliateLinks from "@/affiliate-links.json";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const match = affiliateLinks.find((link) => link.source === `/go/${slug}`);

  if (!match || !match.destination.startsWith("https://")) {
    return NextResponse.redirect(new URL("/", request.url), 302);
  }

  return NextResponse.redirect(match.destination, {
    status: 302,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
