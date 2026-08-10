"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Box, ExternalLink, LoaderCircle, MousePointer2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GraveyardSplatViewer = dynamic(
  () =>
    import("@/components/families/GraveyardSplatViewer").then(
      (module) => module.GraveyardSplatViewer,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-[430px] place-items-center bg-[#08090b] text-white sm:h-[520px] lg:h-[620px]">
        <LoaderCircle className="size-8 motion-safe:animate-spin" />
      </div>
    ),
  },
);

export function GraveyardSplatSection() {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  return (
    <Card className="gap-0 overflow-hidden border-border/80 py-0 shadow-sm">
      <CardHeader className="gap-4 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-3xl space-y-2">
            <Badge variant="outline" className="gap-1.5 font-medium">
              <Box className="size-3.5" />
              Интерактивный архив
            </Badge>
            <CardTitle className="text-xl tracking-tight sm:text-2xl">
              Кладбище Цинцкаро — цифровая память
            </CardTitle>
            <p className="text-sm leading-6 text-muted-foreground sm:text-base">
              Осмотрите точную 3D-модель памятного места, где сохраняются имена
              и история многих семей нашего села.
            </p>
          </div>
          <div className="hidden shrink-0 rounded-full bg-primary/5 p-3 text-primary sm:block">
            <Box className="size-6" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isViewerOpen ? (
          <GraveyardSplatViewer />
        ) : (
          <div className="relative grid min-h-[360px] overflow-hidden bg-[#08090b] px-6 py-12 text-white sm:min-h-[430px]">
            <div
              className="absolute inset-0 opacity-80"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(circle at 72% 28%, rgba(255,255,255,0.12), transparent 30%), radial-gradient(circle at 18% 85%, rgba(148,163,184,0.12), transparent 32%), linear-gradient(145deg, #111418 0%, #070809 66%)",
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.06]"
              aria-hidden="true"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                backgroundSize: "44px 44px",
                maskImage:
                  "linear-gradient(to bottom, transparent, black 30%, black)",
              }}
            />

            <div className="relative z-10 m-auto max-w-xl text-center">
              <div className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl border border-white/15 bg-white/8 shadow-2xl backdrop-blur">
                <Box className="size-7" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                Пройдитесь по памятному месту
              </h3>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/65 sm:text-base">
                Модель открывается прямо на странице: ее можно поворачивать,
                приближать и изучать с разных сторон.
              </p>
              <Button
                type="button"
                size="lg"
                onClick={() => setIsViewerOpen(true)}
                className="mt-7 gap-2 bg-white text-black shadow-xl hover:bg-white/90"
              >
                <MousePointer2 className="size-4" />
                Открыть 3D-модель
              </Button>
              <p className="mt-3 text-xs text-white/45">
                Модель загружается частями по мере просмотра — только после нажатия
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 border-t bg-muted/30 px-5 py-4 text-xs leading-5 text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            3D-съемка:{" "}
            <a
              href="https://superspl.at/user?id=maaels"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Davit Goshadze
            </a>
            . Лицензия{" "}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              CC BY 4.0
            </a>
            .
          </p>
          <a
            href="https://superspl.at/scene/734ec011"
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline"
          >
            Источник модели
            <ExternalLink className="size-3" aria-hidden="true" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
