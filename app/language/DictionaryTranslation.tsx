import type { DictionaryEntry } from "@/lib/data/dictionary";

export function DictionaryTranslation({ entry }: { entry: DictionaryEntry }) {
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
            {entry.senses!.length > 1 && <span>{index + 1}) </span>}
            {sense.translation}
            {sense.partOfSpeech && (
              <span className="text-muted-foreground">
                {" "}
                ({sense.partOfSpeech})
              </span>
            )}
            {sense.examples.map((example, exampleIndex) => (
              <span key={`${example.phrase}-${exampleIndex}`}>
                {sense.translation || sense.partOfSpeech || exampleIndex > 0
                  ? "; "
                  : ""}
                <strong className="font-semibold">{example.phrase}</strong> —{" "}
                {example.translation}
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
