"use client";

import { useState } from "react";
import {
  Settings,
  User,
  Database,
  Shield,
  Bell,
  Globe,
  Save,
  RefreshCw,
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

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Общие настройки
    systemName: "Система переписи населения Цинцкаро",
    adminEmail: "admin@tsintskaro-census.ge",
    language: "ru",
    timezone: "Asia/Tbilisi",
    dateFormat: "DD.MM.YYYY",

    // Настройки переписи
    censusYear: "2024",
    censusStatus: "active",
    autoBackup: true,
    backupFrequency: "daily",
    dataRetention: "10",

    // Безопасность
    passwordPolicy: "strong",
    sessionTimeout: "30",
    twoFactorAuth: false,
    auditLog: true,

    // Уведомления
    emailNotifications: true,
    smsNotifications: false,
    systemAlerts: true,
    reportNotifications: true,

    // Интеграция
    exportFormat: "xlsx",
    apiAccess: false,
    webhookUrl: "",

    // Пользовательский интерфейс
    theme: "light",
    compactMode: false,
    showStatistics: true,
    defaultPageSize: "50",
  });

  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Имитация сохранения
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert("Настройки сохранены успешно!");
  };

  const handleReset = () => {
    if (
      confirm(
        "Вы уверены, что хотите сбросить все настройки к значениям по умолчанию?"
      )
    ) {
      // Сброс к значениям по умолчанию
      setSettings({
        systemName: "Система переписи населения Цинцкаро",
        adminEmail: "admin@tsintskaro-census.ge",
        language: "ru",
        timezone: "Asia/Tbilisi",
        dateFormat: "DD.MM.YYYY",
        censusYear: "2024",
        censusStatus: "active",
        autoBackup: true,
        backupFrequency: "daily",
        dataRetention: "10",
        passwordPolicy: "strong",
        sessionTimeout: "30",
        twoFactorAuth: false,
        auditLog: true,
        emailNotifications: true,
        smsNotifications: false,
        systemAlerts: true,
        reportNotifications: true,
        exportFormat: "xlsx",
        apiAccess: false,
        webhookUrl: "",
        theme: "light",
        compactMode: false,
        showStatistics: true,
        defaultPageSize: "50",
      });
    }
  };

  const tabs = [
    { id: "general", label: "Общие", icon: Settings },
    { id: "census", label: "Перепись", icon: Database },
    { id: "security", label: "Безопасность", icon: Shield },
    { id: "notifications", label: "Уведомления", icon: Bell },
    { id: "interface", label: "Интерфейс", icon: Globe },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-muted-foreground">
            Управление конфигурацией системы переписи населения
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Сбросить
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Сохранение..." : "Сохранить"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Боковое меню */}
        <div className="lg:w-64">
          <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Основной контент */}
        <div className="flex-1">
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            {/* Общие настройки */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Общие настройки</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Название системы
                    </label>
                    <Input
                      value={settings.systemName}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          systemName: e.target.value,
                        }))
                      }
                      placeholder="Название системы"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email администратора
                    </label>
                    <Input
                      type="email"
                      value={settings.adminEmail}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          adminEmail: e.target.value,
                        }))
                      }
                      placeholder="admin@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Язык системы
                    </label>
                    <Select
                      value={settings.language}
                      onValueChange={(value) =>
                        setSettings((prev) => ({ ...prev, language: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ru">Русский</SelectItem>
                        <SelectItem value="ka">ქართული</SelectItem>
                        <SelectItem value="hy">Հայերեն</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Часовой пояс
                    </label>
                    <Select
                      value={settings.timezone}
                      onValueChange={(value) =>
                        setSettings((prev) => ({ ...prev, timezone: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Tbilisi">
                          Тбилиси (GMT+4)
                        </SelectItem>
                        <SelectItem value="Europe/Moscow">
                          Москва (GMT+3)
                        </SelectItem>
                        <SelectItem value="Europe/Yerevan">
                          Ереван (GMT+4)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Формат даты
                    </label>
                    <Select
                      value={settings.dateFormat}
                      onValueChange={(value) =>
                        setSettings((prev) => ({ ...prev, dateFormat: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD.MM.YYYY">ДД.ММ.ГГГГ</SelectItem>
                        <SelectItem value="MM/DD/YYYY">ММ/ДД/ГГГГ</SelectItem>
                        <SelectItem value="YYYY-MM-DD">ГГГГ-ММ-ДД</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Настройки переписи */}
            {activeTab === "census" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Настройки переписи</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Год переписи
                    </label>
                    <Input
                      type="number"
                      value={settings.censusYear}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          censusYear: e.target.value,
                        }))
                      }
                      placeholder="2024"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Статус переписи
                    </label>
                    <Select
                      value={settings.censusStatus}
                      onValueChange={(value) =>
                        setSettings((prev) => ({
                          ...prev,
                          censusStatus: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">Планирование</SelectItem>
                        <SelectItem value="active">Активная</SelectItem>
                        <SelectItem value="completed">Завершена</SelectItem>
                        <SelectItem value="archived">Архивирована</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Частота резервного копирования
                    </label>
                    <Select
                      value={settings.backupFrequency}
                      onValueChange={(value) =>
                        setSettings((prev) => ({
                          ...prev,
                          backupFrequency: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Каждый час</SelectItem>
                        <SelectItem value="daily">Ежедневно</SelectItem>
                        <SelectItem value="weekly">Еженедельно</SelectItem>
                        <SelectItem value="monthly">Ежемесячно</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Срок хранения данных (лет)
                    </label>
                    <Input
                      type="number"
                      value={settings.dataRetention}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          dataRetention: e.target.value,
                        }))
                      }
                      placeholder="10"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="autoBackup"
                      checked={settings.autoBackup}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          autoBackup: e.target.checked,
                        }))
                      }
                      className="rounded"
                    />
                    <label htmlFor="autoBackup" className="text-sm font-medium">
                      Автоматическое резервное копирование
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Настройки безопасности */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">
                  Настройки безопасности
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Политика паролей
                    </label>
                    <Select
                      value={settings.passwordPolicy}
                      onValueChange={(value) =>
                        setSettings((prev) => ({
                          ...prev,
                          passwordPolicy: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weak">Слабая</SelectItem>
                        <SelectItem value="medium">Средняя</SelectItem>
                        <SelectItem value="strong">Строгая</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Время сессии (минуты)
                    </label>
                    <Input
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          sessionTimeout: e.target.value,
                        }))
                      }
                      placeholder="30"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="twoFactorAuth"
                      checked={settings.twoFactorAuth}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          twoFactorAuth: e.target.checked,
                        }))
                      }
                      className="rounded"
                    />
                    <label
                      htmlFor="twoFactorAuth"
                      className="text-sm font-medium"
                    >
                      Двухфакторная аутентификация
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="auditLog"
                      checked={settings.auditLog}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          auditLog: e.target.checked,
                        }))
                      }
                      className="rounded"
                    />
                    <label htmlFor="auditLog" className="text-sm font-medium">
                      Журнал аудита
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Настройки уведомлений */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Настройки уведомлений</h3>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="emailNotifications"
                      checked={settings.emailNotifications}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          emailNotifications: e.target.checked,
                        }))
                      }
                      className="rounded"
                    />
                    <label
                      htmlFor="emailNotifications"
                      className="text-sm font-medium"
                    >
                      Email уведомления
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="smsNotifications"
                      checked={settings.smsNotifications}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          smsNotifications: e.target.checked,
                        }))
                      }
                      className="rounded"
                    />
                    <label
                      htmlFor="smsNotifications"
                      className="text-sm font-medium"
                    >
                      SMS уведомления
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="systemAlerts"
                      checked={settings.systemAlerts}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          systemAlerts: e.target.checked,
                        }))
                      }
                      className="rounded"
                    />
                    <label
                      htmlFor="systemAlerts"
                      className="text-sm font-medium"
                    >
                      Системные оповещения
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="reportNotifications"
                      checked={settings.reportNotifications}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          reportNotifications: e.target.checked,
                        }))
                      }
                      className="rounded"
                    />
                    <label
                      htmlFor="reportNotifications"
                      className="text-sm font-medium"
                    >
                      Уведомления о отчетах
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Webhook URL (для интеграций)
                    </label>
                    <Input
                      type="url"
                      value={settings.webhookUrl}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          webhookUrl: e.target.value,
                        }))
                      }
                      placeholder="https://example.com/webhook"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Настройки интерфейса */}
            {activeTab === "interface" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Настройки интерфейса</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Тема оформления
                    </label>
                    <Select
                      value={settings.theme}
                      onValueChange={(value) =>
                        setSettings((prev) => ({ ...prev, theme: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Светлая</SelectItem>
                        <SelectItem value="dark">Темная</SelectItem>
                        <SelectItem value="auto">Автоматически</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Размер страницы по умолчанию
                    </label>
                    <Select
                      value={settings.defaultPageSize}
                      onValueChange={(value) =>
                        setSettings((prev) => ({
                          ...prev,
                          defaultPageSize: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">25 записей</SelectItem>
                        <SelectItem value="50">50 записей</SelectItem>
                        <SelectItem value="100">100 записей</SelectItem>
                        <SelectItem value="200">200 записей</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Формат экспорта по умолчанию
                    </label>
                    <Select
                      value={settings.exportFormat}
                      onValueChange={(value) =>
                        setSettings((prev) => ({
                          ...prev,
                          exportFormat: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                        <SelectItem value="csv">CSV (.csv)</SelectItem>
                        <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                        <SelectItem value="json">JSON (.json)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="compactMode"
                      checked={settings.compactMode}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          compactMode: e.target.checked,
                        }))
                      }
                      className="rounded"
                    />
                    <label
                      htmlFor="compactMode"
                      className="text-sm font-medium"
                    >
                      Компактный режим
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="showStatistics"
                      checked={settings.showStatistics}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          showStatistics: e.target.checked,
                        }))
                      }
                      className="rounded"
                    />
                    <label
                      htmlFor="showStatistics"
                      className="text-sm font-medium"
                    >
                      Показывать статистику на главной странице
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="apiAccess"
                      checked={settings.apiAccess}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          apiAccess: e.target.checked,
                        }))
                      }
                      className="rounded"
                    />
                    <label htmlFor="apiAccess" className="text-sm font-medium">
                      Разрешить доступ к API
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
