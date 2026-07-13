"use client";

import Image from "next/image";
import { useState } from "react";
import {
  BookOpenText,
  Download,
  ExternalLink,
  FileText,
  Film,
  Play,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ALPHABET_PDF = "/materials/tsintskaro-alphabet.pdf";
const STORY_PDF = "/materials/biz-yoldash-oldukh.pdf";
const VIDEO_POSTER = "/materials/story-video-poster.webp";

type VideoSource =
  | { type: "embed"; src: string }
  | { type: "file"; src: string }
  | { type: "external"; src: string }
  | null;

function getVideoSource(videoUrl?: string): VideoSource {
  if (!videoUrl?.trim()) return null;

  try {
    const url = new URL(videoUrl);
    const hostname = url.hostname.replace(/^www\./, "");

    if (hostname === "youtu.be") {
      const videoId = url.pathname.split("/").filter(Boolean)[0];
      if (videoId) {
        return {
          type: "embed",
          src: `https://www.youtube-nocookie.com/embed/${videoId}`,
        };
      }
    }

    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      const pathParts = url.pathname.split("/").filter(Boolean);
      const videoId =
        url.searchParams.get("v") ||
        (pathParts[0] === "shorts" || pathParts[0] === "embed"
          ? pathParts[1]
          : null);

      if (videoId) {
        return {
          type: "embed",
          src: `https://www.youtube-nocookie.com/embed/${videoId}`,
        };
      }
    }

    if (hostname === "vimeo.com" || hostname === "player.vimeo.com") {
      const videoId = url.pathname.split("/").filter(Boolean).at(-1);
      if (videoId && /^\d+$/.test(videoId)) {
        return {
          type: "embed",
          src: `https://player.vimeo.com/video/${videoId}`,
        };
      }
    }

    if (/\.(mp4|webm|ogg)$/i.test(url.pathname)) {
      return { type: "file", src: url.toString() };
    }

    return { type: "external", src: url.toString() };
  } catch {
    return null;
  }
}

function ResourcePreview({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <div className="relative aspect-video overflow-hidden border-b bg-muted">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 100vw"
        className="object-cover object-top"
      />
    </div>
  );
}

function PdfActions({ href, filename }: { href: string; filename: string }) {
  return (
    <div className="flex flex-wrap gap-2 pt-2">
      <Button asChild size="sm">
        <a href={href} target="_blank" rel="noreferrer">
          <ExternalLink />
          Открыть
        </a>
      </Button>
      <Button asChild size="sm" variant="outline">
        <a href={href} download={filename}>
          <Download />
          Скачать
        </a>
      </Button>
    </div>
  );
}

export function LanguageResources({ videoUrl }: { videoUrl?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoSource = getVideoSource(videoUrl);

  return (
    <section className="space-y-4" aria-labelledby="language-resources-title">
      <div>
        <h3
          id="language-resources-title"
          className="flex items-center gap-2 text-xl font-semibold"
        >
          <BookOpenText className="h-5 w-5" />
          Материалы для изучения
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Алфавит, чтение и видеоматериалы на цинцкарском языке
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="overflow-hidden">
          <ResourcePreview
            src="/materials/alphabet-preview.webp"
            alt="Превью цинцкарского алфавита"
          />
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <Badge variant="secondary">2 страницы</Badge>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardTitle className="text-lg">Цинцкарский алфавит</CardTitle>
            <CardDescription>
              Буквы, примеры слов и особенности артикуляции звуков.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PdfActions href={ALPHABET_PDF} filename="Цинцкарский алфавит.pdf" />
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <ResourcePreview
            src="/materials/story-preview.webp"
            alt="Превью сказки Биз ёлдаш олдух"
          />
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <Badge variant="secondary">27 страниц</Badge>
              <BookOpenText className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardTitle className="text-lg">
              Сказка-быль «Биз ёлдаш олдух!»
            </CardTitle>
            <CardDescription>
              Иллюстрированная история на цинцкарском языке с русским переводом.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PdfActions
              href={STORY_PDF}
              filename="Сказка-быль Биз ёлдаш олдух.pdf"
            />
          </CardContent>
        </Card>

        <Card className="overflow-hidden md:col-span-2 xl:col-span-1">
          <div className="relative aspect-video overflow-hidden border-b bg-black">
            {videoSource?.type === "embed" && isPlaying ? (
              <iframe
                src={`${videoSource.src}?autoplay=1`}
                title="Видеоверсия сказки Биз ёлдаш олдух"
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : videoSource?.type === "file" ? (
              <video
                controls
                preload="none"
                poster={VIDEO_POSTER}
                className="h-full w-full object-cover"
              >
                <source src={videoSource.src} />
              </video>
            ) : (
              <>
                <Image
                  src={VIDEO_POSTER}
                  alt="Обложка видеоверсии сказки Биз ёлдаш олдух"
                  fill
                  sizes="(min-width: 1280px) 30vw, 100vw"
                  className="object-cover"
                />
                {videoSource?.type === "embed" && (
                  <button
                    type="button"
                    onClick={() => setIsPlaying(true)}
                    aria-label="Воспроизвести видеоверсию сказки"
                    className="absolute inset-0 flex items-center justify-center bg-black/15 transition-colors hover:bg-black/25 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                  >
                    <span className="flex size-14 items-center justify-center rounded-full bg-white/95 text-black shadow-lg">
                      <Play className="ml-1 size-6 fill-current" />
                    </span>
                  </button>
                )}
              </>
            )}
          </div>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <Badge variant={videoSource ? "secondary" : "outline"}>
                {videoSource ? "6 минут 42 секунды" : "Скоро"}
              </Badge>
              <Film className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardTitle className="text-lg">Видеоверсия сказки</CardTitle>
            <CardDescription>
              Анимационная история общества «Цинцкаро» по мотивам сказки.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {videoSource?.type === "external" ? (
              <Button asChild size="sm">
                <a href={videoSource.src} target="_blank" rel="noreferrer">
                  <ExternalLink />
                  Смотреть видео
                </a>
              </Button>
            ) : !videoSource ? (
              <p className="text-sm text-muted-foreground">
                Видеоверсия скоро появится здесь.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Видео загружается только после запуска и не хранится на сайте.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
