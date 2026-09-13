import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { historyParagraphs } from "@/lib/data/history";
import styles from "@/components/history/history.module.css";

export const metadata: Metadata = {
  title: "История Цинцкаро — сплошной текст",
  description:
    "История села Цинцкаро: переселение, жизнь села, церковь, школа и семейные истории.",
};

export default function OriginalHistoryPage() {
  return (
    <div lang="ru" className={`${styles.page} ${styles.original}`}>
      <Link href="/history" className={styles.textLink}>
        <ArrowLeft size={16} aria-hidden="true" /> К ленте дат
      </Link>
      <header className={styles.originalHeader}>
        <h1>История Цинцкаро</h1>
        <a
          href="/history/tsintskaro-history.txt"
          download
          className={styles.textLink}
        >
          Скачать текст <Download size={16} aria-hidden="true" />
        </a>
      </header>
      <article aria-label="История села Цинцкаро" className={styles.prose}>
        {historyParagraphs.map((paragraph) =>
          paragraph.kind === "heading" ? (
            <h2 key={paragraph.id} data-source-id={paragraph.id}>
              {paragraph.text}
            </h2>
          ) : (
            <p key={paragraph.id} data-source-id={paragraph.id}>
              {paragraph.text}
            </p>
          ),
        )}
      </article>
      <footer className={styles.originalFooter}>
        <Link href="/history" className={styles.textLink}>
          <ArrowLeft size={16} aria-hidden="true" /> Вернуться к ленте дат
        </Link>
      </footer>
    </div>
  );
}
