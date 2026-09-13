"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { meryemAnaNews } from "@/lib/data/news";

const pageTitles: Record<string, string> = {
  "/": "Главная",
  "/history": "История Цинцкаро",
  "/history/original": "История Цинцкаро — сплошной текст",
  "/history/people": "Люди и судьбы",
  "/history/people/urus": "Урус",
  "/history/urus": "Урус",
  "/gallery": "Галерея",
  "/about": "Об Обществе",
  "/traditions": "Традиции",
  "/families": "Фамилии",
  "/language": "Язык",
  "/language/materials": "Материалы для изучения",
  "/education": "Образование",
  "/leisure": "Досуг",
  "/games": "Игры",
  "/population": "Население",
  "/census": "Данные переписи",
  "/census-form": "Форма переписи населения",
  "/settings": "Настройки системы",
  [meryemAnaNews.href]: meryemAnaNews.title,
};

export function AppHeader() {
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Цинцкаро";

  return (
    <header className="flex min-h-16 shrink-0 items-center justify-between gap-3 border-b px-4 py-2">
      <h1 id="page-title" className="min-w-0 text-lg font-semibold leading-snug break-words">
        {title}
      </h1>
      <SidebarTrigger className="size-10 shrink-0" />
    </header>
  );
}
