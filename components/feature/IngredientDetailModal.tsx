"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface IngredientDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  ingredient: {
    name: string;
    safetyLevel: string;
    description: string;
  } | null;
}

export default function IngredientDetailModal({
  isOpen,
  onOpenChange,
  ingredient,
}: IngredientDetailModalProps) {
  if (!ingredient) return null;

  let badgeClass = "bg-slate-100 text-slate-800";
  if (ingredient.safetyLevel === "SAFE") {
    badgeClass = "bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400";
  } else if (ingredient.safetyLevel === "CAUTION") {
    badgeClass = "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-450";
  } else if (ingredient.safetyLevel === "DANGER") {
    badgeClass = "bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400";
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6">
        <DialogHeader className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="text-xl font-extrabold text-slate-950 dark:text-white">
              {ingredient.name}
            </DialogTitle>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 uppercase tracking-wider ${badgeClass}`}>
              {ingredient.safetyLevel.toLowerCase()}
            </span>
          </div>
        </DialogHeader>
        <div className="mt-2 space-y-4">
          <DialogDescription className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-normal">
            {ingredient.description || "Chưa có mô tả khoa học chi tiết cho hoạt chất này."}
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
}
