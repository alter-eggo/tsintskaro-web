import {
  Gamepad2,
  Trophy,
  Puzzle,
  MapPin,
  Users,
  Brain,
  Target,
  Clock,
} from "lucide-react";

export default function GamesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-muted-foreground">
          Интерактивные игры и развлечения для всех возрастов
        </p>
      </div>

      {/* Game Categories */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Brain className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">Викторины</h3>
              <p className="text-sm text-muted-foreground">
                История и культура
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Проверьте свои знания о традициях, истории и культуре Цинцкаро
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <Puzzle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">Пазлы</h3>
              <p className="text-sm text-muted-foreground">Фотографии</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Собирайте пазлы с фотографиями достопримечательностей и традиций
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <Target className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold">Традиции</h3>
              <p className="text-sm text-muted-foreground">Знание обычаев</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Изучайте и закрепляйте знания о традициях и обычаях
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
              <MapPin className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold">Карты</h3>
              <p className="text-sm text-muted-foreground">Интерактивные</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Исследуйте интерактивные карты и изучайте географию региона
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
              <Trophy className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold">Турниры</h3>
              <p className="text-sm text-muted-foreground">Соревнования</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Участвуйте в турнирах и соревнованиях с другими игроками
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
              <Users className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold">Командные</h3>
              <p className="text-sm text-muted-foreground">Игры</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Играйте в команде с друзьями и семьей
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Особенности игр</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Разные уровни сложности</h4>
                <p className="text-sm text-muted-foreground">
                  От новичка до эксперта
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Trophy className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Система достижений</h4>
                <p className="text-sm text-muted-foreground">
                  Зарабатывайте награды
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Многопользовательский режим</h4>
                <p className="text-sm text-muted-foreground">
                  Играйте с друзьями
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Образовательный контент</h4>
                <p className="text-sm text-muted-foreground">Учитесь играя</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
