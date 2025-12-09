# Settings Store и SettingsView

## Описание

Реализована система управления настройками API для LLM (Language Model) провайдеров.

### Компоненты

#### 1. **settingsStore.ts** (`web/src/stores/settingsStore.ts`)
Pinia store для управления настройками LLM.

**Интерфейс LLMSettings:**
```typescript
interface LLMSettings {
    apiProvider: 'openai' | 'anthropic' | 'custom';
    apiKey: string;
    apiUrl: string;
    model: string;
}
```

**Основные методы:**
- `initSettings()` - инициализирует настройки из localStorage
- `updateSettings(newSettings)` - обновляет несколько параметров сразу
- `setApiProvider(provider)` - устанавливает провайдера (с автоматическим заполнением URL и модели)
- `setApiKey(apiKey)` - сохраняет API ключ
- `setApiUrl(apiUrl)` - устанавливает URL API
- `setModel(model)` - выбирает модель
- `saveSettings()` - сохраняет настройки в localStorage
- `resetSettings()` - сбрасывает на значения по умолчанию

**Getters:**
- `getLLMSettings` - получить все настройки
- `getApiKey` - получить API ключ
- `getApiProvider` - получить текущего провайдера
- `getApiUrl` - получить URL API
- `getModel` - получить текущую модель

#### 2. **SettingsView.vue** (`web/src/components/SettingsView.vue`)
Компонент интерфейса для управления настройками.

**Функциональность:**
- Выбор провайдера (OpenAI, Anthropic, Custom)
- Ввод API ключа (отображается как password field для безопасности)
- Настройка URL API
- Выбор модели
- Сохранение и сброс настроек
- Отображение статуса сохранения
- Просмотр текущей конфигурации

#### 3. **Интеграция в навигацию**
- Добавлена вкладка "Settings" в Navbar.vue
- Добавлена компонента SettingsView в App.vue

## Использование

### В компонентах:
```typescript
import { useSettingsStore } from '../stores/settingsStore';

const settingsStore = useSettingsStore();

// Инициализация при монтировании
onMounted(() => {
  settingsStore.initSettings();
});

// Чтение настроек
const apiKey = settingsStore.getApiKey;
const model = settingsStore.getModel;
const settings = settingsStore.getLLMSettings;

// Обновление настроек
settingsStore.setApiKey('sk-...');
settingsStore.setModel('gpt-4-turbo');
```

## Хранение данных

Все настройки сохраняются в `localStorage` браузера под ключом `llm_settings`.

**Значения по умолчанию:**
- Provider: OpenAI
- API URL: https://api.openai.com/v1
- Model: gpt-4
- API Key: (пусто)

## Безопасность

⚠️ **Важно:** API ключи хранятся в `localStorage` браузера. Это подходит для локального использования в расширениях, но для production приложений рекомендуется:
- Использовать backend API для хранения ключей
- Добавить дополнительное шифрование
- Никогда не передавать ключи в открытом виде по сети
