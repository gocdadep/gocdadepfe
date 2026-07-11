"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

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

  let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "outline";
  if (ingredient.safetyLevel === "SAFE") {
    badgeVariant = "default";
  } else if (ingredient.safetyLevel === "CAUTION") {
    badgeVariant = "secondary";
  } else if (ingredient.safetyLevel === "DANGER") {
    badgeVariant = "destructive";
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="text-xl font-extrabold text-foreground">
              {ingredient.name}
            </DialogTitle>
            <Badge variant={badgeVariant} className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0 uppercase tracking-wider">
              {ingredient.safetyLevel.toLowerCase()}
            </Badge>
          </div>
        </DialogHeader>
        <div className="mt-2 space-y-4">
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed font-normal">
            {ingredient.description || "Chưa có mô tả khoa học chi tiết cho hoạt chất này."}
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
}
