import { LanguageClient } from "@/app/language/LanguageClient";
import { compareTsintskaroWords } from "@/lib/data/dictionary";
import { getAllWords } from "@/lib/db/words";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function LanguagePage() {
  const entries = (await getAllWords()).sort((a, b) =>
    compareTsintskaroWords(a.word, b.word)
  );

  return <LanguageClient entries={entries} />;
}
