import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Calendar } from "lucide-react";
import { meryemAnaNews as news } from "@/lib/data/news";

export const metadata: Metadata = {
  title: `${news.title} | Цинцкаро`,
  description: news.excerpt,
};

export default function MeryemAnaNewsPage() {
  const cover = news.photos[0];

  return (
    <div lang="ru" className="mx-auto w-full max-w-4xl px-2 py-6 sm:px-6 lg:py-10">
      <Link
        href="/#news"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Новости на главной
      </Link>

      <article aria-labelledby="page-title">
        <header className="mb-8">
          <p className="mb-3 text-sm font-medium text-blue-700">Жизнь общины</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
            <span className="inline-flex items-center gap-2">
              <Calendar className="size-4" aria-hidden="true" />
              <time dateTime={news.eventDate}>{news.eventDateLabel}</time>
            </span>
            <span>Нижнее Цинцкаро, Грузия</span>
          </div>
          <p className="mt-6 text-lg leading-relaxed text-gray-700 sm:text-xl">
            {news.excerpt}
          </p>
        </header>

        <figure className="mb-8">
          <a
            href={cover.src}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Открыть фото встречи в полном размере (в новой вкладке)"
            className="block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
          >
            <Image
              src={cover.src}
              alt={cover.alt}
              width={cover.width}
              height={cover.height}
              sizes="(max-width: 768px) 100vw, 848px"
              preload
              className="h-auto w-full rounded-xl"
            />
          </a>
          <figcaption className="mt-3 text-sm text-gray-600">
            {cover.caption}. Фото из публикации Yagrek.
          </figcaption>
        </figure>

        <div className="space-y-5 text-base leading-relaxed text-gray-700 sm:text-lg">
          <p>
            По сообщению Yagrek, встреча прошла на стадионе во дворе старой школы.
            Приехали уроженцы села, их дети и внуки, родственники и друзья из
            Грузии, России, Греции, Германии, Швеции и Израиля.
          </p>
          <p>
            Инициативу предложили создатели канала «Цинцкаро» Янис и Елена
            Баратовы. Вместе с ними праздник организовали Роман Козьмаев и
            Эллада Князева при поддержке инициативной группы, спонсоров и
            координаторов.
          </p>
          <p>
            В музыкальной программе участвовали приглашённые из Греции
            братья Chris &amp; John Bozidis. Праздник объединил несколько
            поколений земляков: они встретились с близкими и познакомили
            детей с культурой родного села.
          </p>
          <p>
            Организаторы надеются проводить такие встречи и в дальнейшем,
            сохраняя связь между цинцкарцами, живущими в разных странах.
          </p>
        </div>

        <aside className="mt-8 border-l-2 border-blue-200 pl-4 text-sm leading-relaxed text-gray-600">
          <p>
            По материалам{" "}
            <a
              href={news.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-700 underline underline-offset-4"
            >
              публикации {news.source.name} в Facebook
              <ArrowUpRight className="ml-1 inline size-3.5" aria-hidden="true" />
            </a>
            , опубликованной{" "}
            <time dateTime={news.source.publishedDate}>
              {news.source.publishedDateLabel}
            </time>
            .
          </p>
        </aside>

        <section className="mt-12" aria-labelledby="news-photos-title">
          <h2 id="news-photos-title" className="mb-2 text-2xl font-bold text-gray-900">
            Фотографии встречи
          </h2>
          <p className="mb-6 text-sm text-gray-600">
            Нажмите на фото, чтобы открыть его в полном размере.
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            {news.photos.slice(1).map((photo) => (
              <figure key={photo.src}>
                <a
                  href={photo.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${photo.caption}: открыть в полном размере (в новой вкладке)`}
                  className="block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 267px"
                    className="h-auto w-full rounded-lg"
                  />
                </a>
                <figcaption className="mt-2 text-sm text-gray-600">
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-5 text-sm text-gray-600">Все фотографии — из публикации Yagrek.</p>
        </section>
      </article>
    </div>
  );
}
