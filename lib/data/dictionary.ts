/**
 * Types and utilities for the Urum dictionary
 */

export interface DictionarySense {
  translation: string | null;
  partOfSpeech?: string | null;
  examples: { phrase: string; translation: string; aliases?: string[] }[];
}

export interface DictionaryEntry {
  /** The Urum word */
  word: string;
  /** Russian translation */
  translation: string;
  /** Part of speech (optional) */
  partOfSpeech?: string;
  /** Additional comments (optional) */
  comments?: string;
  senses?: DictionarySense[];
  kind?: "word" | "idiom" | "proverb";
  literalTranslation?: string;
  aliases?: string[];
}

/**
 * Official Tsintskaro alphabet in correct order.
 * Includes multi-character letters: Гх, Дж, Хг
 */
export const TSINTSKARO_ALPHABET = [
  "А",
  "Â",
  "Б",
  "В",
  "Г",
  "Гх",
  "Д",
  "Дж",
  "Е",
  "Ê",
  "Ё",
  "Ж",
  "З",
  "И",
  "Û",
  "Й",
  "К",
  "Л",
  "М",
  "Н",
  "О",
  "Ô",
  "П",
  "Р",
  "С",
  "Т",
  "У",
  "Ŷ",
  "Ф",
  "Х",
  "Хг",
  "Ц",
  "Ч",
  "Ш",
  "Щ",
  "Ы",
  "Ь",
  "Э",
  "Ю",
  "Я",
] as const;

/**
 * Multi-character letters that must be checked first when
 * determining which alphabet letter a word starts with.
 * Sorted longest-first so "Гх" is matched before "Г", etc.
 */
const MULTI_CHAR_LETTERS = ["Гх", "Дж", "Хг"];

const LETTER_ORDER = new Map<string, number>();
TSINTSKARO_ALPHABET.forEach((letter, index) => {
  LETTER_ORDER.set(letter.toUpperCase(), index);
});

/**
 * Determine the Tsintskaro alphabet letter that a word starts with.
 * Handles multi-character letters like Гх, Дж, Хг.
 */
export function getWordLetter(word: string): string | null {
  if (!word) return null;
  const upper = word.normalize("NFC").toUpperCase();

  // Check multi-character letters first
  for (const ml of MULTI_CHAR_LETTERS) {
    if (upper.startsWith(ml.toUpperCase())) {
      return ml;
    }
  }

  // Fall back to single first character
  return upper[0];
}

function tokenizeWord(word: string): string[] {
  const upper = word.normalize("NFC").toUpperCase();
  const tokens: string[] = [];
  let i = 0;

  while (i < upper.length) {
    let matched = false;

    for (const ml of MULTI_CHAR_LETTERS) {
      if (upper.startsWith(ml.toUpperCase(), i)) {
        tokens.push(ml.toUpperCase());
        i += ml.length;
        matched = true;
        break;
      }
    }

    if (!matched) {
      tokens.push(upper[i]);
      i++;
    }
  }

  return tokens;
}

export function compareTsintskaroWords(a: string, b: string): number {
  const tokensA = tokenizeWord(a);
  const tokensB = tokenizeWord(b);
  const len = Math.min(tokensA.length, tokensB.length);

  for (let i = 0; i < len; i++) {
    const orderA = LETTER_ORDER.has(tokensA[i])
      ? LETTER_ORDER.get(tokensA[i])!
      : 999;
    const orderB = LETTER_ORDER.has(tokensB[i])
      ? LETTER_ORDER.get(tokensB[i])!
      : 999;

    if (orderA !== orderB) {
      return orderA - orderB;
    }
  }

  return tokensA.length - tokensB.length;
}

export function formatDictionaryWord(word: string): string {
  const [firstLetter, ...rest] = Array.from(word);

  if (!firstLetter) {
    return word;
  }

  return `${firstLetter.toUpperCase()}${rest.join("")}`;
}

export interface DictionaryMetadata {
  name: string;
  nameEn: string;
  source: string;
  lastUpdated: string;
  totalEntries: number;
}

export interface Dictionary {
  metadata: DictionaryMetadata;
  entries: DictionaryEntry[];
}

/**
 * Static dictionary JSON is no longer the source of truth.
 * Use getAllWords() from @/lib/db/words in server code instead.
 */
export async function loadDictionary(): Promise<Dictionary> {
  throw new Error(
    "Static dictionary JSON has been removed. Use getAllWords() from @/lib/db/words in server code.",
  );
}

/**
 * Search dictionary entries by word or translation
 */
export function searchDictionary(
  entries: DictionaryEntry[],
  query: string,
  options: {
    searchWord?: boolean;
    searchTranslation?: boolean;
    caseSensitive?: boolean;
  } = {},
): DictionaryEntry[] {
  const {
    searchWord = true,
    searchTranslation = true,
    caseSensitive = false,
  } = options;

  const normalizedQuery = caseSensitive
    ? query.normalize("NFC")
    : query.normalize("NFC").toLowerCase();

  return entries.filter((entry) => {
    const word = caseSensitive
      ? entry.word.normalize("NFC")
      : entry.word.normalize("NFC").toLowerCase();
    const translationText = [entry.translation, entry.literalTranslation]
      .filter(Boolean)
      .join("; ");
    const translation = caseSensitive
      ? translationText.normalize("NFC")
      : translationText.normalize("NFC").toLowerCase();

    const phrases = [
      ...(entry.aliases ?? []),
      ...(entry.senses ?? []).flatMap((s) =>
        s.examples.flatMap((e) => [e.phrase, ...(e.aliases ?? [])]),
      ),
    ];
    const exampleMatch = phrases.some((phrase) =>
      (caseSensitive
        ? phrase.normalize("NFC")
        : phrase.normalize("NFC").toLowerCase()
      ).includes(normalizedQuery),
    );
    return (
      (searchWord && (word.includes(normalizedQuery) || exampleMatch)) ||
      (searchTranslation && translation.includes(normalizedQuery))
    );
  });
}

/**
 * Filter dictionary by part of speech
 */
export function filterByPartOfSpeech(
  entries: DictionaryEntry[],
  partOfSpeech: string,
): DictionaryEntry[] {
  return entries.filter(
    (entry) => entry.partOfSpeech?.toLowerCase() === partOfSpeech.toLowerCase(),
  );
}

/**
 * Get all unique parts of speech from the dictionary
 */
export function getPartsOfSpeech(entries: DictionaryEntry[]): string[] {
  const parts = new Set<string>();
  entries.forEach((entry) => {
    if (entry.partOfSpeech) {
      parts.add(entry.partOfSpeech);
    }
  });
  return Array.from(parts).sort();
}

/**
 * Get dictionary entries starting with a specific Tsintskaro alphabet letter.
 * Handles multi-character letters like Гх, Дж, Хг.
 */
export function getEntriesByLetter(
  entries: DictionaryEntry[],
  letter: string,
): DictionaryEntry[] {
  return entries.filter((entry) => getWordLetter(entry.word) === letter);
}

/**
 * Get the official Tsintskaro alphabet, optionally filtered to only
 * letters that have at least one word in the given entries.
 */
export function getAlphabet(
  entries?: DictionaryEntry[],
  onlyWithEntries = false,
): string[] {
  if (!onlyWithEntries || !entries) {
    return [...TSINTSKARO_ALPHABET];
  }

  const usedLetters = new Set<string>();
  entries.forEach((entry) => {
    const letter = getWordLetter(entry.word);
    if (letter) usedLetters.add(letter);
  });

  return TSINTSKARO_ALPHABET.filter((letter) => usedLetters.has(letter));
}
