import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { LanguageResources } from "@/components/language/LanguageResources";

export const metadata: Metadata = {
  title: "Материалы для изучения | Язык Цинцкаро",
  description:
    "Цинцкарский алфавит, сказка-быль «Биз ёлдаш олдух!» с русским переводом и видеоматериалы для изучения языка.",
};

export default function LanguageMaterialsPage() {
  return (
    <div lang="ru" className="flex flex-col gap-6">
      <Link
        href="/language"
        className="inline-flex w-fit items-center gap-2 rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        К словарю
      </Link>
      <LanguageResources videoUrl={process.env.STORY_VIDEO_URL} />
    </div>
  );
}
