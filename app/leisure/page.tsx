"use client";

import { useState } from "react";
import { Activity, Grid3X3, List, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  leisureActivities,
  leisureCategories,
  leisureStatistics,
  LeisureActivity,
} from "@/lib/mock-data/leisure";
import { ActivityCard } from "@/components/leisure/ActivityCard";
import { CategoryCard } from "@/components/leisure/CategoryCard";
import { LeisureSearch } from "@/components/leisure/LeisureSearch";
import { LeisureStatistics } from "@/components/leisure/LeisureStatistics";
import { ActivityModal } from "@/components/leisure/ActivityModal";

export default function LeisurePage() {
  const [filteredActivities, setFilteredActivities] =
    useState<LeisureActivity[]>(leisureActivities);
  const [selectedActivity, setSelectedActivity] =
    useState<LeisureActivity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"categories" | "activities">(
    "categories"
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const handleSearch = (activities: LeisureActivity[]) => {
    setFilteredActivities(activities);
    setViewMode("activities");
  };

  const handleViewActivity = (activity: LeisureActivity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedActivity(null);
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === "all") {
      setFilteredActivities(leisureActivities);
    } else {
      const categoryActivities = leisureActivities.filter(
        (activity) => activity.category === categoryId
      );
      setFilteredActivities(categoryActivities);
    }
    setViewMode("activities");
  };

  const handleAddActivity = () => {
    // TODO: Implement add activity functionality
    console.log("Add activity clicked");
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = leisureCategories.find((cat) => cat.id === categoryId);
    return category?.icon || "🎯";
  };

  const getCategoryStats = () => {
    const stats = leisureStatistics.byCategory.find(
      (stat) => stat.category === selectedCategory
    );
    return (
      stats || {
        count: leisureStatistics.totalActivities,
        label: "Все активности",
      }
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            Семейные дела, культурно-развлекательные мероприятия, отдых и
            путешествия, спорт
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "categories" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("categories")}
          >
            <Grid3X3 className="h-4 w-4 mr-2" />
            Категории
          </Button>
          <Button
            variant={viewMode === "activities" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("activities")}
          >
            <List className="h-4 w-4 mr-2" />
            Активности
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <LeisureStatistics />

      {/* Search */}
      <LeisureSearch activities={leisureActivities} onSearch={handleSearch} />

      {/* Content */}
      {viewMode === "categories" ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Категории досуга</h3>
            <Button onClick={handleAddActivity} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Добавить активность
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leisureCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onSelect={handleSelectCategory}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">
                {getCategoryIcon(selectedCategory)}
              </span>
              <div>
                <h3 className="text-lg font-semibold">
                  {getCategoryStats().label}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {filteredActivities.length} из {getCategoryStats().count}{" "}
                  активностей
                </p>
              </div>
            </div>
            <Button onClick={handleAddActivity} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Добавить
            </Button>
          </div>

          {filteredActivities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActivities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onViewDetails={handleViewActivity}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Activity className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Активности не найдены
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  Попробуйте изменить параметры поиска или выберите другую
                  категорию
                </p>
                <Button
                  onClick={() => setViewMode("categories")}
                  variant="outline"
                >
                  Просмотреть категории
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Activity Modal */}
      <ActivityModal
        activity={selectedActivity}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
