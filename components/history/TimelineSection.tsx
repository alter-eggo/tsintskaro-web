import type { HistoryChapter } from "@/lib/data/history";
import styles from "./history.module.css";

export default function TimelineSection({
  timeline,
}: {
  timeline: HistoryChapter[];
}) {
  return (
    <div className={styles.timeline}>
      {timeline.map((chapter, index) => (
        <section
          key={chapter.id}
          id={chapter.id}
          aria-labelledby={`${chapter.id}-title`}
          className={styles.chapter}
        >
          <div className={styles.date}>
            <span className={styles.chapterNumber}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{chapter.period}</span>
          </div>
          <div className={styles.chapterContent}>
            <header className={styles.chapterHeader}>
              <h2 id={`${chapter.id}-title`}>
                <a href={`#${chapter.id}`}>{chapter.title}</a>
              </h2>
              {chapter.note ? (
                <p className={styles.sourceLabel}>{chapter.note}</p>
              ) : null}
            </header>
            <div className={styles.prose}>
              {chapter.paragraphs.map((paragraph) => {
                const props = {
                  id: paragraph.id,
                  "data-source-id": paragraph.id,
                  className: styles.sourceParagraph,
                };
                if (paragraph.kind === "heading")
                  return (
                    <h3 key={paragraph.id} {...props}>
                      {paragraph.text}
                    </h3>
                  );
                if (paragraph.kind === "quotation")
                  return (
                    <blockquote key={paragraph.id} {...props}>
                      <p>{paragraph.text}</p>
                    </blockquote>
                  );
                return (
                  <p key={paragraph.id} {...props}>
                    {paragraph.text}
                  </p>
                );
              })}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
