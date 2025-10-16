# Логика редиректов и авторизации

## Схема работы

```
┌─────────────────────────────────────────────────────────────┐
│                    Пользователь открывает приложение         │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            v
                ┌───────────────────────┐
                │  Redux Persist        │
                │  проверяет localStorage│
                └───────────┬───────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                v                       v
        ┌──────────────┐        ┌──────────────┐
        │ Токен есть   │        │ Токена нет   │
        │ (user.token) │        │ (user.token) │
        └──────┬───────┘        └──────┬───────┘
               │                       │
               │                       │
               v                       v
    ┌──────────────────┐     ┌──────────────────┐
    │ Переход на "/"   │     │ Переход на "/"   │
    └──────┬───────────┘     └──────┬───────────┘
           │                         │
           v                         v
    ┌──────────────────┐     ┌──────────────────┐
    │ Редирект на      │     │ Редирект на      │
    │ /admin           │     │ /login           │
    └──────┬───────────┘     └──────┬───────────┘
           │                         │
           v                         v
    ┌──────────────────┐     ┌──────────────────┐
    │ AdminPage        │     │ LoginPage        │
    │ (защищена)       │     │ (публичная)      │
    └──────────────────┘     └──────┬───────────┘
                                    │
                                    │ Ввод логина/пароля
                                    v
                             ┌──────────────────┐
                             │ API запрос       │
                             │ /admin_login/    │
                             └──────┬───────────┘
                                    │
                        ┌───────────┴───────────┐
                        │                       │
                        v                       v
                ┌──────────────┐        ┌──────────────┐
                │ Успешно      │        │ Ошибка       │
                │ (token)      │        │ (error)      │
                └──────┬───────┘        └──────┬───────┘
                       │                       │
                       v                       v
                ┌──────────────┐        ┌──────────────┐
                │ Сохранить в  │        │ Показать     │
                │ Redux        │        │ сообщение    │
                │ Persist      │        │ об ошибке    │
                └──────┬───────┘        └──────────────┘
                       │
                       v
                ┌──────────────┐
                │ Редирект на  │
                │ /admin       │
                └──────────────┘
```

## Компоненты системы авторизации

### 1. AppRouter (`src/app/providers/router/ui/AppRouter.tsx`)

Главный роутер приложения, проверяет наличие токена:

```typescript
// Главная страница
<Route
  path="/"
  element={<Navigate to={token ? "/admin" : "/login"} replace />}
/>
```

**Логика:**
- Если токен есть → редирект на `/admin`
- Если токена нет → редирект на `/login`

### 2. RequireAuth (`src/app/providers/router/ui/RequireAuth.tsx`)

Защита приватных маршрутов:

```typescript
const RequireAuthRoute = ({ children }) => {
  const token = useSelector((state) => state.user.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
```

**Логика:**
- Проверяет наличие токена в Redux
- Если токена нет → редирект на `/login`
- Если токен есть → рендерит защищенный компонент

### 3. PublicRoute (`src/app/providers/router/ui/PublicRoute.tsx`)

Защита публичных маршрутов (страница логина):

```typescript
const PublicRoute = ({ children }) => {
  const token = useSelector((state) => state.user.token);

  if (token) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};
```

**Логика:**
- Проверяет наличие токена
- Если токен есть → редирект на `/admin`
- Если токена нет → показывает страницу логина

### 4. LoginPage (`src/pages/LoginPage/LoginPage.tsx`)

Форма входа:

```typescript
const onFinish = async (values) => {
  try {
    await dispatch(loginThunk(values)).unwrap();
    message.success('Вход выполнен успешно!');
    navigate('/admin', { replace: true });
  } catch (err) {
    message.error(err || 'Ошибка входа');
  }
};
```

**Логика:**
- Отправляет логин/пароль на сервер
- При успехе: сохраняет токен в Redux и делает редирект на `/admin`
- При ошибке: показывает сообщение об ошибке

## Примеры сценариев

### Сценарий 1: Первый вход (токена нет)

1. Пользователь открывает `http://localhost:5173/`
2. Redux Persist проверяет localStorage → токена нет
3. AppRouter редиректит на `/login`
4. PublicRoute проверяет токен → токена нет → показывает LoginPage
5. Пользователь вводит логин/пароль и нажимает "Войти"
6. Отправка запроса на API
7. Получение токена
8. Сохранение токена в Redux Persist → localStorage
9. Редирект на `/admin`
10. RequireAuth проверяет токен → токен есть → показывает AdminPage

### Сценарий 2: Повторный вход (токен есть)

1. Пользователь открывает `http://localhost:5173/`
2. Redux Persist восстанавливает токен из localStorage
3. AppRouter проверяет токен → токен есть → редирект на `/admin`
4. RequireAuth проверяет токен → токен есть → показывает AdminPage

### Сценарий 3: Попытка доступа к /login с активным токеном

1. Пользователь (авторизован) переходит на `/login`
2. PublicRoute проверяет токен → токен есть → редирект на `/admin`

### Сценарий 4: Попытка доступа к /admin без токена

1. Пользователь (не авторизован) переходит на `/admin`
2. RequireAuth проверяет токен → токена нет → редирект на `/login`

### Сценарий 5: Выход из системы

1. Пользователь нажимает кнопку "Logout" в Header
2. Dispatch действия `logout()`
3. Очистка токена из Redux
4. Очистка localStorage
5. Редирект на `/login`

## Redux State

```typescript
interface UserState {
  token: string;              // JWT токен
  userId: string | null;      // ID пользователя
  isAuthenticated: boolean;   // Статус авторизации
  isLoading: boolean;         // Загрузка
  error: string | null;       // Ошибка
}
```

## Redux Persist Configuration

```typescript
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'menuSettings', 'portfolio', 'tabs'],
};
```

**Что сохраняется:**
- `user.token` - JWT токен
- `user.userId` - ID пользователя
- `user.isAuthenticated` - статус авторизации

**Что НЕ сохраняется (reset при перезагрузке):**
- `user.isLoading` - временное состояние
- `user.error` - временные ошибки

## Проверка работы

### 1. Проверка без токена

```bash
# Очистить localStorage
localStorage.clear()

# Перезагрузить страницу
# → Должен показаться LoginPage
```

### 2. Проверка с токеном

```bash
# После успешного логина
# → Токен сохранен в localStorage
# → При перезагрузке страницы показывается AdminPage
```

### 3. Проверка выхода

```bash
# Нажать кнопку "Logout"
# → localStorage очищен
# → Редирект на LoginPage
```

## Отладка

### Проверка токена в Redux DevTools

```javascript
// В Redux DevTools
state.user.token // Должен быть строкой или пустой строкой
state.user.isAuthenticated // true/false
```

### Проверка токена в localStorage

```javascript
// В консоли браузера
localStorage.getItem('persist:root')
// Должен содержать сериализованный state с токеном
```

### Проверка отправки токена в запросах

```javascript
// В Network tab DevTools
// Все запросы через apiClient должны иметь заголовок:
Authorization: Bearer <ваш_токен>
```

## API Endpoint

```
POST https://test.webbroker.ranks.pro/main/robo/admin_login/

Request:
{
  "username": "admin",
  "password": "YXL%jhR2|KCVb4@wF7D~TK#7cgbdZ#vZ"
}

Response (успех):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "admin-123"
}

Response (ошибка):
{
  "message": "Invalid credentials"
}
```

## Важные файлы

```
src/
├── app/providers/router/ui/
│   ├── AppRouter.tsx          # Главный роутер
│   ├── RequireAuth.tsx        # Защита приватных маршрутов
│   └── PublicRoute.tsx        # Защита публичных маршрутов
├── entities/User/
│   ├── api/userApi.ts         # API запросы
│   └── slice/userSlice.ts     # Redux slice с loginThunk
├── pages/LoginPage/
│   └── LoginPage.tsx          # Форма логина
└── shared/api/
    └── axios.config.ts        # Axios interceptor (добавляет токен)
```

## Резюме

✅ **Токен проверяется автоматически** при загрузке приложения
✅ **Redux Persist сохраняет токен** в localStorage
✅ **Защищены все приватные маршруты** через RequireAuth
✅ **Публичные маршруты недоступны** авторизованным пользователям
✅ **Автоматический редирект** в зависимости от наличия токена
✅ **Токен автоматически добавляется** ко всем API запросам

Все работает автоматически! 🎉
