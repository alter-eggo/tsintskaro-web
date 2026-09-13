import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { historyPeople } from "@/lib/data/history-people";
import styles from "@/components/history/history.module.css";

export const metadata: Metadata = {
  title: "Люди и судьбы | История Цинцкаро",
  description:
    "Люди, чьи судьбы связаны с Цинцкаро: портреты, семейные воспоминания и отдельные исторические очерки.",
};

export default function HistoryPeoplePage() {
  return (
    <div lang="ru" className={styles.page}>
      <Link href="/history" className={styles.textLink}>
        <ArrowLeft size={16} aria-hidden="true" /> История Цинцкаро
      </Link>
      <header className={styles.peopleHeader}>
        <p>Жизнь Цинцкаро в историях его людей.</p>
      </header>
      <ul className={styles.peopleGrid} aria-label="Люди Цинцкаро">
        {historyPeople.map((person) => (
          <li key={person.slug}>
            <Link
              href={`/history/people/${person.slug}`}
              className={styles.personCard}
            >
              <Image
                {...person.portrait}
                alt=""
                sizes="(max-width: 640px) calc(100vw - 48px), 320px"
                className={styles.personCardPortrait}
              />
              <div className={styles.personCardContent}>
                <h2>{person.name}</h2>
                <p className={styles.personFullName}>{person.fullName}</p>
                <p className={styles.personDescription}>{person.description}</p>
                <span className={styles.storyReadMore}>
                  Читать историю <ArrowRight size={16} aria-hidden="true" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
