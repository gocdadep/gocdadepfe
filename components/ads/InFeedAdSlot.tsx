import { FEATURE_FLAGS } from "@/lib/config/features";
import Link from "next/link";

interface InFeedAdSlotProps {
  index: number;
}

export default function InFeedAdSlot({ index }: InFeedAdSlotProps) {
  if (FEATURE_FLAGS.ENABLE_ADSENSE) {
    return (
      <div 
        className="overflow-hidden border border-zinc-150 rounded-2xl bg-zinc-50 flex flex-col items-center justify-center p-4 min-h-[320px] w-full text-center"
        data-testid={`infeed-ad-slot-${index}`}
      >
        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">LIÊN KẾT TÀI TRỢ</span>
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", height: "250px" }}
          data-ad-format="fluid"
          data-ad-layout-key="-gw-3+1f-3d+2z"
          data-ad-client="ca-pub-xxx"
          data-ad-slot="xxx"
        />
        <span className="text-[8px] text-zinc-350 block mt-2">Google Ads</span>
      </div>
    );
  }

  // Fallback: Custom Affiliate Promo Banner
  return (
    <div 
      className="overflow-hidden border border-zinc-200 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-amber-50/70 flex flex-col justify-between p-5 min-h-[320px] w-full text-left shadow-sm hover:shadow-md transition duration-200"
      data-testid={`infeed-ad-slot-${index}`}
    >
      <div className="space-y-2.5">
        <span className="text-[9px] font-bold text-amber-600 uppercase tracking-widest block">GỢI Ý DÀNH CHO BẠN</span>
        <h4 className="font-bold text-sm text-slate-800 leading-snug">
          Da bạn dễ nổi mụn hoặc sạm đen khi ra nắng?
        </h4>
        <p className="text-xs text-zinc-550 leading-relaxed">
          Khám phá danh sách các loại kem chống nắng dịu nhẹ, kiềm dầu tốt nhất hiện nay đã được chuyên gia thẩm định.
        </p>
      </div>

      <div className="border-t border-zinc-150/60 pt-4 flex flex-col gap-2">
        <div className="flex justify-between items-center text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
          <span>Hỗ trợ da mụn nhạy cảm</span>
        </div>
        <Link
          href="/danh-muc-san-pham?concern=chong-nang&skin_type=da-dau"
          className="w-full text-center py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-full transition duration-200 shadow-sm"
        >
          Xem sản phẩm ngay →
        </Link>
      </div>
    </div>
  );
}
