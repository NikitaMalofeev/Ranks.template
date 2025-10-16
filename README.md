# Ranks Template

Шаблон проекта на базе архитектуры **Feature-Sliced Design**, созданный на основе Ranks.autopilot.

## 🚀 Технологический стек

- **React 18** - UI библиотека
- **TypeScript** - типизация
- **Vite** - сборщик и dev-сервер
- **Redux Toolkit** - управление состоянием
- **Redux Persist** - персистентность состояния
- **React Router DOM v7** - маршрутизация
- **Ant Design (antd)** - UI компоненты
- **SCSS Modules** - стилизация
- **ESLint** - линтинг кода

## 📁 Структура проекта (Feature-Sliced Design)

```
src/
├── app/                    # Инициализация приложения
│   ├── providers/         # Провайдеры (Router, Store, ErrorBoundary)
│   ├── styles/           # Глобальные стили
│   └── types/            # Глобальные типы
│
├── pages/                 # Страницы приложения
│   ├── HomePage/
│   ├── LoginPage/
│   ├── ErrorPage/
│   └── NotFoundPage/
│
├── widgets/              # Композитные блоки (Header, Footer, etc.)
│
├── features/             # Функциональные фичи
│   └── Auth/            # Пример: авторизация
│
├── entities/             # Бизнес-сущности
│   ├── User/
│   └── ui/              # UI сущности (модалки, уведомления)
│
└── shared/              # Переиспользуемый код
    ├── ui/             # UI компоненты
    ├── lib/            # Утилиты и хелперы
    ├── hooks/          # Общие хуки
    ├── config/         # Конфигурация
    └── assets/         # Статические ресурсы
```

## 🛠 Установка и запуск

### Установка зависимостей

```bash
npm install
```

### Запуск dev-сервера

```bash
npm run dev
```

### Сборка проекта

```bash
npm run build
```

### Предпросмотр production сборки

```bash
npm run preview
```

### Линтинг

```bash
npm run lint
```

## 🔧 Конфигурация

### Алиасы путей

В проекте настроены следующие алиасы:

- `app/*` → `src/app/*`
- `pages/*` → `src/pages/*`
- `widgets/*` → `src/widgets/*`
- `features/*` → `src/features/*`
- `entities/*` → `src/entities/*`
- `shared/*` → `src/shared/*`

Пример использования:

```typescript
import { Button } from 'shared/ui/Button/Button';
import { useAppDispatch } from 'shared/hooks/useAppDispatch';
import { logout } from 'entities/User/slice/userSlice';
```

### Переменные окружения

Скопируйте `.env.example` в `.env` и настройте переменные:

```bash
cp .env.example .env
```

## 📦 Redux Store

Store настроен с Redux Persist для сохранения состояния между сессиями.

### Добавление нового slice

1. Создайте slice в `entities/` или соответствующей папке:

```typescript
// entities/Example/slice/exampleSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ExampleState {
  data: string;
}

const initialState: ExampleState = {
  data: '',
};

const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<string>) => {
      state.data = action.payload;
    },
  },
});

export const { setData } = exampleSlice.actions;
export default exampleSlice.reducer;
```

2. Добавьте reducer в store:

```typescript
// app/providers/store/config/store.ts
import exampleReducer from 'entities/Example/slice/exampleSlice';

const rootReducer = combineReducers({
  user: userReducer,
  example: exampleReducer, // добавить здесь
});
```

3. Добавьте в whitelist для persist (опционально):

```typescript
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'example'], // добавить сюда
};
```

## 🎨 Стилизация

### SCSS Modules

Каждый компонент может иметь свой `.module.scss` файл:

```tsx
import styles from './Component.module.scss';

export const Component = () => {
  return <div className={styles.container}>Content</div>;
};
```

### Глобальные переменные

Используйте CSS-переменные из `src/app/styles/variables/global.scss`:

```scss
.myClass {
  color: var(--primary-color);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-base);
}
```

### SCSS Mixins

Используйте миксины из `src/app/styles/_mixins.scss`:

```scss
@use 'app/styles/mixins' as mix;

.responsive {
  @include mix.respond-to('tablet') {
    // стили для планшетов и выше
  }
}

.centered {
  @include mix.flex-center;
}
```

## 🔐 Авторизация

Базовая авторизация настроена через Redux:

- **PublicRoute** - для неавторизованных (страница логина)
- **RequireAuth** - для авторизованных пользователей

Токен сохраняется в Redux Store с помощью Redux Persist.

### Mock авторизация

В `LoginPage` настроена mock-авторизация для демонстрации. Замените на реальный API:

```typescript
// Заменить это:
const mockToken = 'mock-jwt-token-' + Date.now();
dispatch(setUserToken(mockToken));

// На реальный API вызов:
const response = await authApi.login(values);
dispatch(setUserToken(response.token));
```

## 🧩 Добавление новой страницы

1. Создайте компонент страницы:

```tsx
// pages/NewPage/NewPage.tsx
const NewPage = () => {
  return <div>New Page</div>;
};

export default NewPage;
```

2. Добавьте lazy import в `AppRouter`:

```typescript
const NewPage = lazy(() => import('pages/NewPage/NewPage'));
```

3. Добавьте роут:

```tsx
<Route
  path="/new"
  element={
    <Suspense fallback={<Loader />}>
      <NewPage />
    </Suspense>
  }
/>
```

## 📱 Адаптивность

Используйте миксин `respond-to` для адаптивного дизайна:

```scss
@use 'app/styles/mixins' as mix;

.container {
  padding: 10px;

  @include mix.respond-to('tablet') {
    padding: 20px;
  }

  @include mix.respond-to('desktop') {
    padding: 30px;
  }
}
```

Доступные breakpoints:
- `mobile`: 320px
- `tablet`: 768px
- `desktop`: 1024px
- `wide`: 1440px

## 🚨 Обработка ошибок

Настроен ErrorBoundary для перехвата ошибок React:

```tsx
<ErrorBoundary
  fallbackRender={(error, errorInfo, reset) => (
    <ErrorPage error={error} errorInfo={errorInfo} resetErrorBoundary={reset} />
  )}
>
  <App />
</ErrorBoundary>
```

## 📚 Полезные хуки

### useAppDispatch

Типизированный dispatch для Redux:

```typescript
import { useAppDispatch } from 'shared/hooks/useAppDispatch';

const dispatch = useAppDispatch();
dispatch(someAction());
```

### classNames

Утилита для условных классов:

```typescript
import { classNames } from 'shared/lib/helpers/classNames/classNames';

const className = classNames(
  'base-class',
  { 'active': isActive, 'disabled': isDisabled },
  ['additional-class']
);
```

## 🎯 Рекомендации

1. **Следуйте Feature-Sliced Design** - размещайте код в соответствующих слоях
2. **Используйте алиасы** - избегайте относительных импортов `../../..`
3. **Типизируйте все** - используйте TypeScript для всего кода
4. **Модульные стили** - используйте SCSS modules для инкапсуляции стилей
5. **Lazy loading** - используйте для страниц и тяжелых компонентов

## 📝 License

MIT

---

**Создано на основе Ranks.autopilot** 🚀
