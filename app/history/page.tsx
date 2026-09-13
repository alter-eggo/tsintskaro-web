import type { Metadata } from "next";
import { ArrowDown, ArrowUp, ArrowUpRight, Download } from "lucide-react";
import Link from "next/link";
import TimelineSection from "@/components/history/TimelineSection";
import { historyTimeline } from "@/lib/data/history";
import styles from "@/components/history/history.module.css";

export const metadata: Metadata = {
  title: "История Цинцкаро",
  description:
    "История села Цинцкаро: переселение в Цинцкаро, жизнь села, церковь, школа и семейные истории.",
};

const milestones = [
  ["origins", "Истоки"],
  ["settlement", "1813–1814"],
  ["petition", "1822"],
  ["beshtasheni", "1829–1830"],
  ["sakalidze", "Семьи"],
  ["school", "Церковь и школа"],
  ["pontus", "1914–1923"],
  ["pasinler", "2025"],
] as const;

export default function HistoryPage() {
  return (
    <div id="history-top" lang="ru" className={styles.page}>
      <nav aria-label="Ключевые даты истории" className={styles.milestones}>
        {milestones.map(([id, label]) => (
          <a key={id} href={`#${id}`}>
            {label}
          </a>
        ))}
        <a href="#history-chapter-links">
          Все главы <ArrowDown size={14} aria-hidden="true" />
        </a>
      </nav>
      <details id="history-contents" className={styles.contents}>
        <summary>
          Оглавление <span>{historyTimeline.length} глав</span>
        </summary>
        <nav id="history-chapter-links" aria-label="Все главы истории">
          <ol>
            {historyTimeline.map((chapter) => (
              <li key={chapter.id}>
                <a href={`#${chapter.id}`}>
                  <span>{chapter.period}</span>
                  {chapter.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </details>
      <article aria-label="История села Цинцкаро">
        <TimelineSection timeline={historyTimeline} />
      </article>
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <Link href="/history/original" className={styles.textLink}>
            Читать сплошным текстом{" "}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <a
            href="/history/tsintskaro-history.txt"
            download
            className={styles.textLink}
          >
            Скачать текст <Download size={16} aria-hidden="true" />
          </a>
          <a href="#history-top" className={styles.textLink}>
            Наверх <ArrowUp size={16} aria-hidden="true" />
          </a>
        </div>
      </footer>
    </div>
  );
}
