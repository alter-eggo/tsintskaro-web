"use client";

import { useState } from "react";
import { Image, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  galleryPhotos,
  galleryCategories,
  galleryStatistics,
  Photo,
} from "@/lib/mock-data/gallery";
import { PhotoCard } from "@/components/gallery/PhotoCard";
import { CategoryCard } from "@/components/gallery/CategoryCard";
import { GallerySearch } from "@/components/gallery/GallerySearch";
import { GalleryStatistics } from "@/components/gallery/GalleryStatistics";
import { PhotoModal } from "@/components/gallery/PhotoModal";

export default function GalleryPage() {
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>(galleryPhotos);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"categories" | "photos">(
    "categories"
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const handleSearch = (photos: Photo[]) => {
    setFilteredPhotos(photos);
    setViewMode("photos");
  };

  const handleViewPhoto = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === "all") {
      setFilteredPhotos(galleryPhotos);
    } else {
      const categoryPhotos = galleryPhotos.filter(
        (photo) => photo.category === categoryId
      );
      setFilteredPhotos(categoryPhotos);
    }
    setViewMode("photos");
  };

  const handleUploadPhoto = () => {
    // TODO: Implement photo upload functionality
    console.log("Upload photo clicked");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <p className="text-muted-foreground">
          Коллекция фотографий и воспоминаний нашего сообщества
        </p>
      </div>

      {/* Statistics */}
      <GalleryStatistics statistics={galleryStatistics} />

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Поиск в галерее
          </CardTitle>
        </CardHeader>
        <CardContent>
          <GallerySearch photos={galleryPhotos} onSearch={handleSearch} />
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
            variant={viewMode === "photos" ? "default" : "outline"}
            onClick={() => setViewMode("photos")}
            size="sm"
          >
            <List className="h-4 w-4 mr-2" />
            Фотографии
          </Button>
        </div>

        <Button onClick={handleUploadPhoto} className="gap-2">
          <Grid3X3 className="h-4 w-4 mr-2" />
          Загрузить фото
        </Button>
      </div>

      {/* Content */}
      {viewMode === "categories" ? (
        <div>
          <h3 className="text-lg font-semibold mb-4">Категории фотографий</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryCategories.map((category) => (
              <CategoryCard
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
              <h3 className="text-lg font-semibold">Найденные фотографии</h3>
              <p className="text-sm text-muted-foreground">
                Показано {filteredPhotos.length} из {galleryPhotos.length}{" "}
                фотографий
              </p>
            </div>
          </div>

          {/* Photos Grid */}
          {filteredPhotos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPhotos.map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  onViewPhoto={handleViewPhoto}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Image className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Фотографии не найдены
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

      {/* Photo Modal */}
      <PhotoModal
        photo={selectedPhoto}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
