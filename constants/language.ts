export const languages = [
  { code: "id", label: "Bahasa Indonesia", badge: "ID" },
  { code: "en", label: "English", badge: "EN" },
  { code: "fr", label: "Français", badge: "FR" },
  { code: "de", label: "Deutsch", badge: "DE" },
  { code: "ja", label: "日本語 (Nihongo)", badge: "日本語" },
  { code: "ko", label: "한국어 (Hangugeo)", badge: "한국" },
  { code: "zh", label: "中文 (Zhong Wen)", badge: "中文" },
];


export const languageMap = Object.fromEntries(
  languages.map((lang) => [lang.code, {label:lang.label, badge:lang.badge}]),
);
