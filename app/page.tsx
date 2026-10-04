import {
  Calendar,
  Users,
  Eye,
  Image as ImageIcon,
  ArrowRight,
  Languages,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { historyPeople } from "@/lib/data/history-people";
import { meryemAnaNews } from "@/lib/data/news";
import styles from "./home.module.css";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className={styles.hero} aria-labelledby="home-title">
        <figure className={styles.heroVisual}>
          <Image
            src="/images/tsintskaro-road-sign.jpg"
            alt="Въездной знак Цинцкаро с надписями на грузинском и латиницей на фоне дороги, полей и гор."
            fill
            sizes="(min-width: 1056px) 56vw, 100vw"
            preload
            className={styles.heroImage}
          />
        </figure>
        <div className={styles.heroContent}>
          <div className={styles.heroCopy}>
            <h2 id="home-title" className={styles.heroTitle}>
              Цинцкаро
            </h2>
            <p className={styles.heroDescription}>
              Информационный сайт для греков из села Цинцкаро. История, семьи,
              традиции и связь с родиной.
            </p>
            <div className={styles.heroActions}>
              <Button asChild className={styles.primaryAction}>
                <Link href="/language">
                  <Languages className="size-5" aria-hidden="true" />
                  Язык Цинцкаро
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className={styles.secondaryAction}
              >
                <Link href="/history">История села</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className={styles.secondaryAction}
              >
                <Link href="/families">Семейный справочник</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section id="news" aria-labelledby="news-heading" className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="mb-8">
            <h2 id="news-heading" className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Новости и события
            </h2>
            <p className="text-gray-600">
              Информация о жизни общины и важных событиях
            </p>
          </div>

          <article className="overflow-hidden rounded-xl border bg-white shadow-sm md:grid md:grid-cols-2">
            <Link
              href={meryemAnaNews.href}
              aria-label={meryemAnaNews.title}
              className="relative block min-h-0 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-blue-600"
            >
              <Image
                src={meryemAnaNews.photos[0].src}
                alt={meryemAnaNews.photos[0].alt}
                width={meryemAnaNews.photos[0].width}
                height={meryemAnaNews.photos[0].height}
                sizes="(max-width: 768px) 100vw, 544px"
                className="h-full w-full object-cover"
              />
            </Link>
            <div className="flex flex-col justify-center p-6 lg:p-8">
              <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="size-4" aria-hidden="true" />
                <time dateTime={meryemAnaNews.eventDate}>
                  {meryemAnaNews.eventDateLabel}
                </time>
              </div>
              <h3 className="mb-3 text-xl font-bold leading-snug text-gray-900 lg:text-2xl">
                <Link href={meryemAnaNews.href} className="hover:text-blue-700 hover:underline">
                  {meryemAnaNews.title}
                </Link>
              </h3>
              <p className="mb-5 leading-relaxed text-gray-600">
                {meryemAnaNews.excerpt}
              </p>
              <p className="mb-5 text-sm text-gray-500">
                По материалам {meryemAnaNews.source.name} · {meryemAnaNews.photos.length} фото
              </p>
              <Link
                href={meryemAnaNews.href}
                className="inline-flex min-h-11 items-center gap-2 self-start font-medium text-blue-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                Читать далее
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* Honor Board Section */}
      <section
        id="notable-people"
        aria-labelledby="notable-people-title"
        className="py-12 lg:py-16 bg-gradient-to-br from-blue-50 to-gray-50"
      >
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2
              id="notable-people-title"
              className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2"
            >
              Известные земляки
            </h2>
            <p className="text-gray-600">
              Люди из Цинцкаро, внесшие вклад в развитие общины
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {historyPeople.map((person) => (
              <Link
                key={person.slug}
                href={`/history/people/${person.slug}`}
                className="group text-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
              >
                <Image
                  {...person.portrait}
                  alt=""
                  sizes="96px"
                  className="w-24 h-24 rounded-full object-cover object-top mx-auto mb-4"
                />
                <h3 className="font-bold text-lg">{person.name}</h3>
                <p className="text-sm text-gray-600 mt-1 mb-3">
                  {person.fullName}
                </p>
                <p className="text-sm text-gray-600">{person.description}</p>
                <span className="inline-flex items-center gap-2 min-h-11 mt-3 text-sm text-blue-600 group-hover:underline underline-offset-4">
                  Читать историю <ArrowRight size={16} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Статистика общины
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Eye,
                color: "blue",
                number: "1,247",
                label: "Посетителей сайта",
              },
              {
                icon: Users,
                color: "green",
                number: "156",
                label: "Семей в базе",
              },
              {
                icon: Calendar,
                color: "purple",
                number: "12",
                label: "Встреч в год",
              },
              {
                icon: ImageIcon,
                color: "orange",
                number: "2,432",
                label: "Фотографий",
              },
            ].map((stat, index) => (
              <div key={index} className="text-center bg-white rounded-lg p-6">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 bg-${stat.color}-100 rounded-lg mb-4`}
                >
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Gallery Section */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Фотогалерея
            </h2>
            <p className="text-gray-600">Исторические фотографии и документы</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg overflow-hidden group cursor-pointer relative"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-sm font-medium">
                    {index === 0 && "Цинцкаро 1950-е годы"}
                    {index === 1 && "Семейные фотографии"}
                    {index === 2 && "Школьные годы"}
                    {index === 3 && "Традиционные праздники"}
                    {index === 4 && "Работа в колхозе"}
                    {index === 5 && "Встречи земляков"}
                    {index === 6 && "Документы и справки"}
                    {index === 7 && "Современные встречи"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-12 lg:py-16 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Разделы сайта
            </h2>
            <p className="text-gray-600">
              Основные разделы информационного сайта
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                emoji: "📖",
                title: "История села",
                description: "Исторические материалы о Цинцкаро",
                href: "/history",
              },
              {
                emoji: "👨‍👩‍👧‍👦",
                title: "Семейный справочник",
                description: "База данных семей из Цинцкаро",
                href: "/families",
              },
              {
                emoji: "📷",
                title: "Фотогалерея",
                description: "Архивные фотографии и документы",
                href: "/gallery",
              },
              {
                emoji: "🎭",
                title: "Традиции",
                description: "Культурное наследие греков",
                href: "/traditions",
              },
            ].map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:border-blue-500 hover:shadow-md transition-all duration-200 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                  {link.emoji}
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
                  {link.title}
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                </h3>
                <p className="text-sm text-gray-600">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">Ц</span>
                </div>
                <span className="text-xl font-bold">Цинцкаро</span>
              </div>
              <p className="text-gray-400 text-sm">
                Информационный сайт для греков из села Цинцкаро. История, семьи,
                традиции и связь с родиной.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Разделы</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/society"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    О нас
                  </Link>
                </li>
                <li>
                  <Link
                    href="/history"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    История
                  </Link>
                </li>
                <li>
                  <Link
                    href="/families"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Семьи
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gallery"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Галерея
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Ресурсы</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/traditions"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Традиции
                  </Link>
                </li>
                <li>
                  <Link
                    href="/education"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Образование
                  </Link>
                </li>
                <li>
                  <Link
                    href="/leisure"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Досуг
                  </Link>
                </li>
                <li>
                  <Link
                    href="/games"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Игры
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Контакты</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>info@tsintskaro.org</p>
                <p>+7 (XXX) XXX-XX-XX</p>
                <p>Москва, Россия</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>
              &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
              Информационный сайт Цинцкаро. Все права защищены.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
