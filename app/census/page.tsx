"use client";

import { useState } from "react";
import {
  BarChart3,
  Users,
  TrendingUp,
  MapPin,
  Calendar,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Рандомные данные для демонстрации
const censusData = {
  totalPopulation: 2847,
  households: 1234,
  growthRate: 2.3,
  averageAge: 34.2,
  malePopulation: 1456,
  femalePopulation: 1391,
  marriedPopulation: 1678,
  singlePopulation: 1169,
  educationStats: {
    primary: 423,
    secondary: 1245,
    higher: 987,
    postgraduate: 192,
  },
  ageGroups: {
    "0-17": 512,
    "18-35": 876,
    "36-55": 923,
    "56-70": 398,
    "70+": 138,
  },
  occupations: {
    agriculture: 645,
    industry: 423,
    services: 789,
    education: 234,
    healthcare: 156,
    government: 89,
    other: 511,
  },
  languages: {
    georgian: 2156,
    armenian: 423,
    russian: 189,
    other: 79,
  },
};

const recentEntries = [
  {
    id: 1,
    name: "Георгий Цинцкарашвили",
    date: "2024-10-14",
    status: "completed",
  },
  { id: 2, name: "Мария Арутюнян", date: "2024-10-13", status: "pending" },
  { id: 3, name: "Давид Гогичашвили", date: "2024-10-13", status: "completed" },
  { id: 4, name: "Анна Петросян", date: "2024-10-12", status: "completed" },
  { id: 5, name: "Левон Мкртчян", date: "2024-10-12", status: "pending" },
  { id: 6, name: "Нино Джавахишвили", date: "2024-10-11", status: "completed" },
  { id: 7, name: "Арам Саркисян", date: "2024-10-11", status: "completed" },
  {
    id: 8,
    name: "Тамара Цинцкарашвили",
    date: "2024-10-10",
    status: "pending",
  },
];

export default function CensusPage() {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedRegion, setSelectedRegion] = useState("all");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
        <div>
          <p className="text-muted-foreground">
            Статистические данные и аналитика переписи населения Цинцкаро
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Регион" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все регионы</SelectItem>
              <SelectItem value="center">Центр</SelectItem>
              <SelectItem value="north">Север</SelectItem>
              <SelectItem value="south">Юг</SelectItem>
            </SelectContent>
          </Select>
          <Button className="w-full sm:w-auto">
            <FileText className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Экспорт</span>
            <span className="sm:hidden">Экспорт</span>
          </Button>
        </div>
      </div>

      {/* Основная статистика */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Общая численность
              </p>
              <p className="text-2xl font-bold">
                {censusData.totalPopulation.toLocaleString()}
              </p>
              <p className="text-xs text-green-600">
                +{censusData.growthRate}% за год
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Домохозяйства
              </p>
              <p className="text-2xl font-bold">
                {censusData.households.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                Средний размер: 2.3
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Средний возраст
              </p>
              <p className="text-2xl font-bold">{censusData.averageAge}</p>
              <p className="text-xs text-muted-foreground">лет</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
              <MapPin className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Плотность населения
              </p>
              <p className="text-2xl font-bold">47.2</p>
              <p className="text-xs text-muted-foreground">чел/км²</p>
            </div>
          </div>
        </div>
      </div>

      {/* Детальная статистика */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Половозрастная структура */}
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            Половозрастная структура
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Мужчины</span>
                <span className="text-sm text-muted-foreground">
                  {censusData.malePopulation} (
                  {(
                    (censusData.malePopulation / censusData.totalPopulation) *
                    100
                  ).toFixed(1)}
                  %)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${
                      (censusData.malePopulation / censusData.totalPopulation) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Женщины</span>
                <span className="text-sm text-muted-foreground">
                  {censusData.femalePopulation} (
                  {(
                    (censusData.femalePopulation / censusData.totalPopulation) *
                    100
                  ).toFixed(1)}
                  %)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-pink-600 h-2 rounded-full"
                  style={{
                    width: `${
                      (censusData.femalePopulation /
                        censusData.totalPopulation) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-md font-medium mb-3">Возрастные группы</h4>
            <div className="space-y-2">
              {Object.entries(censusData.ageGroups).map(([age, count]) => (
                <div key={age} className="flex justify-between items-center">
                  <span className="text-sm">{age} лет</span>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Образование и занятость */}
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            Образование и занятость
          </h3>

          <div className="mb-6">
            <h4 className="text-md font-medium mb-3">Уровень образования</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Начальное</span>
                <span className="text-sm font-medium">
                  {censusData.educationStats.primary}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Среднее</span>
                <span className="text-sm font-medium">
                  {censusData.educationStats.secondary}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Высшее</span>
                <span className="text-sm font-medium">
                  {censusData.educationStats.higher}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Аспирантура/докторантура</span>
                <span className="text-sm font-medium">
                  {censusData.educationStats.postgraduate}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-md font-medium mb-3">Сферы деятельности</h4>
            <div className="space-y-2">
              {Object.entries(censusData.occupations).map(
                ([occupation, count]) => (
                  <div
                    key={occupation}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm capitalize">
                      {occupation === "agriculture"
                        ? "Сельское хозяйство"
                        : occupation === "industry"
                        ? "Промышленность"
                        : occupation === "services"
                        ? "Услуги"
                        : occupation === "education"
                        ? "Образование"
                        : occupation === "healthcare"
                        ? "Здравоохранение"
                        : occupation === "government"
                        ? "Государственная служба"
                        : "Другое"}
                    </span>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Языковая статистика */}
      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h3 className="text-lg font-semibold mb-4">
          Языковая структура населения
        </h3>
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(censusData.languages).map(([language, count]) => (
            <div key={language} className="text-center">
              <div className="text-2xl font-bold text-primary">{count}</div>
              <div className="text-sm text-muted-foreground">
                {language === "georgian"
                  ? "Грузинский"
                  : language === "armenian"
                  ? "Армянский"
                  : language === "russian"
                  ? "Русский"
                  : "Другие"}
              </div>
              <div className="text-xs text-muted-foreground">
                {((count / censusData.totalPopulation) * 100).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Последние записи */}
      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center mb-4">
          <h3 className="text-lg font-semibold">Последние записи переписи</h3>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Calendar className="h-4 w-4 mr-2" />
            Показать все
          </Button>
        </div>
        <div className="space-y-3">
          {recentEntries.map((entry) => (
            <div
              key={entry.id}
              className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{entry.name}</p>
                  <p className="text-xs text-muted-foreground">{entry.date}</p>
                </div>
              </div>
              <div className="flex items-center justify-end sm:justify-start space-x-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    entry.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {entry.status === "completed" ? "Завершено" : "В обработке"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
