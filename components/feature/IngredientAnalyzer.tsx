"use client";

import { useState, useEffect } from "react";
import ingredientsData from "@/data/ingredients.json";
import IngredientDetailModal from "@/components/feature/IngredientDetailModal";

interface MappedIngredient {
  id: string;
  name: string;
  safetyLevel: "SAFE" | "CAUTION" | "DANGER" | "UNKNOWN";
  description: string;
}

export default function IngredientAnalyzer() {
  const [rawText, setRawText] = useState("");
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
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      // 1. Tách chuỗi
      const rawItems = rawText
        .split(/,|\n/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      // 2. So khớp
      const mapped: MappedIngredient[] = rawItems.map((rawItem) => {
        const lowerItem = rawItem.toLowerCase();
        
        // Tìm kiếm trong từ điển
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

      // 3. Tính toán thống kê (%)
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

      // 4. Kiểm tra cảnh báo (BR-2)
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
        warns.push("Có chứa Paraben: Chất bảo quản nhóm Paraben, cân nhắc sử dụng nếu da quá mẫn cảm.");
      }

      setWarnings(warns);
    }, 300);

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
    <div className="w-full max-w-3xl mx-auto space-y-8 text-left">
      {/* Input Textarea */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 dark:text-zinc-300">
          Dán bảng thành phần mỹ phẩm:
        </label>
        <textarea
          data-testid="textarea-ingredients-input"
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Ví dụ: Niacinamide, Alcohol Denat., Methylparaben..."
          className="w-full h-40 p-4 rounded-2xl border border-card-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition resize-none text-sm"
        />
      </div>

      {displayedMappedList.length > 0 && (
        <div className="space-y-6">
          {/* Stats Bar */}
          {displayedStats.totalNhanDien > 0 && (
            <div className="p-6 bg-card border border-card-border rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-slate-950 dark:text-white">Tỷ lệ thành phần nhận diện ({displayedStats.totalNhanDien} chất):</h3>
              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div className="bg-[#2E7D32]" style={{ width: `${displayedStats.safePercent}%` }} title={`Safe: ${displayedStats.safePercent}%`}></div>
                <div className="bg-[#F57F17]" style={{ width: `${displayedStats.cautionPercent}%` }} title={`Caution: ${displayedStats.cautionPercent}%`}></div>
                <div className="bg-[#C62828]" style={{ width: `${displayedStats.dangerPercent}%` }} title={`Danger: ${displayedStats.dangerPercent}%`}></div>
              </div>
              <div className="flex gap-6 text-xs font-semibold">
                <span className="text-[#2E7D32]">Lành tính: {displayedStats.safePercent}%</span>
                <span className="text-[#F57F17]">Lưu ý: {displayedStats.cautionPercent}%</span>
                <span className="text-[#C62828]">Cảnh báo: {displayedStats.dangerPercent}%</span>
              </div>
            </div>
          )}

          {/* Warnings list */}
          {displayedWarnings.length > 0 && (
            <div className="space-y-2">
              {displayedWarnings.map((warn, i) => (
                <div key={i} className="p-4 bg-[#FFEBEE] border border-[#FFCDD2] text-[#C62828] rounded-xl text-xs font-semibold">
                  ⚠️ {warn}
                </div>
              ))}
            </div>
          )}

          {/* Mapped list details */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-950 dark:text-white">Chi tiết thành phần (Bấm để xem thêm):</h3>
            <div className="grid grid-cols-1 gap-3">
              {displayedMappedList.map((ing, index) => {
                let badgeClass = "bg-gray-100 text-gray-500";
                if (ing.safetyLevel === "SAFE") badgeClass = "bg-[#E8F5E9] text-[#2E7D32]";
                else if (ing.safetyLevel === "CAUTION") badgeClass = "bg-[#FFFDE7] text-[#F57F17]";
                else if (ing.safetyLevel === "DANGER") badgeClass = "bg-[#FFEBEE] text-[#C62828]";

                return (
                  <button
                    key={index}
                    onClick={() => handleIngredientClick(ing)}
                    className="p-4 bg-card border border-card-border rounded-xl flex flex-col sm:flex-row sm:items-start justify-between gap-4 w-full text-left hover:border-accent hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="space-y-1">
                      <h4 className="font-semibold text-sm text-foreground">{ing.name}</h4>
                      <p className="text-xs text-text-secondary line-clamp-1">{ing.description}</p>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 self-start sm:self-center capitalize ${badgeClass}`}>
                      {ing.safetyLevel.toLowerCase()}
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
