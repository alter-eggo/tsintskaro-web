"use client";

import { useState } from "react";
import {
  educationCourses,
  learningPaths,
  achievements,
  Course,
} from "@/lib/mock-data/education";
import { LearningDashboard } from "@/components/education/LearningDashboard";
import { CourseCard } from "@/components/education/CourseCard";
import { LearningPathCard } from "@/components/education/LearningPathCard";
import { EducationTabs } from "@/components/education/EducationTabs";

export default function EducationPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleEnrollCourse = (courseId: string) => {
    // TODO: Implement course enrollment
    console.log("Enroll in course:", courseId);
  };

  const handleContinueCourse = (courseId: string) => {
    // TODO: Implement continue course
    console.log("Continue course:", courseId);
  };

  const handleStartPath = (pathId: string) => {
    // TODO: Implement start learning path
    console.log("Start learning path:", pathId);
  };

  const filteredCourses = educationCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <LearningDashboard />;

      case "courses":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Все курсы</h3>
              <p className="text-sm text-muted-foreground">
                Изучайте культурное наследие Цинцкаро через наши образовательные
                программы
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onEnroll={handleEnrollCourse}
                  onContinue={handleContinueCourse}
                />
              ))}
            </div>
          </div>
        );

      case "paths":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Пути обучения</h3>
              <p className="text-sm text-muted-foreground">
                Структурированные программы для комплексного изучения культуры
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {learningPaths.map((path) => (
                <LearningPathCard
                  key={path.id}
                  learningPath={path}
                  onStartPath={handleStartPath}
                />
              ))}
            </div>
          </div>
        );

      case "achievements":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Достижения</h3>
              <p className="text-sm text-muted-foreground">
                Отслеживайте свой прогресс и получайте награды за обучение
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-6 rounded-lg border-2 ${
                    achievement.isEarned
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{achievement.icon}</div>
                    <h4 className="font-semibold mb-2">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {achievement.description}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      {achievement.requirement}
                    </div>
                    {achievement.isEarned && achievement.earnedDate && (
                      <div className="mt-3 text-xs text-green-600">
                        Получено:{" "}
                        {new Date(achievement.earnedDate).toLocaleDateString(
                          "ru-RU"
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <LearningDashboard />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <p className="text-muted-foreground">
          Изучайте культурное наследие Цинцкаро через интерактивные курсы и
          программы
        </p>
      </div>

      {/* Tabs and Content */}
      <EducationTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onSearch={handleSearch}
        searchQuery={searchQuery}
      />

      {/* Tab Content */}
      {renderContent()}
    </div>
  );
}
