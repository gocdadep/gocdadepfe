import Image from "next/image";
import type { Product } from "@/types/product";
import { productsData } from "@/lib/products-store";
import { generateStandardATLink } from "@/lib/affiliate";

interface Props {
  rowIndex: number;
  currentPage: number;
  isCard?: boolean;
}

export default function AffiliateNativeRow({ rowIndex, currentPage, isCard = false }: Props) {
  let dormProducts: Product[] = [];
  try {
    dormProducts = productsData.filter(p => p.category === "cleanser");
  } catch (error) {
    console.error("Error loading affiliate products:", error);
    return null;
  }

  if (dormProducts.length === 0) return null;

  // Tính chỉ số dòng toàn cục để đổi sản phẩm khác nhau trên từng trang phân trang
  const globalIndex = (currentPage - 1) + rowIndex;
  const product = dormProducts[globalIndex % dormProducts.length];

  const isTiki = product.rawProductUrl.includes("tiki.vn");
  const isShopee = product.rawProductUrl.includes("shopee.vn");
  const campaignId = isTiki ? "tiki" : "shopee";
  const finalUrl = (isTiki || isShopee)
    ? generateStandardATLink({
        rawProductUrl: product.rawProductUrl,
        articleId: `native_row_${currentPage || 1}`,
        campaignId
      })
    : product.rawProductUrl;

  const redirectUrl = `/redirect?url=${encodeURIComponent(finalUrl)}`;

  if (isCard) {
    return (
      <div className="bg-slate-50/30 border-b border-slate-200">
        <a
          href={redirectUrl}
          target="_blank"
          rel="nofollow noopener sponsored"
          className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-slate-100/30 transition duration-200 group"
          data-testid={`affiliate-native-card-${rowIndex}`}
        >
          <div className="flex items-center gap-3">
            <Image
              src={product.image}
              alt={product.name}
              width={40}
              height={40}
              className="rounded-xl object-cover flex-shrink-0"
            />
            <div>
              <p className="font-bold text-xs text-slate-900 group-hover:text-primary transition line-clamp-1">
                {product.name}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                Gợi ý dành cho bạn: {product.description}
              </p>
            </div>
          </div>
          <span className="text-[8px] text-slate-400 font-bold border border-slate-200 rounded px-1.5 py-0.5 flex-shrink-0 whitespace-nowrap">
            GỢI Ý CHO BẠN
          </span>
        </a>
      </div>
    );
  }

  return (
    <tr className="bg-slate-50/20">
      <td className="p-0" colSpan={4}>
        <a
          href={redirectUrl}
          target="_blank"
          rel="nofollow noopener sponsored"
          className="flex items-center justify-between gap-3 px-6 py-4 hover:bg-slate-100/30 transition duration-200 group"
          data-testid={`affiliate-native-row-${rowIndex}`}
        >
          <div className="flex items-center gap-3">
            <Image
              src={product.image}
              alt={product.name}
              width={44}
              height={44}
              className="rounded-xl object-cover flex-shrink-0"
            />
            <div>
              <p className="font-bold text-sm text-slate-900 group-hover:text-primary transition">
                {product.name}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Gợi ý dành cho bạn: {product.description}
              </p>
            </div>
          </div>
          <span className="text-[9px] text-slate-400 font-bold border border-slate-200 rounded px-1.5 py-0.5 flex-shrink-0 whitespace-nowrap">
            LIÊN KẾT TÀI TRỢ
          </span>
        </a>
      </td>
    </tr>
  );
}
