import type { DictionaryEntry } from "@/lib/data/dictionary";
import { formatDictionaryWord } from "@/lib/data/dictionary";
import { Fragment } from "react";
import { TableCell, TableRow } from "@/components/ui/table";

export function DictionaryTranslation({
  entry,
  number,
}: {
  entry: DictionaryEntry;
  number?: number;
}) {
  return (
    <div className="space-y-1.5 leading-relaxed [overflow-wrap:anywhere]">
      {entry.literalTranslation && (
        <p>
          <span className="text-muted-foreground">Буквально: </span>
          {entry.literalTranslation}
        </p>
      )}
      {entry.senses?.length ? (
        entry.senses.map((sense, index) => (
          <div key={index}>
            {(number != null || entry.senses!.length > 1) && (
              <span>{number ?? index + 1}) </span>
            )}
            {sense.translation ?? (
              <span className="text-muted-foreground">Перевод уточняется</span>
            )}
            {sense.examples.map((example, exampleIndex) => (
              <span key={`${example.phrase}-${exampleIndex}`}>
                {"; "}
                <strong className="font-semibold">
                  {example.phrase}
                </strong> — {example.translation}
              </span>
            ))}
          </div>
        ))
      ) : (
        <p>{entry.translation}</p>
      )}
    </div>
  );
}

/** Real table rows keep each grammatical label aligned even when examples wrap. */
export function DictionaryRows({ entry }: { entry: DictionaryEntry }) {
  const senses = entry.senses?.length
    ? entry.senses
    : [{ translation: entry.translation, examples: [] }];
  const kind =
    entry.kind === "idiom"
      ? "Фразеологизм"
      : entry.kind === "proverb"
        ? "Пословица/поговорка"
        : null;
  return (
    <Fragment>
      {senses.map((sense, index) => {
        const part = sense.partOfSpeech ?? entry.partOfSpeech;
        return (
          <TableRow key={index}>
            {index === 0 && (
              <TableCell
                rowSpan={senses.length}
                className="align-top font-medium [overflow-wrap:anywhere]"
              >
                {formatDictionaryWord(entry.word)}
              </TableCell>
            )}
            <TableCell className="align-top [overflow-wrap:anywhere]">
              <DictionaryTranslation
                entry={{
                  ...entry,
                  senses: [sense],
                  literalTranslation:
                    index === 0 ? entry.literalTranslation : undefined,
                }}
                number={senses.length > 1 ? index + 1 : undefined}
              />
              {(part || (index === 0 && kind)) && (
                <div className="mt-1 space-y-1 text-xs text-muted-foreground sm:hidden">
                  {part && <p>Часть речи: {part}</p>}
                  {index === 0 && kind && <p>Тип записи: {kind}</p>}
                </div>
              )}
            </TableCell>
            <TableCell className="hidden align-top [overflow-wrap:anywhere] sm:table-cell">
              {part && <div>{part}</div>}
              {index === 0 && kind && (
                <div
                  className={
                    part
                      ? "mt-1 text-muted-foreground"
                      : "text-muted-foreground"
                  }
                >
                  {kind}
                </div>
              )}
              {!part && !(index === 0 && kind) && (
                <span
                  className="text-muted-foreground"
                  aria-label="Помета не указана"
                >
                  —
                </span>
              )}
            </TableCell>
          </TableRow>
        );
      })}
    </Fragment>
  );
}
