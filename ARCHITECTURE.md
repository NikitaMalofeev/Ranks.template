# Архитектура проекта

Проект построен на базе методологии **Feature-Sliced Design (FSD)**.

## 📐 Принципы Feature-Sliced Design

### Слои (Layers)

Проект разделен на слои по уровню ответственности:

1. **app** - инициализация и конфигурация приложения
2. **pages** - страницы приложения
3. **widgets** - крупные композитные блоки
4. **features** - функциональные возможности (фичи)
5. **entities** - бизнес-сущности
6. **shared** - переиспользуемый код

### Правила импортов

- **Слой может импортировать только из нижележащих слоев**
- **Запрещены циклические зависимости**
- **Shared может использоваться везде**

```
app → pages → widgets → features → entities → shared
```

## 🗂 Структура слоев

### 1. App Layer (`src/app/`)

Инициализация приложения, провайдеры, глобальные стили.

```
app/
├── providers/
│   ├── ErrorBoundary/    # Обработка ошибок React
│   ├── router/           # Конфигурация роутинга
│   └── store/            # Redux store
├── styles/               # Глобальные стили
└── types/                # Глобальные типы
```

### 2. Pages Layer (`src/pages/`)

Страницы приложения. Каждая страница - отдельная папка.

```
pages/
├── HomePage/
│   ├── HomePage.tsx
│   └── HomePage.module.scss
├── LoginPage/
└── ErrorPage/
```

**Правила:**
- Страница не должна импортировать другие страницы
- Страница композирует widgets и features
- Lazy loading через `React.lazy()`

### 3. Widgets Layer (`src/widgets/`)

Крупные композитные блоки, используемые на страницах.

```
widgets/
├── Header/
│   ├── Header.tsx
│   └── Header.module.scss
└── Footer/
```

**Примеры:** Header, Footer, Sidebar, CommentsList

### 4. Features Layer (`src/features/`)

Функциональные возможности приложения.

```
features/
└── Auth/
    ├── LoginForm/
    │   ├── LoginForm.tsx
    │   └── LoginForm.module.scss
    └── RegisterForm/
```

**Примеры:** LoginForm, CommentForm, ProductFilter, AddToCart

**Правила:**
- Feature решает конкретную пользовательскую задачу
- Может использовать entities и shared
- Не может импортировать другие features

### 5. Entities Layer (`src/entities/`)

Бизнес-сущности приложения.

```
entities/
├── User/
│   ├── api/              # API запросы
│   ├── model/            # Бизнес-логика
│   ├── slice/            # Redux slice
│   ├── types/            # TypeScript типы
│   └── ui/               # UI компоненты сущности
└── Product/
```

**Примеры:** User, Product, Order, Comment

**Правила:**
- Содержит модели данных и бизнес-логику
- Может использовать только shared
- Entities независимы друг от друга

### 6. Shared Layer (`src/shared/`)

Переиспользуемый код без привязки к бизнес-логике.

```
shared/
├── ui/                   # UI компоненты
│   ├── Button/
│   ├── Input/
│   └── Modal/
├── lib/                  # Утилиты и хелперы
│   ├── helpers/
│   └── hoc/
├── hooks/                # Общие хуки
├── config/               # Конфигурация
├── api/                  # Базовая настройка API
└── assets/               # Статические файлы
```

**Примеры:** UI-kit компоненты, утилиты, хуки, константы

## 🔄 Пример потока данных

```
User clicks button → Feature handles action →
Entity updates state → Widget/Page renders update
```

Конкретный пример авторизации:

```
LoginPage (pages)
  └── uses LoginForm (features)
      └── dispatches action to UserSlice (entities)
          └── uses userApi (entities)
```

## 📦 Segments (Сегменты)

Внутри каждого слоя могут быть сегменты:

- `ui/` - React компоненты
- `model/` - бизнес-логика, хуки
- `api/` - API запросы
- `lib/` - вспомогательные утилиты
- `config/` - конфигурация
- `types/` - TypeScript типы

Пример:

```
entities/User/
├── api/
│   └── userApi.ts
├── model/
│   └── useUser.ts
├── slice/
│   └── userSlice.ts
├── types/
│   └── user.types.ts
└── ui/
    └── UserCard.tsx
```

## 🚫 Анти-паттерны

❌ **Не делайте так:**

```typescript
// pages импортирует features напрямую - плохо если не композирует
import { useUserData } from 'features/User/model/useUser';

// features импортирует другие features
import { ProductCard } from 'features/Product';

// entities импортирует features
import { LoginForm } from 'features/Auth';
```

✅ **Делайте так:**

```typescript
// pages композирует widgets и features
import { LoginForm } from 'features/Auth/LoginForm/LoginForm';
import { Header } from 'widgets/Header/Header';

// features использует entities
import { useAppDispatch } from 'shared/hooks/useAppDispatch';
import { setUserToken } from 'entities/User/slice/userSlice';

// entities использует shared
import { apiClient } from 'shared/api/client';
```

## 🎯 Когда создавать что?

### Создать Feature, если:
- Это пользовательская функция (логин, добавление в корзину)
- Требует взаимодействие с несколькими entities
- Имеет собственный UI и логику

### Создать Entity, если:
- Это бизнес-объект (User, Product, Order)
- Имеет состояние в Redux
- Используется в разных features

### Создать Widget, если:
- Это крупный композитный блок (Header, Sidebar)
- Используется на нескольких страницах
- Включает несколько features/entities

### Добавить в Shared, если:
- Это переиспользуемый UI компонент
- Это утилита без бизнес-логики
- Это общий хук или конфигурация

## 📚 Дополнительные ресурсы

- [Feature-Sliced Design официальная документация](https://feature-sliced.design/)
- [FSD примеры](https://github.com/feature-sliced/examples)

---

Следуя этим принципам, вы создадите поддерживаемый и масштабируемый проект! 🚀
