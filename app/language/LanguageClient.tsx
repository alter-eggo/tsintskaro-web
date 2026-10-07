"use client";

import { FormEvent, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpenText,
  BookText,
  Hash,
  Languages,
  Loader2,
  Plus,
  Search,
} from "lucide-react";

import { addDictionaryWord } from "@/app/language/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  TSINTSKARO_ALPHABET,
  searchDictionary,
  formatDictionaryWord,
  getWordLetter,
} from "@/lib/data/dictionary";
import type { DictionaryEntry } from "@/lib/data/dictionary";

const ITEMS_PER_PAGE = 50;
const ADD_WORD_PASSWORD = "Цинцкаро2026";
const ADD_WORD_PASSWORD_STORAGE_KEY = "tsintskaro:add-word-password";

const PART_OF_SPEECH_OPTIONS = [
  { value: "none", label: "—" },
  { value: "сущ.", label: "сущ." },
  { value: "гл.", label: "гл." },
  { value: "прил.", label: "прил." },
  { value: "нар.", label: "нар." },
  { value: "мест.", label: "мест." },
  { value: "межд.", label: "межд." },
  { value: "предл.", label: "предл." },
  { value: "союз", label: "союз" },
  { value: "числ.", label: "числ." },
  { value: "част.", label: "част." },
] as const;

type LanguageClientProps = {
  entries: DictionaryEntry[];
};

type FormStatus =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null;

function normalizePartOfSpeech(partOfSpeech: string | undefined) {
  return partOfSpeech?.toLowerCase().trim().replace(/\.$/, "");
}

function matchesPartOfSpeech(
  entry: DictionaryEntry,
  variants: string[]
): boolean {
  const normalized = normalizePartOfSpeech(entry.partOfSpeech);

  if (!normalized) {
    return false;
  }

  return variants.includes(normalized);
}

export function LanguageClient({ entries }: LanguageClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [partOfSpeech, setPartOfSpeech] = useState("none");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<FormStatus>(null);

  const lettersWithEntries = useMemo(() => {
    const usedLetters = new Set<string>();
    entries.forEach((entry) => {
      const letter = getWordLetter(entry.word);
      if (letter) usedLetters.add(letter);
    });
    return usedLetters;
  }, [entries]);

  const filteredEntries = useMemo(() => {
    let result = entries;

    if (selectedLetter) {
      result = result.filter(
        (entry) => getWordLetter(entry.word) === selectedLetter
      );
    }

    if (searchQuery.trim()) {
      result = searchDictionary(result, searchQuery.trim());
    }

    return result;
  }, [entries, searchQuery, selectedLetter]);

  const paginatedEntries = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEntries.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredEntries, currentPage]);

  const totalPages = Math.ceil(filteredEntries.length / ITEMS_PER_PAGE);

  const stats = {
    totalWords: entries.length,
    nouns: entries.filter((entry) =>
      matchesPartOfSpeech(entry, ["сущ", "существительное", "существительные"])
    ).length,
    verbs: entries.filter((entry) =>
      matchesPartOfSpeech(entry, ["гл", "глагол"])
    ).length,
    adjectives: entries.filter((entry) =>
      matchesPartOfSpeech(entry, ["прил", "прилагательное", "прилагательный"])
    ).length,
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(selectedLetter === letter ? null : letter);
    setCurrentPage(1);
  };

  const resetForm = () => {
    setWord("");
    setTranslation("");
    setPartOfSpeech("none");
  };

  const hasStoredAddWordPassword = () => {
    try {
      return (
        window.localStorage.getItem(ADD_WORD_PASSWORD_STORAGE_KEY) ===
        ADD_WORD_PASSWORD
      );
    } catch {
      return false;
    }
  };

  const handleAddWordClick = () => {
    setFormStatus(null);

    if (hasStoredAddWordPassword()) {
      setIsDialogOpen(true);
      return;
    }

    setPassword("");
    setPasswordError("");
    setIsPasswordDialogOpen(true);
  };

  const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password.trim() !== ADD_WORD_PASSWORD) {
      setPasswordError("Неверный пароль");
      return;
    }

    try {
      window.localStorage.setItem(
        ADD_WORD_PASSWORD_STORAGE_KEY,
        ADD_WORD_PASSWORD
      );
    } catch {
      // If localStorage is unavailable, still allow this session after a valid password.
    }

    setPassword("");
    setPasswordError("");
    setIsPasswordDialogOpen(false);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormStatus(null);
    setIsSubmitting(true);

    try {
      const result = await addDictionaryWord({
        word,
        translation,
        partOfSpeech: partOfSpeech === "none" ? null : partOfSpeech,
      });

      resetForm();
      setFormStatus({
        type: "success",
        message: result.created ? "Слово добавлено" : "Слово обновлено",
      });
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      setFormStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Не удалось сохранить слово",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-end">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="outline">
            <Link href="/language/materials">
              <BookOpenText className="h-4 w-4" />
              Материалы для изучения
            </Link>
          </Button>
          <Button onClick={handleAddWordClick}>
            <Plus className="h-4 w-4" />
            Добавить слово
          </Button>
        </div>

        <Dialog
          open={isPasswordDialogOpen}
          onOpenChange={(open) => {
            setIsPasswordDialogOpen(open);
            if (!open) {
              setPassword("");
              setPasswordError("");
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Введите пароль</DialogTitle>
              <DialogDescription className="sr-only">
                Введите пароль, чтобы открыть форму добавления слова.
              </DialogDescription>
            </DialogHeader>

            <form className="space-y-4" onSubmit={handlePasswordSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="add-word-password">
                  Пароль
                </label>
                <Input
                  id="add-word-password"
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setPasswordError("");
                  }}
                  autoComplete="current-password"
                  autoFocus
                  required
                />
              </div>

              {passwordError && (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {passwordError}
                </p>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsPasswordDialogOpen(false)}
                >
                  Отмена
                </Button>
                <Button type="submit">Продолжить</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (open) {
              setFormStatus(null);
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить слово</DialogTitle>
              <DialogDescription className="sr-only">
                Введите слово, перевод и часть речи.
              </DialogDescription>
            </DialogHeader>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="word">
                  Слово
                </label>
                <Input
                  id="word"
                  value={word}
                  onChange={(event) => setWord(event.target.value)}
                  maxLength={255}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="translation">
                  Перевод
                </label>
                <Textarea
                  id="translation"
                  value={translation}
                  onChange={(event) => setTranslation(event.target.value)}
                  className="min-h-32 resize-y"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="partOfSpeech">
                  Часть речи
                </label>
                <Select value={partOfSpeech} onValueChange={setPartOfSpeech}>
                  <SelectTrigger id="partOfSpeech" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PART_OF_SPEECH_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formStatus && (
                <p
                  className={cn(
                    "rounded-md border px-3 py-2 text-sm",
                    formStatus.type === "success"
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-destructive/30 bg-destructive/10 text-destructive"
                  )}
                >
                  {formStatus.message}
                </p>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Закрыть
                </Button>
                <Button type="submit" disabled={isSubmitting || isPending}>
                  {(isSubmitting || isPending) && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  Сохранить
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <BookText className="h-4 w-4" />
          <strong className="text-foreground">{stats.totalWords}</strong> слов
        </span>
        <span className="flex items-center gap-1.5">
          <Hash className="h-4 w-4" />
          <strong className="text-foreground">{stats.nouns}</strong> сущ.
        </span>
        <span className="flex items-center gap-1.5">
          <Languages className="h-4 w-4" />
          <strong className="text-foreground">{stats.verbs}</strong> глаг.
        </span>
        <span className="flex items-center gap-1.5">
          <Languages className="h-4 w-4" />
          <strong className="text-foreground">{stats.adjectives}</strong> прил.
        </span>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Введите слово для поиска на любом языке"
              value={searchQuery}
              onChange={(event) => handleSearchChange(event.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-1">
            {TSINTSKARO_ALPHABET.map((letter) => {
              const hasEntries = lettersWithEntries.has(letter);

              return (
                <button
                  key={letter}
                  onClick={() => handleLetterClick(letter)}
                  className={cn(
                    "h-8 rounded-md text-sm font-medium transition-colors",
                    letter.length > 1 ? "w-10" : "w-8",
                    selectedLetter === letter
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80",
                    !hasEntries &&
                      selectedLetter !== letter &&
                      "text-muted-foreground/50"
                  )}
                >
                  {letter}
                </button>
              );
            })}
            {selectedLetter && (
              <button
                onClick={() => {
                  setSelectedLetter(null);
                  setCurrentPage(1);
                }}
                className="ml-2 h-8 rounded-md bg-destructive/10 px-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20"
              >
                Сбросить
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col gap-2 text-lg sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-center gap-2">
              <BookText className="h-5 w-5" />
              Словарь
            </span>
            <span className="text-sm font-normal text-muted-foreground">
              Показано {paginatedEntries.length} из {filteredEntries.length}{" "}
              слов
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEntries.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Слово</TableHead>
                    <TableHead>Перевод</TableHead>
                    <TableHead className="w-[180px]">Часть речи</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedEntries.map((entry, index) => (
                    <TableRow key={`${entry.word}-${index}`}>
                      <TableCell className="font-medium">
                        {formatDictionaryWord(entry.word)}
                      </TableCell>
                      <TableCell>{entry.translation}</TableCell>
                      <TableCell>
                        {entry.partOfSpeech && (
                          <Badge variant="secondary">
                            {entry.partOfSpeech}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    disabled={currentPage === 1}
                    className="rounded-md bg-muted px-3 py-1 text-sm font-medium hover:bg-muted/80 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Назад
                  </button>
                  <span className="text-sm text-muted-foreground">
                    Страница {currentPage} из {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="rounded-md bg-muted px-3 py-1 text-sm font-medium hover:bg-muted/80 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Вперёд
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <BookText className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">Слова не найдены</h3>
              <p className="text-center text-muted-foreground">
                Попробуйте изменить поисковый запрос или выберите другую букву
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
