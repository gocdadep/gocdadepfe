import Image from "next/image";
import ShopeeButton from "./ShopeeButton";

interface AffiliateCardProps {
  product: {
    id: string;
    name: string;
    brand: string;
    image: string;
    shopeeUrl: string;
  };
  subId: string;
}

export default function AffiliateCard({ product, subId }: AffiliateCardProps) {
  return (
    <div className="bg-white border border-zinc-150 rounded-2xl p-6 shadow-sm hover:shadow-md hover:scale-[1.02] transition duration-200 flex flex-col justify-between items-center text-center space-y-4 max-w-sm w-full">
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">
          Gợi ý dành cho bạn
        </span>
        <h4 className="font-bold text-slate-900 text-base leading-snug line-clamp-2">
          {product.name}
        </h4>
        <span className="text-xs text-emerald-700 font-semibold">{product.brand}</span>
      </div>
      
      {product.image && (
        <div className="relative w-32 h-32 flex items-center justify-center bg-slate-50 rounded-xl overflow-hidden">
          <Image 
            src={product.image} 
            alt={product.name} 
            width={128} 
            height={128}
            className="object-contain"
          />
        </div>
      )}

      <ShopeeButton 
        url={product.shopeeUrl} 
        productId={product.id}
        productName={product.name}
        subId={subId} 
        className="w-full text-sm rounded-full font-bold" 
      />
    </div>
  );
}
