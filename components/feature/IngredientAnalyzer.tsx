"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ingredientsData from "@/data/ingredients.json";
import IngredientDetailModal from "@/components/feature/IngredientDetailModal";
import { ShieldCheck, AlertTriangle, HelpCircle } from "lucide-react";

interface MappedIngredient {
  id: string;
  name: string;
  safetyLevel: "SAFE" | "CAUTION" | "DANGER" | "UNKNOWN";
  description: string;
}

function IngredientAnalyzerContent() {
  const searchParams = useSearchParams();
  const initialIngredients = searchParams.get("ingredients") || "";

  const [rawText, setRawText] = useState(initialIngredients);
  const [mappedList, setMappedList] = useState<MappedIngredient[]>([]);
  const [stats, setStats] = useState({
    totalNhanDien: 0,
    safePercent: 0,
    cautionPercent: 0,
    dangerPercent: 0,
  });
  const [warnings, setWarnings] = useState<string[]>([]);
  
  // States cho modal hoạt chất chi tiết
  const [selectedIngredient, setSelectedIngredient] = useState<MappedIngredient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!rawText.trim()) {
      setMappedList([]);
      setWarnings([]);
      setStats({ totalNhanDien: 0, safePercent: 0, cautionPercent: 0, dangerPercent: 0 });
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      // 1. Tách chuỗi hỗ trợ dấu phẩy và xuống dòng
      const rawItems = rawText
        .split(/,|\n/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      // 2. So khớp in-memory
      const mapped: MappedIngredient[] = rawItems.map((rawItem) => {
        const lowerItem = rawItem.toLowerCase();
        
        // Tìm trong file ingredients.json tĩnh
        const matched = ingredientsData.find((ing) => {
          const nameMatch = ing.name.toLowerCase() === lowerItem;
          const aliasMatch = ing.aliases.some((alias) => alias.toLowerCase() === lowerItem);
          return nameMatch || aliasMatch;
        });

        if (matched) {
          return {
            id: matched.id,
            name: matched.name,
            safetyLevel: matched.safetyLevel as "SAFE" | "CAUTION" | "DANGER" | "UNKNOWN",
            description: matched.description,
          };
        }

        return {
          id: rawItem,
          name: rawItem,
          safetyLevel: "UNKNOWN",
          description: "Chưa có dữ liệu chi tiết cho chất này.",
        };
      });

      setMappedList(mapped);

      // 3. Tính phần trăm thống kê an toàn
      const detected = mapped.filter((ing) => ing.safetyLevel !== "UNKNOWN");
      const total = detected.length;

      if (total > 0) {
        const safe = detected.filter((ing) => ing.safetyLevel === "SAFE").length;
        const caution = detected.filter((ing) => ing.safetyLevel === "CAUTION").length;
        const danger = detected.filter((ing) => ing.safetyLevel === "DANGER").length;

        setStats({
          totalNhanDien: total,
          safePercent: parseFloat(((safe / total) * 100).toFixed(1)),
          cautionPercent: parseFloat(((caution / total) * 100).toFixed(1)),
          dangerPercent: parseFloat(((danger / total) * 100).toFixed(1)),
        });
      }

      // 4. Kiểm tra các cảnh báo cụ thể (BR-2)
      const warns: string[] = [];
      const lowerInput = rawText.toLowerCase();

      if (lowerInput.includes("denatured alcohol") || lowerInput.includes("alcohol denat")) {
        warns.push("Có chứa cồn khô: Có khả năng gây khô da hoặc kích ứng nếu đứng ở đầu bảng thành phần.");
      }
      if (lowerInput.includes("fragrance") || lowerInput.includes("parfum")) {
        warns.push("Có chứa hương liệu: Cần lưu ý nếu bạn sở hữu làn da nhạy cảm hoặc dễ dị ứng.");
      }
      const hasParaben = rawItems.some((item) => item.toLowerCase().endsWith("paraben"));
      if (hasParaben) {
        warns.push("Có chứa Paraben: Chất bảo quan nhóm Paraben, cân nhắc sử dụng nếu da quá mẫn cảm.");
      }

      setWarnings(warns);
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [rawText]);

  const displayedMappedList = rawText.trim() ? mappedList : [];
  const displayedWarnings = rawText.trim() ? warnings : [];
  const displayedStats = rawText.trim() ? stats : { totalNhanDien: 0, safePercent: 0, cautionPercent: 0, dangerPercent: 0 };

  const handleIngredientClick = (ing: MappedIngredient) => {
    setSelectedIngredient(ing);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 text-left selection:bg-primary-container/10">
      {/* Input Textarea Container */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-[#404942] uppercase tracking-wider block">
          Dán bảng thành phần mỹ phẩm:
        </label>
        <textarea
          data-testid="textarea-ingredients-input"
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Ví dụ: Niacinamide, Alcohol Denat., Methylparaben..."
          className="w-full h-40 p-4 rounded-xl border border-[#c0c9c0] bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none text-sm shadow-sm"
        />
        <button
          data-testid="btn-analyze-ingredients"
          onClick={() => {
            // Trigger update
            setRawText(rawText);
          }}
          className="w-full h-11 bg-primary hover:opacity-90 text-white rounded-lg font-semibold text-xs tracking-wider uppercase transition shadow-sm cursor-pointer"
        >
          Phân Tích Ngay
        </button>
      </div>

      {displayedMappedList.length > 0 && (
        <div className="space-y-6">
          {/* AI Summary Card / Progress Bar */}
          {displayedStats.totalNhanDien > 0 && (
            <div className="p-5 bg-white border border-[#c0c9c0] rounded-xl space-y-4 shadow-sm">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
                Tỷ lệ thành phần nhận diện ({displayedStats.totalNhanDien} chất):
              </h3>
              
              {/* Tỷ lệ thanh tiến trình an toàn 4px */}
              <div className="h-1 w-full bg-[#e1e3de] rounded-full overflow-hidden flex">
                <div className="bg-primary" style={{ width: `${displayedStats.safePercent}%` }} title={`Safe: ${displayedStats.safePercent}%`}></div>
                <div className="bg-amber-500" style={{ width: `${displayedStats.cautionPercent}%` }} title={`Caution: ${displayedStats.cautionPercent}%`}></div>
                <div className="bg-secondary" style={{ width: `${displayedStats.dangerPercent}%` }} title={`Danger: ${displayedStats.dangerPercent}%`}></div>
              </div>
              
              <div className="flex flex-wrap gap-4 text-[10px] font-bold tracking-wider">
                <span className="text-primary uppercase">AN TOÀN: {displayedStats.safePercent}%</span>
                <span className="text-amber-600 uppercase">LƯU Ý: {displayedStats.cautionPercent}%</span>
                <span className="text-secondary uppercase">CẢNH BÁO: {displayedStats.dangerPercent}%</span>
              </div>
            </div>
          )}

          {/* Warnings List */}
          {displayedWarnings.length > 0 && (
            <div className="space-y-2">
              {displayedWarnings.map((warn, i) => (
                <div
                  key={i}
                  className="p-4 bg-red-50 border border-[#ffdad6] text-secondary rounded-xl text-xs font-medium flex items-start gap-2"
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 text-[#b62506] mt-0.5" />
                  <span>{warn}</span>
                </div>
              ))}
            </div>
          )}

          {/* Mapped Ingredient Details list */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
              Chi tiết thành phần (Bấm để xem thêm):
            </h3>
            
            <div className="grid grid-cols-1 gap-3">
              {displayedMappedList.map((ing, index) => {
                let badgeClass = "bg-gray-100 text-gray-500";
                if (ing.safetyLevel === "SAFE") {
                  badgeClass = "bg-primary text-white";
                } else if (ing.safetyLevel === "CAUTION") {
                  badgeClass = "bg-amber-500 text-white";
                } else if (ing.safetyLevel === "DANGER") {
                  badgeClass = "bg-secondary text-white";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleIngredientClick(ing)}
                    className="p-4 bg-white border border-[#e5e5e5] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full text-left hover:border-primary hover:shadow-sm transition-all cursor-pointer shadow-sm"
                  >
                    <div className="space-y-1">
                      <h4 className="font-semibold text-xs text-primary">{ing.name}</h4>
                      <p className="text-[11px] text-[#404942] line-clamp-1">{ing.description}</p>
                    </div>
                    <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full shrink-0 self-start sm:self-center uppercase tracking-widest ${badgeClass}`}>
                      {ing.safetyLevel === "UNKNOWN" ? "Mới" : ing.safetyLevel.toLowerCase()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết hoạt chất */}
      <IngredientDetailModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        ingredient={selectedIngredient}
      />
    </div>
  );
}

export default function IngredientAnalyzer() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-sm font-semibold text-primary">Đang tải bộ phân tích...</p>
      </div>
    }>
      <IngredientAnalyzerContent />
    </Suspense>
  );
}
