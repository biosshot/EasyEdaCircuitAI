# Система управления темами (Theme System)

Приложение содержит унифицированную систему управления цветами и темами, позволяющую легко переключаться между различными цветовыми схемами.

## Структура

### 1. **`src/theme/colors.ts`** - Палетка цветов
Содержит определения всех цветов для темной и светлой тем:

```typescript
// Используются семантические имена для цветов
export const semanticColors = {
  primary: '#10a37f',           // Основной цвет (зеленый)
  primaryLight: '#10b981',      // Светлый вариант
  primaryDark: '#088860',       // Темный вариант
  // ... другие цвета
};

export const lightThemeColors = {
  primary: '#0ea5e9',           // Синий для светлой темы
  // ... остальные цвета
};
```

### 2. **`src/theme/themes.ts`** - Конфигурации тем
Определяет полные конфигурации для каждой темы:

```typescript
export const darkTheme: ThemeConfig = {
  name: 'dark',
  colors: semanticColors,
  cssVariables: {
    '--color-primary': semanticColors.primary,
    '--color-background': semanticColors.background,
    // ... все CSS переменные
  },
};

export const lightTheme: ThemeConfig = {
  name: 'light',
  colors: lightThemeColors,
  cssVariables: { /* ... */ },
};
```

### 3. **`src/theme/theme-variables.css`** - CSS переменные
Глобальный файл CSS с переменными для обеих тем:

```css
:root {
  --color-primary: #10a37f;
  --color-background: #0d1117;
  --color-text: #ececf1;
  /* ... */
}

[data-theme='light'] {
  --color-primary: #0ea5e9;
  --color-background: #ffffff;
  /* ... */
}
```

### 4. **`src/composables/useTheme.ts`** - Composable для управления темой
Реактивный API для работы с темами в Vue компонентах:

```typescript
export function useTheme() {
  return {
    currentTheme,      // Текущая тема ('dark' или 'light')
    isDark,            // boolean - темная тема?
    isLight,           // boolean - светлая тема?
    theme,             // ThemeConfig текущей темы
    setTheme(name),    // Установить тему
    toggleTheme(),     // Переключить между темами
    initializeTheme(), // Инициализировать при загрузке
  };
}
```

## Использование в компонентах

### В шаблонах Vue
Используйте CSS переменные вместо жестко закодированных цветов:

```vue
<style scoped>
.button {
  background-color: var(--color-primary);     /* Основной цвет */
  color: var(--color-text-on-primary);        /* Текст на цвете */
  border-color: var(--color-border);          /* Границы */
}

.button:hover {
  background-color: var(--color-primary-dark); /* Темный вариант */
}

.container {
  background: var(--color-background);        /* Основной фон */
  color: var(--color-text);                   /* Основной текст */
}
</style>
```

### В JavaScript/TypeScript
Используйте composable `useTheme()`:

```typescript
import { useTheme } from '@/composables/useTheme';

export default {
  setup() {
    const { isDark, currentTheme, setTheme, toggleTheme } = useTheme();
    
    const switchToLight = () => setTheme('light');
    const switch ToDark = () => setTheme('dark');
    const toggleDarkMode = () => toggleTheme();
    
    return {
      isDark,
      currentTheme,
      switchToLight,
      switchToDark,
      toggleDarkMode,
    };
  },
};
```

## Доступные CSS переменные

### Цвета
- `--color-primary` - Основной цвет
- `--color-primary-light` - Светлый вариант основного
- `--color-primary-dark` - Темный вариант основного
- `--color-secondary` - Вторичный цвет
- `--color-success` - Цвет успеха
- `--color-error` - Цвет ошибки
- `--color-warning` - Цвет предупреждения
- `--color-info` - Информационный цвет

### Фоны
- `--color-background` - Основной фон
- `--color-background-secondary` - Вторичный фон
- `--color-background-tertiary` - Третичный фон

### Поверхности
- `--color-surface` - Поверхность элементов
- `--color-surface-hover` - При наведении
- `--color-surface-active` - Активное состояние

### Границы
- `--color-border` - Стандартная граница
- `--color-border-dark` - Темная граница
- `--color-border-light` - Светлая граница

### Текст
- `--color-text` - Основной текст
- `--color-text-secondary` - Вторичный текст
- `--color-text-tertiary` - Третичный текст
- `--color-text-muted` - Приглушенный текст
- `--color-text-on-primary` - Текст на основном цвете
- `--color-text-on-secondary` - Текст на вторичном цвете

### Прочие
- `--scrollbar-bg` - Фон скроллбара
- `--scrollbar-border` - Граница скроллбара
- `--scrollbar-hover` - Скроллбар при наведении
- `--scrollbar-active` - Активный скроллбар

## Добавление новой темы

Чтобы добавить новую тему (например, `sepia`), сделайте следующее:

1. **Добавьте палетку в `colors.ts`:**
```typescript
export const sepiaColors = {
  primary: '#8b6914',
  primaryLight: '#a0791a',
  primaryDark: '#6d5410',
  // ... остальные цвета
};
```

2. **Добавьте конфигурацию в `themes.ts`:**
```typescript
export const sepiaTheme: ThemeConfig = {
  name: 'sepia',
  colors: sepiaColors,
  cssVariables: {
    '--color-primary': sepiaColors.primary,
    // ... все CSS переменные
  },
};

export const themes: Record<ThemeName, ThemeConfig> = {
  dark: darkTheme,
  light: lightTheme,
  sepia: sepiaTheme,
};
```

3. **Добавьте CSS для темы в `theme-variables.css`:**
```css
[data-theme='sepia'] {
  --color-primary: #8b6914;
  --color-background: #f5f3f0;
  --color-text: #3e3e3e;
  /* ... */
}
```

4. **Обновите тип `ThemeName`:**
```typescript
export type ThemeName = 'dark' | 'light' | 'sepia';
```

## Хранение в localStorage

Выбранная тема автоматически сохраняется в `localStorage` с ключом `app-theme` и восстанавливается при перезагрузке страницы.

Если пользователь никогда не выбирал тему, используются системные предпочтения (`prefers-color-scheme`).

## Инициализация в приложении

В `App.vue` уже добавлена инициализация:

```typescript
import { initializeTheme } from './composables/useTheme.ts';
import './theme/theme-variables.css';

onMounted(() => {
  initializeTheme();
});
```

## Примеры использования

### Переключатель тем в UI
```vue
<template>
  <button @click="toggleTheme">
    {{ isDark ? '🌙 Темная' : '☀️ Светлая' }}
  </button>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme';

const { isDark, toggleTheme } = useTheme();
</script>
```

### Условное применение стилей
```vue
<template>
  <div :class="{ dark: isDark, light: isLight }">
    Контент адаптируется к теме
  </div>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme';

const { isDark, isLight } = useTheme();
</script>
```

### Использование цветов в JavaScript
```typescript
import { useTheme } from '@/composables/useTheme';

const { theme } = useTheme();

// Получить конкретный цвет
const primaryColor = theme.value.colors.primary;
```

## Миграция существующего кода

Все компоненты уже мигрированы на использование CSS переменных:

- ✅ `App.vue`
- ✅ `Navbar.vue`
- ✅ `ChatView.vue`
- ✅ `ChatMessageContent.vue`
- ✅ `ChatControls.vue`
- ✅ `SearchView.vue`
- ✅ `SettingsView.vue`
- ✅ `GenerateView.vue`
- ✅ `PdfFileViewer.vue`

Для новых компонентов всегда используйте CSS переменные вместо жестко закодированных цветов.

## Лучшие практики

1. **Используйте семантические имена** - вместо `#10a37f` используйте `var(--color-primary)`
2. **Группируйте связанные цвета** - текст, фон, границы для одного элемента должны быть согласованы
3. **Учитывайте доступность** - убедитесь, что контраст между текстом и фоном достаточен
4. **Тестируйте обе темы** - проверяйте внешний вид в темной и светлой темах
5. **Документируйте исключения** - если вы используете абсолютный цвет, объясните почему

## Трудноостанавливаемые цвета

Некоторые цвета специфичны для синтаксиса и остаются фиксированными:
- `#79c0ff` - цвет синтаксиса (blue) в коде
- `#fca5a5` - цвет ошибок в PDF viewer

Эти цвета не связаны с темой и используются только для специального контента.
