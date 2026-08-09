export interface FamilyMember {
  id: string;
  name: string;
  surname: string;
  birthYear?: number;
  deathYear?: number;
  isAlive: boolean;
  gender: "male" | "female";
  relationship: "head" | "spouse" | "child" | "sibling" | "parent";
  occupation?: string;
  location?: string;
  photo?: string;
  notes?: string;
}

export interface Family {
  id: string;
  surname: string;
  origin: string; // Where they lived in Tsintskaro
  currentLocations: string[];
  generation: number; // How many generations since leaving Tsintskaro
  totalMembers: number;
  description: string;
  familyTree?: {
    root: FamilyMember;
    children: Family[];
  };
  photos: string[];
  stories: {
    title: string;
    content: string;
    year?: number;
  }[];
  migrationHistory: {
    from: string;
    to: string;
    year: number;
    reason: string;
  }[];
}

// Список всех фамилий цинцкаройских греков (около 15 000 человек)
export const tsintskaroSurnames = [
  "Алексановы",
  "Агоевы",
  "Азоевы",
  "Аврамовы",
  "Айвазовы",
  "Айтановы",
  "Анозовы",
  "Ананиевы",
  "Арудовы",
  "Арзиевы",
  "Баратовы",
  "Биджоевы",
  "Бичахчиевы",
  "Бостанджиевы",
  "Бозоевы",
  "Блисовы",
  "Василовы",
  "Гарагашевы",
  "Гайсарлиевы",
  "Гезибейковы",
  "Гюрджиевы",
  "Димоевы",
  "Деляновы",
  "Джадовы",
  "Енидюняевы",
  "Зильфиевы",
  "Зороевы",
  "Исаковы",
  "Исагуловы",
  "Иордановы",
  "Калайчиевы",
  "Кашеевы",
  "Караашевы",
  "Караджаевы",
  "Карслиевы",
  "Карагёзовы",
  "Кекелашвили",
  "Князевы",
  "Козмаевы",
  "Коносовы",
  "Костановы",
  "Корошевы",
  "Карибовы",
  "Кядиковы",
  "Кяряклиевы",
  "Кюрдовы",
  "Ламбриановы",
  "Маданиевы",
  "Мазмановы",
  "Мантарджиевы",
  "Марабаевы",
  "Маруласовы",
  "Мироевы",
  "Мурадовы",
  "Мойсиевы",
  "Мурзоевы",
  "Нароевы",
  "Оскоевы",
  "Паскаловы",
  "Поповы",
  "Пафливановы",
  "Романовы",
  "Стафиловы",
  "Сафаровы",
  "Савлиевы",
  "Сакалидзе",
  "Сейпиановы",
  "Татаровы",
  "Типиевы",
  "Тумановы",
  "Топуридзе",
  "Фараджановы",
  "Фахировы",
  "Феодоровы",
  "Христиановы",
  "Хроевы",
  "Чахчаховы",
  "Чульфаевы",
  "Чухурфутовы",
  "Шерлиевы",
];

export const familiesData: Family[] = tsintskaroSurnames.map(
  (surname, index) => ({
    id: surname.toLowerCase().replace(/[ы|и]$/, ""),
    surname,
    origin: "Цинцкаро",
    currentLocations: ["Россия", "Греция", "Германия"],
    generation: 2,
    totalMembers: 50 + ((index * 73 + 29) % 150),
    description: `Семья ${surname} — одна из коренных цинцкаройских семей.`,
    photos: [],
    stories: [],
    migrationHistory: [],
  }),
);

export const familyStatistics = {
  totalFamilies: tsintskaroSurnames.length,
  totalMembers: 15000,
  countries: [
    { name: "Россия", count: 45, percentage: 56 },
    { name: "Греция", count: 25, percentage: 31 },
    { name: "Германия", count: 7, percentage: 9 },
    { name: "Другие", count: 3, percentage: 4 },
  ],
  generations: [
    { generation: 1, count: 5, description: "Первое поколение переселенцев" },
    { generation: 2, count: 35, description: "Дети переселенцев" },
    { generation: 3, count: 30, description: "Внуки переселенцев" },
    { generation: 4, count: 10, description: "Правнуки переселенцев" },
  ],
};
