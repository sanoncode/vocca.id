import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFlagEmoji(langCode: string): string {
  const flags: Record<string, string> = {
    en: "🇺🇸",
    id: "🇮🇩",
    ja: "🇯🇵",
    ko: "🇰🇷",
    zh: "🇨🇳",
    de: "🇩🇪",
    fr: "🇫🇷",
    es: "🇪🇸"
  };
  return flags[langCode.toLowerCase()] || "🌐";
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
