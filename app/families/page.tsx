"use client";

import { useState } from "react";
import { Users, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  familiesData,
  familyStatistics,
  Family,
} from "@/lib/mock-data/families";
import { FamilyCard } from "@/components/families/FamilyCard";
import { FamilySearch } from "@/components/families/FamilySearch";
import { FamilyStatistics } from "@/components/families/FamilyStatistics";
import { FamilyDetailModal } from "@/components/families/FamilyDetailModal";
import { GraveyardSplatSection } from "@/components/families/GraveyardSplatSection";

export default function FamiliesPage() {
  const [filteredFamilies, setFilteredFamilies] =
    useState<Family[]>(familiesData);
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = (families: Family[]) => {
    setFilteredFamilies(families);
  };

  const handleViewDetails = (family: Family) => {
    setSelectedFamily(family);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFamily(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Фамилии</h2>
        <p className="text-muted-foreground">
          Исследуйте генеалогическое древо и семейные связи цинцкаройских греков
        </p>
      </div>

      {/* Digital heritage */}
      <GraveyardSplatSection />

      {/* Statistics */}
      <FamilyStatistics statistics={familyStatistics} />

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Поиск семей
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FamilySearch families={familiesData} onSearch={handleSearch} />
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Найденные семьи</h3>
          <p className="text-sm text-muted-foreground">
            Показано {filteredFamilies.length} из {familiesData.length} семей
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить семью
        </Button>
      </div>

      {/* Families Grid */}
      {filteredFamilies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFamilies.map((family) => (
            <FamilyCard
              key={family.id}
              family={family}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Семьи не найдены</h3>
            <p className="text-muted-foreground text-center">
              Попробуйте изменить параметры поиска или добавить новую семью в
              базу данных
            </p>
          </CardContent>
        </Card>
      )}

      {/* Family Detail Modal */}
      <FamilyDetailModal
        family={selectedFamily}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
