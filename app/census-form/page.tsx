"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";

export default function CensusForm() {
  const [formData, setFormData] = useState({
    // Идентификация
    fullName: "",
    birthDate: undefined as Date | undefined,
    gender: "",
    birthPlace: {
      country: "",
      region: "",
      city: "",
    },

    // Родственные связи
    father: { name: "", birthDate: undefined as Date | undefined },
    mother: { name: "", birthDate: undefined as Date | undefined },
    paternalGrandfather: { name: "", birthDate: undefined as Date | undefined },
    paternalGrandmother: { name: "", birthDate: undefined as Date | undefined },
    maternalGrandfather: { name: "", birthDate: undefined as Date | undefined },
    maternalGrandmother: { name: "", birthDate: undefined as Date | undefined },
    spouse: { name: "", birthDate: undefined as Date | undefined },
    children: [
      { name: "", birthDate: undefined as Date | undefined, gender: "" },
    ],
    siblings: [
      { name: "", birthDate: undefined as Date | undefined, gender: "" },
    ],

    // Вид деятельности
    mainActivity: "",
    profession: "",
    activitySphere: "",

    // Образование
    educationLevel: "",
    educationInstitution: "",
    specialty: "",

    // Постоянное место жительства
    currentCity: "",
    moveYear: "",

    // Родной язык
    nativeLanguage: "",
    otherLanguages: "",
    familyLanguage: "",

    // Вероисповедание
    religion: "",
    religiousActivity: "",

    // Дополнительно
    citizenship: "",
    maritalStatus: "",
    ethnicity: "",
    moveHistory: "",
  });

  const addChild = () => {
    setFormData((prev) => ({
      ...prev,
      children: [
        ...prev.children,
        { name: "", birthDate: undefined as Date | undefined, gender: "" },
      ],
    }));
  };

  const addSibling = () => {
    setFormData((prev) => ({
      ...prev,
      siblings: [
        ...prev.siblings,
        { name: "", birthDate: undefined as Date | undefined, gender: "" },
      ],
    }));
  };

  const removeChild = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index),
    }));
  };

  const removeSibling = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      siblings: prev.siblings.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Данные формы:", formData);
    alert("Форма переписи отправлена!");
  };

  return (
    <div className="max-w-4xl mx-auto p-1 sm:p-6">
      <div className="mb-8">
        <p className="text-muted-foreground">
          Заполните все необходимые поля для регистрации в переписи населения
          Цинцкаро
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Идентификация */}
        <div className="bg-card p-4 sm:p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">1. Идентификация</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">ФИО</label>
              <Input
                value={formData.fullName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                }
                placeholder="Введите полное имя"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Дата рождения
              </label>
              <DatePicker
                value={formData.birthDate}
                onChange={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    birthDate: date,
                  }))
                }
                placeholder="Выберите дату рождения"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Пол</label>
              <Select
                value={formData.gender}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, gender: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите пол" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Мужской</SelectItem>
                  <SelectItem value="female">Женский</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Страна рождения
              </label>
              <Input
                value={formData.birthPlace.country}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    birthPlace: { ...prev.birthPlace, country: e.target.value },
                  }))
                }
                placeholder="Страна"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Регион рождения
              </label>
              <Input
                value={formData.birthPlace.region}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    birthPlace: { ...prev.birthPlace, region: e.target.value },
                  }))
                }
                placeholder="Регион"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Населённый пункт рождения
              </label>
              <Input
                value={formData.birthPlace.city}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    birthPlace: { ...prev.birthPlace, city: e.target.value },
                  }))
                }
                placeholder="Город/село"
              />
            </div>
          </div>
        </div>

        {/* 2. Родственные связи */}
        <div className="bg-card p-4 sm:p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">2. Родственные связи</h2>

          {/* Родители */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Родители</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Отец (ФИО)
                </label>
                <Input
                  value={formData.father.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      father: { ...prev.father, name: e.target.value },
                    }))
                  }
                  placeholder="ФИО отца"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Дата рождения отца
                </label>
                <DatePicker
                  value={formData.father.birthDate}
                  onChange={(date) =>
                    setFormData((prev) => ({
                      ...prev,
                      father: { ...prev.father, birthDate: date },
                    }))
                  }
                  placeholder="Выберите дату рождения отца"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Мать (ФИО)
                </label>
                <Input
                  value={formData.mother.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      mother: { ...prev.mother, name: e.target.value },
                    }))
                  }
                  placeholder="ФИО матери"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Дата рождения матери
                </label>
                <DatePicker
                  value={formData.mother.birthDate}
                  onChange={(date) =>
                    setFormData((prev) => ({
                      ...prev,
                      mother: { ...prev.mother, birthDate: date },
                    }))
                  }
                  placeholder="Выберите дату рождения матери"
                />
              </div>
            </div>
          </div>

          {/* Дедушки и бабушки */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Дедушки и бабушки</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Дедушка по отцу (ФИО)
                </label>
                <Input
                  value={formData.paternalGrandfather.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      paternalGrandfather: {
                        ...prev.paternalGrandfather,
                        name: e.target.value,
                      },
                    }))
                  }
                  placeholder="ФИО дедушки по отцу"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Дата рождения
                </label>
                <DatePicker
                  value={formData.paternalGrandfather.birthDate}
                  onChange={(date) =>
                    setFormData((prev) => ({
                      ...prev,
                      paternalGrandfather: {
                        ...prev.paternalGrandfather,
                        birthDate: date,
                      },
                    }))
                  }
                  placeholder="Выберите дату рождения"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Бабушка по отцу (ФИО)
                </label>
                <Input
                  value={formData.paternalGrandmother.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      paternalGrandmother: {
                        ...prev.paternalGrandmother,
                        name: e.target.value,
                      },
                    }))
                  }
                  placeholder="ФИО бабушки по отцу"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Дата рождения
                </label>
                <DatePicker
                  value={formData.paternalGrandmother.birthDate}
                  onChange={(date) =>
                    setFormData((prev) => ({
                      ...prev,
                      paternalGrandmother: {
                        ...prev.paternalGrandmother,
                        birthDate: date,
                      },
                    }))
                  }
                  placeholder="Выберите дату рождения"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Дедушка по матери (ФИО)
                </label>
                <Input
                  value={formData.maternalGrandfather.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      maternalGrandfather: {
                        ...prev.maternalGrandfather,
                        name: e.target.value,
                      },
                    }))
                  }
                  placeholder="ФИО дедушки по матери"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Дата рождения
                </label>
                <DatePicker
                  value={formData.maternalGrandfather.birthDate}
                  onChange={(date) =>
                    setFormData((prev) => ({
                      ...prev,
                      maternalGrandfather: {
                        ...prev.maternalGrandfather,
                        birthDate: date,
                      },
                    }))
                  }
                  placeholder="Выберите дату рождения"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Бабушка по матери (ФИО)
                </label>
                <Input
                  value={formData.maternalGrandmother.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      maternalGrandmother: {
                        ...prev.maternalGrandmother,
                        name: e.target.value,
                      },
                    }))
                  }
                  placeholder="ФИО бабушки по матери"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Дата рождения
                </label>
                <DatePicker
                  value={formData.maternalGrandmother.birthDate}
                  onChange={(date) =>
                    setFormData((prev) => ({
                      ...prev,
                      maternalGrandmother: {
                        ...prev.maternalGrandmother,
                        birthDate: date,
                      },
                    }))
                  }
                  placeholder="Выберите дату рождения"
                />
              </div>
            </div>
          </div>

          {/* Супруг/супруга */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Супруг/супруга</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  ФИО супруга/супруги
                </label>
                <Input
                  value={formData.spouse.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      spouse: { ...prev.spouse, name: e.target.value },
                    }))
                  }
                  placeholder="ФИО супруга/супруги"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Дата рождения
                </label>
                <DatePicker
                  value={formData.spouse.birthDate}
                  onChange={(date) =>
                    setFormData((prev) => ({
                      ...prev,
                      spouse: { ...prev.spouse, birthDate: date },
                    }))
                  }
                  placeholder="Выберите дату рождения"
                />
              </div>
            </div>
          </div>

          {/* Дети */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">Дети</h3>
              <Button
                type="button"
                onClick={addChild}
                variant="outline"
                size="sm"
              >
                Добавить ребёнка
              </Button>
            </div>
            {formData.children.map((child, index) => (
              <div
                key={index}
                className="grid grid-cols-1 gap-4 mb-4 p-4 border rounded-lg"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">
                    ФИО ребёнка
                  </label>
                  <Input
                    value={child.name}
                    onChange={(e) => {
                      const newChildren = [...formData.children];
                      newChildren[index].name = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        children: newChildren,
                      }));
                    }}
                    placeholder="ФИО ребёнка"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Дата рождения
                  </label>
                  <DatePicker
                    value={child.birthDate}
                    onChange={(date) => {
                      const newChildren = [...formData.children];
                      newChildren[index].birthDate = date;
                      setFormData((prev) => ({
                        ...prev,
                        children: newChildren,
                      }));
                    }}
                    placeholder="Выберите дату рождения"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Пол</label>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <Select
                      value={child.gender}
                      onValueChange={(value) => {
                        const newChildren = [...formData.children];
                        newChildren[index].gender = value;
                        setFormData((prev) => ({
                          ...prev,
                          children: newChildren,
                        }));
                      }}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Выберите пол" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Мужской</SelectItem>
                        <SelectItem value="female">Женский</SelectItem>
                      </SelectContent>
                    </Select>
                    {formData.children.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeChild(index)}
                        variant="destructive"
                        size="sm"
                      >
                        Удалить
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Братья и сестры */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">Братья и сестры</h3>
              <Button
                type="button"
                onClick={addSibling}
                variant="outline"
                size="sm"
              >
                Добавить брата/сестру
              </Button>
            </div>
            {formData.siblings.map((sibling, index) => (
              <div
                key={index}
                className="grid grid-cols-1 gap-4 mb-4 p-4 border rounded-lg"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">ФИО</label>
                  <Input
                    value={sibling.name}
                    onChange={(e) => {
                      const newSiblings = [...formData.siblings];
                      newSiblings[index].name = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        siblings: newSiblings,
                      }));
                    }}
                    placeholder="ФИО брата/сестры"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Дата рождения
                  </label>
                  <DatePicker
                    value={sibling.birthDate}
                    onChange={(date) => {
                      const newSiblings = [...formData.siblings];
                      newSiblings[index].birthDate = date;
                      setFormData((prev) => ({
                        ...prev,
                        siblings: newSiblings,
                      }));
                    }}
                    placeholder="Выберите дату рождения"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Пол</label>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <Select
                      value={sibling.gender}
                      onValueChange={(value) => {
                        const newSiblings = [...formData.siblings];
                        newSiblings[index].gender = value;
                        setFormData((prev) => ({
                          ...prev,
                          siblings: newSiblings,
                        }));
                      }}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Выберите пол" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Мужской</SelectItem>
                        <SelectItem value="female">Женский</SelectItem>
                      </SelectContent>
                    </Select>
                    {formData.siblings.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeSibling(index)}
                        variant="destructive"
                        size="sm"
                      >
                        Удалить
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Вид деятельности */}
        <div className="bg-card p-4 sm:p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">3. Вид деятельности</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Основная деятельность
              </label>
              <Input
                value={formData.mainActivity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    mainActivity: e.target.value,
                  }))
                }
                placeholder="Основная деятельность"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Профессия / должность
              </label>
              <Input
                value={formData.profession}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    profession: e.target.value,
                  }))
                }
                placeholder="Профессия или должность"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Сфера деятельности
              </label>
              <Input
                value={formData.activitySphere}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    activitySphere: e.target.value,
                  }))
                }
                placeholder="Сфера деятельности"
              />
            </div>
          </div>
        </div>

        {/* 4. Образование */}
        <div className="bg-card p-4 sm:p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">4. Образование</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Уровень образования
              </label>
              <Select
                value={formData.educationLevel}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    educationLevel: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите уровень образования" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Начальное</SelectItem>
                  <SelectItem value="secondary">Среднее</SelectItem>
                  <SelectItem value="higher">Высшее</SelectItem>
                  <SelectItem value="postgraduate">
                    Аспирантура/докторантура
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Учебное заведение
              </label>
              <Input
                value={formData.educationInstitution}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    educationInstitution: e.target.value,
                  }))
                }
                placeholder="Название учебного заведения"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Специальность
              </label>
              <Input
                value={formData.specialty}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    specialty: e.target.value,
                  }))
                }
                placeholder="Специальность"
              />
            </div>
          </div>
        </div>

        {/* 5. Постоянное место жительства */}
        <div className="bg-card p-4 sm:p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">
            5. Постоянное место жительства
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Населённый пункт
              </label>
              <Input
                value={formData.currentCity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    currentCity: e.target.value,
                  }))
                }
                placeholder="Текущий населённый пункт"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Год переезда
              </label>
              <Input
                type="number"
                value={formData.moveYear}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, moveYear: e.target.value }))
                }
                placeholder="Год переезда (если применимо)"
              />
            </div>
          </div>
        </div>

        {/* 6. Родной язык */}
        <div className="bg-card p-4 sm:p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">6. Родной язык</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Родной язык
              </label>
              <Input
                value={formData.nativeLanguage}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    nativeLanguage: e.target.value,
                  }))
                }
                placeholder="Родной язык"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Другие языки
              </label>
              <Input
                value={formData.otherLanguages}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    otherLanguages: e.target.value,
                  }))
                }
                placeholder="Другие языки (через запятую)"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Язык общения в семье
              </label>
              <Input
                value={formData.familyLanguage}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    familyLanguage: e.target.value,
                  }))
                }
                placeholder="Язык общения в семье"
              />
            </div>
          </div>
        </div>

        {/* 7. Вероисповедание */}
        <div className="bg-card p-4 sm:p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">7. Вероисповедание</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Религия / конфессия
              </label>
              <Input
                value={formData.religion}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, religion: e.target.value }))
                }
                placeholder="Религия или конфессия"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Активность в религиозной жизни
              </label>
              <Select
                value={formData.religiousActivity}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    religiousActivity: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите уровень активности" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="very_active">Очень активный</SelectItem>
                  <SelectItem value="active">Активный</SelectItem>
                  <SelectItem value="moderate">Умеренный</SelectItem>
                  <SelectItem value="low">Низкий</SelectItem>
                  <SelectItem value="none">Не участвую</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 8. Дополнительно */}
        <div className="bg-card p-4 sm:p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">8. Дополнительно</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Гражданство
              </label>
              <Input
                value={formData.citizenship}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    citizenship: e.target.value,
                  }))
                }
                placeholder="Гражданство"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Семейное положение
              </label>
              <Select
                value={formData.maritalStatus}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    maritalStatus: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите семейное положение" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Холост/не замужем</SelectItem>
                  <SelectItem value="married">Женат/замужем</SelectItem>
                  <SelectItem value="divorced">Разведён/разведена</SelectItem>
                  <SelectItem value="widowed">Вдовец/вдова</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Этническая принадлежность
              </label>
              <Input
                value={formData.ethnicity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    ethnicity: e.target.value,
                  }))
                }
                placeholder="Этническая принадлежность"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                История переездов
              </label>
              <textarea
                className="w-full p-2 border border-input rounded-md bg-background min-h-[100px]"
                value={formData.moveHistory}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    moveHistory: e.target.value,
                  }))
                }
                placeholder="Опишите историю переездов"
              />
            </div>
          </div>
        </div>

        {/* Кнопка отправки */}
        <div className="flex justify-end">
          <Button type="submit" size="lg" className="px-8">
            Отправить форму переписи
          </Button>
        </div>
      </form>
    </div>
  );
}
