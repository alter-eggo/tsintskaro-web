"use client";

import { useState } from "react";
import {
  Users,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Рандомные данные населения
const populationData = [
  {
    id: 1,
    fullName: "Георгий Давидович Цинцкарашвили",
    age: 45,
    gender: "Мужской",
    birthDate: "1979-03-15",
    occupation: "Фермер",
    education: "Среднее",
    maritalStatus: "Женат",
    children: 3,
    address: "ул. Центральная, 12",
    phone: "+995 555 123 456",
    registrationDate: "2024-10-10",
  },
  {
    id: 2,
    fullName: "Мария Арменовна Арутюнян",
    age: 32,
    gender: "Женский",
    birthDate: "1992-07-22",
    occupation: "Учитель",
    education: "Высшее",
    maritalStatus: "Замужем",
    children: 2,
    address: "ул. Школьная, 5",
    phone: "+995 555 234 567",
    registrationDate: "2024-10-12",
  },
  {
    id: 3,
    fullName: "Давид Георгиевич Гогичашвили",
    age: 28,
    gender: "Мужской",
    birthDate: "1996-11-08",
    occupation: "Программист",
    education: "Высшее",
    maritalStatus: "Холост",
    children: 0,
    address: "ул. Молодежная, 18",
    phone: "+995 555 345 678",
    registrationDate: "2024-10-13",
  },
  {
    id: 4,
    fullName: "Анна Левоновна Петросян",
    age: 67,
    gender: "Женский",
    birthDate: "1957-04-12",
    occupation: "Пенсионер",
    education: "Среднее",
    maritalStatus: "Вдова",
    children: 4,
    address: "ул. Ветеранов, 3",
    phone: "+995 555 456 789",
    registrationDate: "2024-10-11",
  },
  {
    id: 5,
    fullName: "Левон Арамович Мкртчян",
    age: 39,
    gender: "Мужской",
    birthDate: "1985-09-30",
    occupation: "Врач",
    education: "Высшее",
    maritalStatus: "Женат",
    children: 1,
    address: "ул. Медицинская, 7",
    phone: "+995 555 567 890",
    registrationDate: "2024-10-09",
  },
  {
    id: 6,
    fullName: "Нино Отаровна Джавахишвили",
    age: 24,
    gender: "Женский",
    birthDate: "2000-01-18",
    occupation: "Студент",
    education: "Неполное высшее",
    maritalStatus: "Не замужем",
    children: 0,
    address: "ул. Студенческая, 14",
    phone: "+995 555 678 901",
    registrationDate: "2024-10-14",
  },
  {
    id: 7,
    fullName: "Арам Сергеевич Саркисян",
    age: 52,
    gender: "Мужской",
    birthDate: "1972-06-25",
    occupation: "Строитель",
    education: "Среднее",
    maritalStatus: "Женат",
    children: 2,
    address: "ул. Строительная, 9",
    phone: "+995 555 789 012",
    registrationDate: "2024-10-08",
  },
  {
    id: 8,
    fullName: "Тамара Вахтанговна Цинцкарашвили",
    age: 43,
    gender: "Женский",
    birthDate: "1981-12-03",
    occupation: "Бухгалтер",
    education: "Высшее",
    maritalStatus: "Замужем",
    children: 2,
    address: "ул. Финансовая, 21",
    phone: "+995 555 890 123",
    registrationDate: "2024-10-07",
  },
  {
    id: 9,
    fullName: "Вахтанг Гиоргиевич Чавчавадзе",
    age: 61,
    gender: "Мужской",
    birthDate: "1963-08-14",
    occupation: "Инженер",
    education: "Высшее",
    maritalStatus: "Женат",
    children: 3,
    address: "ул. Техническая, 16",
    phone: "+995 555 901 234",
    registrationDate: "2024-10-06",
  },
  {
    id: 10,
    fullName: "Манана Зурабовна Кварацхелия",
    age: 35,
    gender: "Женский",
    birthDate: "1989-05-27",
    occupation: "Медсестра",
    education: "Среднее специальное",
    maritalStatus: "Замужем",
    children: 1,
    address: "ул. Больничная, 4",
    phone: "+995 555 012 345",
    registrationDate: "2024-10-05",
  },
];

export default function PopulationPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [ageFilter, setAgeFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [educationFilter, setEducationFilter] = useState("all");
  const [selectedPerson, setSelectedPerson] = useState<
    (typeof populationData)[0] | null
  >(null);

  const filteredData = populationData.filter((person) => {
    const matchesSearch =
      person.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.occupation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAge =
      ageFilter === "all" ||
      (ageFilter === "young" && person.age < 30) ||
      (ageFilter === "middle" && person.age >= 30 && person.age < 60) ||
      (ageFilter === "senior" && person.age >= 60);

    const matchesGender =
      genderFilter === "all" ||
      (genderFilter === "male" && person.gender === "Мужской") ||
      (genderFilter === "female" && person.gender === "Женский");

    const matchesEducation =
      educationFilter === "all" ||
      person.education.toLowerCase().includes(educationFilter.toLowerCase());

    return matchesSearch && matchesAge && matchesGender && matchesEducation;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-muted-foreground">
            Реестр жителей Цинцкаро с подробной информацией
          </p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Экспорт данных
        </Button>
      </div>

      {/* Статистика */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Всего жителей
              </p>
              <p className="text-xl font-bold">{populationData.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Мужчин
              </p>
              <p className="text-xl font-bold">
                {populationData.filter((p) => p.gender === "Мужской").length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-100">
              <Users className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Женщин
              </p>
              <p className="text-xl font-bold">
                {populationData.filter((p) => p.gender === "Женский").length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Средний возраст
              </p>
              <p className="text-xl font-bold">
                {Math.round(
                  populationData.reduce((sum, p) => sum + p.age, 0) /
                    populationData.length
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Фильтры и поиск */}
      <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по имени, профессии или адресу..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={ageFilter} onValueChange={setAgeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Возраст" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все возрасты</SelectItem>
              <SelectItem value="young">До 30 лет</SelectItem>
              <SelectItem value="middle">30-60 лет</SelectItem>
              <SelectItem value="senior">60+ лет</SelectItem>
            </SelectContent>
          </Select>

          <Select value={genderFilter} onValueChange={setGenderFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Пол" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все</SelectItem>
              <SelectItem value="male">Мужской</SelectItem>
              <SelectItem value="female">Женский</SelectItem>
            </SelectContent>
          </Select>

          <Select value={educationFilter} onValueChange={setEducationFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Образование" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все</SelectItem>
              <SelectItem value="начальное">Начальное</SelectItem>
              <SelectItem value="среднее">Среднее</SelectItem>
              <SelectItem value="высшее">Высшее</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Таблица населения */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">
            Реестр населения ({filteredData.length} записей)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">ФИО</th>
                <th className="text-left p-4 font-medium">Возраст</th>
                <th className="text-left p-4 font-medium">Пол</th>
                <th className="text-left p-4 font-medium">Профессия</th>
                <th className="text-left p-4 font-medium">Образование</th>
                <th className="text-left p-4 font-medium">
                  Семейное положение
                </th>
                <th className="text-left p-4 font-medium">Адрес</th>
                <th className="text-left p-4 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((person) => (
                <tr key={person.id} className="border-b hover:bg-muted/50">
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{person.fullName}</div>
                      <div className="text-sm text-muted-foreground">
                        {person.phone}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{person.age}</td>
                  <td className="p-4">{person.gender}</td>
                  <td className="p-4">{person.occupation}</td>
                  <td className="p-4">{person.education}</td>
                  <td className="p-4">
                    <div>
                      <div>{person.maritalStatus}</div>
                      {person.children > 0 && (
                        <div className="text-sm text-muted-foreground">
                          Детей: {person.children}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">{person.address}</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPerson(person)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Модальное окно с подробной информацией */}
      {selectedPerson && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">Подробная информация</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPerson(null)}
              >
                ✕
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  ФИО
                </label>
                <p className="text-sm">{selectedPerson.fullName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Возраст
                </label>
                <p className="text-sm">{selectedPerson.age} лет</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Дата рождения
                </label>
                <p className="text-sm">{selectedPerson.birthDate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Пол
                </label>
                <p className="text-sm">{selectedPerson.gender}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Профессия
                </label>
                <p className="text-sm">{selectedPerson.occupation}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Образование
                </label>
                <p className="text-sm">{selectedPerson.education}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Семейное положение
                </label>
                <p className="text-sm">{selectedPerson.maritalStatus}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Количество детей
                </label>
                <p className="text-sm">{selectedPerson.children}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Адрес
                </label>
                <p className="text-sm">{selectedPerson.address}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Телефон
                </label>
                <p className="text-sm">{selectedPerson.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Дата регистрации
                </label>
                <p className="text-sm">{selectedPerson.registrationDate}</p>
              </div>
            </div>

            <div className="flex justify-end mt-6 space-x-2">
              <Button variant="outline" onClick={() => setSelectedPerson(null)}>
                Закрыть
              </Button>
              <Button>Редактировать</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
