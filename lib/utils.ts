import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPerformanceColor(level: "HIGH" | "MEDIUM" | "LOW") {
  switch (level) {
    case "HIGH":
      return "text-success bg-success/20 border-success/30";
    case "MEDIUM":
      return "text-warning bg-warning/20 border-warning/30";
    case "LOW":
      return "text-danger bg-danger/20 border-danger/30";
  }
}

export function getFitScoreColor(score: number) {
  if (score >= 80) return "#22C55E";
  if (score >= 50) return "#F59E0B";
  return "#EF4444";
}

export function getRecommendationColor(rec: string) {
  switch (rec) {
    case "Strong Fit":
      return "text-success bg-success/20 border-success/30";
    case "Good Fit":
      return "text-emerald-400 bg-emerald-400/20 border-emerald-400/30";
    case "Partial Fit":
      return "text-warning bg-warning/20 border-warning/30";
    default:
      return "text-danger bg-danger/20 border-danger/30";
  }
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}
