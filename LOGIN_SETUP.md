# Login Setup - Quick Start

## ✅ Как работает сейчас

### Автоматическая проверка токена

При открытии приложения:

1. **Токена НЕТ** → автоматический редирект на `/login`
2. **Токен ЕСТЬ** → автоматический редирект на `/admin`

### После логина

1. Пользователь вводит логин/пароль на `/login`
2. Токен получен от API
3. Токен сохранен в Redux Persist (localStorage)
4. **Автоматический редирект** на `/admin`

### При перезагрузке страницы

- Redux Persist **автоматически восстанавливает** токен из localStorage
- Если токен есть → сразу открывается `/admin`
- Если токена нет → открывается `/login`

---

## Что было сделано

### 1. Настройка API
- **Endpoint**: `https://test.webbroker.ranks.pro/main/robo/admin_login/`
- Обновлен файл `src/shared/config/api.config.ts`
- Создан axios interceptor для автоматического добавления токена ко всем запросам

### 2. Redux State Management
- **userSlice** (`src/entities/User/slice/userSlice.ts`):
  - `loginThunk` - асинхронный thunk для логина
  - `logout` - выход из системы
  - Состояние: `token`, `userId`, `isAuthenticated`, `isLoading`, `error`

### 3. Axios Interceptor
- **Файл**: `src/shared/api/axios.config.ts`
- Автоматически добавляет токен к заголовку `Authorization: Bearer <token>`
- Обрабатывает ошибки 401 (Unauthorized)

### 4. Login Page
- **Файл**: `src/pages/LoginPage/LoginPage.tsx`
- Форма с валидацией
- Отображение ошибок
- Автоматический редирект после успешного логина
- Предзаполненные данные для тестирования:
  - Username: `admin`
  - Password: `YXL%jhR2|KCVb4@wF7D~TK#7cgbdZ#vZ`

### 5. Route Protection
- AdminPage теперь защищена через `RequireAuthRoute`
- Неавторизованные пользователи автоматически перенаправляются на `/login`

### 6. Token Persistence
- Токен сохраняется в Redux Persist
- После перезагрузки страницы пользователь остается авторизованным

## Как использовать

### Запуск приложения

```bash
npm run dev
```

### Первый запуск (токена нет)

1. Откройте `http://localhost:5173`
2. **Автоматически** перенаправит на `/login`
3. Введите данные:
   - **Username**: `admin`
   - **Password**: `YXL%jhR2|KCVb4@wF7D~TK#7cgbdZ#vZ`
4. Нажмите "Войти"
5. **Автоматически** перенаправит на `/admin`

### Повторный запуск (токен сохранен)

1. Откройте `http://localhost:5173`
2. **Автоматически** перенаправит на `/admin` (токен из localStorage)
3. Вход не требуется!

### Выход из системы

1. Нажмите кнопку "Logout" в Header
2. Токен удален из localStorage
3. **Автоматически** перенаправит на `/login`

### Проверка токена

```javascript
// В консоли браузера
localStorage.getItem('persist:root')
// Должен содержать токен в JSON
```

## Как делать запросы с токеном

### Использование apiClient

```typescript
import { apiClient } from 'shared/api/axios.config';

// Токен автоматически добавится к запросу
const fetchData = async () => {
  const response = await apiClient.get('/main/robo/some-endpoint/');
  return response.data;
};

// POST запрос
const createData = async (data: any) => {
  const response = await apiClient.post('/main/robo/create-endpoint/', data);
  return response.data;
};
```

### Создание нового API метода

```typescript
// src/entities/YourEntity/api/yourEntityApi.ts
import { apiClient } from 'shared/api/axios.config';

export const yourEntityApi = {
  getData: async () => {
    const response = await apiClient.get('/main/robo/your-endpoint/');
    return response.data;
  },
};
```

### Создание Redux thunk

```typescript
// src/entities/YourEntity/slice/yourEntitySlice.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { yourEntityApi } from '../api/yourEntityApi';
import { RootState } from 'app/providers/store/config/store';

export const fetchDataThunk = createAsyncThunk<
  YourDataType,
  void,
  { state: RootState; rejectValue: string }
>(
  'yourEntity/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      return await yourEntityApi.getData();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
```

## Файловая структура

```
src/
├── shared/
│   ├── api/
│   │   └── axios.config.ts          # Axios interceptor
│   └── config/
│       └── api.config.ts             # API endpoints
├── entities/
│   └── User/
│       ├── api/
│       │   └── userApi.ts            # User API methods
│       ├── slice/
│       │   └── userSlice.ts          # Redux slice
│       └── types/
│           └── user.types.ts         # TypeScript types
├── pages/
│   └── LoginPage/
│       └── LoginPage.tsx             # Login page component
└── app/
    └── providers/
        └── router/
            └── ui/
                ├── RequireAuth.tsx   # Route protection
                └── AppRouter.tsx     # Router config
```

## Переменные окружения

Файл `.env`:

```env
VITE_API_BASE_URL=https://test.webbroker.ranks.pro
```

## Важные замечания

1. **Токен автоматически добавляется** ко всем запросам через `apiClient`
2. **Используйте `apiClient`**, а не обычный `axios`, для запросов с токеном
3. **Redux Persist** сохраняет токен в localStorage
4. **RequireAuth** защищает приватные маршруты
5. **Logout** очищает токен и перенаправляет на `/login`

## Логика редиректов

```
Открыть приложение
    ↓
Проверка токена в Redux Persist
    ↓
┌───────────────┬───────────────┐
│ Токен есть    │ Токена нет    │
└───────┬───────┴───────┬───────┘
        ↓               ↓
    /admin          /login
        ↓               ↓
   AdminPage      Ввод логина
                       ↓
                  Получен токен
                       ↓
                  Сохранен в localStorage
                       ↓
                   /admin
```

## Дополнительная документация

- `REDIRECT_LOGIC.md` - **Подробная схема** логики редиректов
- `AUTHENTICATION.md` - Полная документация по аутентификации
- `ARCHITECTURE.md` - Архитектура проекта (FSD)
- `CLAUDE_INSTRUCTIONS.md` - Инструкции для разработки

## Проверка работы

Проект успешно компилируется:

```bash
npm run build
# ✓ built in 5.51s
```

## Важно!

✅ **Токен автоматически проверяется** при загрузке
✅ **Redux Persist сохраняет токен** в localStorage
✅ **Автоматические редиректы** работают везде
✅ **Не нужно вручную проверять токен** в компонентах

Все готово к использованию! 🎉
