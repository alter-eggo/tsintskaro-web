"use client";

import { useState } from "react";
import { BookOpen, Grid3X3, List, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  traditionsData,
  traditionCategories,
  traditionsStatistics,
  Tradition,
} from "@/lib/mock-data/traditions";
import { TraditionCard } from "@/components/traditions/TraditionCard";
import { TraditionCategoryCard } from "@/components/traditions/TraditionCategoryCard";
import { TraditionSearch } from "@/components/traditions/TraditionSearch";
import { TraditionStatistics } from "@/components/traditions/TraditionStatistics";
import { TraditionModal } from "@/components/traditions/TraditionModal";

export default function TraditionsPage() {
  const [filteredTraditions, setFilteredTraditions] =
    useState<Tradition[]>(traditionsData);
  const [selectedTradition, setSelectedTradition] = useState<Tradition | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"categories" | "traditions">(
    "categories"
  );
  const [, setSelectedCategory] = useState<string>("all");

  const handleSearch = (traditions: Tradition[]) => {
    setFilteredTraditions(traditions);
    setViewMode("traditions");
  };

  const handleViewTradition = (tradition: Tradition) => {
    setSelectedTradition(tradition);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTradition(null);
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === "all") {
      setFilteredTraditions(traditionsData);
    } else {
      const categoryTraditions = traditionsData.filter(
        (tradition) => tradition.category === categoryId
      );
      setFilteredTraditions(categoryTraditions);
    }
    setViewMode("traditions");
  };

  const handleAddTradition = () => {
    // TODO: Implement tradition addition functionality
    console.log("Add tradition clicked");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <p className="text-muted-foreground">
          Изучайте культурные традиции и обычаи нашего сообщества
        </p>
      </div>

      {/* Statistics */}
      <TraditionStatistics statistics={traditionsStatistics} />

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Поиск традиций
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TraditionSearch
            traditions={traditionsData}
            onSearch={handleSearch}
          />
        </CardContent>
      </Card>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={viewMode === "categories" ? "default" : "outline"}
            onClick={() => setViewMode("categories")}
            size="sm"
          >
            <Grid3X3 className="h-4 w-4 mr-2" />
            Категории
          </Button>
          <Button
            variant={viewMode === "traditions" ? "default" : "outline"}
            onClick={() => setViewMode("traditions")}
            size="sm"
          >
            <List className="h-4 w-4 mr-2" />
            Традиции
          </Button>
        </div>

        <Button onClick={handleAddTradition} className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить традицию
        </Button>
      </div>

      {/* Content */}
      {viewMode === "categories" ? (
        <div>
          <h3 className="text-lg font-semibold mb-4">Категории традиций</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {traditionCategories.map((category) => (
              <TraditionCategoryCard
                key={category.id}
                category={category}
                onSelectCategory={handleSelectCategory}
              />
            ))}
          </div>
        </div>
      ) : (
        <div>
          {/* Results Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Найденные традиции</h3>
              <p className="text-sm text-muted-foreground">
                Показано {filteredTraditions.length} из {traditionsData.length}{" "}
                традиций
              </p>
            </div>
          </div>

          {/* Traditions Grid */}
          {filteredTraditions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTraditions.map((tradition) => (
                <TraditionCard
                  key={tradition.id}
                  tradition={tradition}
                  onViewTradition={handleViewTradition}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Традиции не найдены
                </h3>
                <p className="text-muted-foreground text-center">
                  Попробуйте изменить параметры поиска или выберите другую
                  категорию
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Tradition Modal */}
      <TraditionModal
        tradition={selectedTradition}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
