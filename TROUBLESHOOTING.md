# Troubleshooting - Решение проблем

## Проблема: Не перенаправляет на страницу логина

### Причина
В localStorage может быть сохранено старое состояние с пустым токеном.

### Решение

#### Вариант 1: Очистка через консоль браузера

1. Откройте DevTools (F12)
2. Перейдите в консоль
3. Выполните:
```javascript
localStorage.clear()
location.reload()
```

#### Вариант 2: Ручная очистка через Application

1. Откройте DevTools (F12)
2. Перейдите во вкладку "Application" (или "Приложение")
3. Слева выберите "Local Storage"
4. Найдите `persist:root` и удалите его
5. Обновите страницу (F5)

#### Вариант 3: Использовать Incognito/Private режим

Откройте приложение в режиме инкогнито:
- Chrome: `Ctrl+Shift+N`
- Firefox: `Ctrl+Shift+P`
- Edge: `Ctrl+Shift+N`

### После очистки

1. Перейдите на `http://localhost:5174`
2. Вы должны увидеть страницу логина
3. Используйте данные:
   - Username: `admin`
   - Password: `YXL%jhR2|KCVb4@wF7D~TK#7cgbdZ#vZ`

## Проблема: После логина не сохраняется токен

### Проверка

1. Откройте DevTools (F12)
2. Перейдите в "Application" → "Local Storage"
3. Найдите ключ `persist:root`
4. Проверьте содержимое - должно быть что-то вроде:
```json
{
  "user": "{\"token\":\"your-token-here\",\"userId\":\"admin\",\"isAuthenticated\":true,...}"
}
```

### Если токен не сохраняется

Проверьте консоль на ошибки API:
```
F12 → Console
```

Ищите ошибки типа:
- `401 Unauthorized`
- `CORS error`
- `Network error`

## Проблема: CORS ошибка

### Симптомы
```
Access to XMLHttpRequest at 'https://test.webbroker.ranks.pro/...'
from origin 'http://localhost:5174' has been blocked by CORS policy
```

### Решение

Это проблема на стороне бэкенда. Нужно чтобы сервер разрешил CORS для `http://localhost:5174`.

**Временное решение для разработки:**

1. Установите расширение для браузера:
   - Chrome: "CORS Unblock"
   - Firefox: "CORS Everywhere"

2. Или используйте прокси в `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/main': {
        target: 'https://test.webbroker.ranks.pro',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
```

## Проблема: Токен есть, но API возвращает 401

### Проверка токена

Откройте DevTools → Network → выберите запрос → Headers:

Должен быть заголовок:
```
Authorization: Bearer your-actual-token-here
```

Если заголовка нет:
1. Проверьте что используете `apiClient` из `shared/api/axios.config.ts`
2. Не используете обычный `axios`

### Пример правильного использования

❌ **Неправильно:**
```typescript
import axios from 'axios';
const response = await axios.get('https://test.webbroker.ranks.pro/main/endpoint');
```

✅ **Правильно:**
```typescript
import { apiClient } from 'shared/api/axios.config';
const response = await apiClient.get('/main/endpoint');
```

## Проблема: Бесконечный редирект между /login и /admin

### Причина
Конфликт в логике PublicRoute и RequireAuth

### Проверка

1. Откройте консоль браузера
2. Посмотрите на URL - он постоянно меняется между `/login` и `/admin`

### Решение

1. Очистите localStorage:
```javascript
localStorage.clear()
```

2. Проверьте состояние Redux в DevTools:
   - Установите Redux DevTools Extension
   - Проверьте `state.user.token` и `state.user.isAuthenticated`
   - Оба должны быть `""` и `false` для незалогиненного пользователя

## Проблема: После перезагрузки страницы требует снова логин

### Причина
Redux Persist не настроен или не работает

### Проверка

1. Проверьте `src/app/providers/store/config/store.ts`:
```typescript
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'menuSettings', 'portfolio', 'tabs'], // user должен быть в whitelist
};
```

2. Проверьте что в `main.tsx` используется `PersistGate`:
```typescript
<PersistGate loading={<Loader />} persistor={persistor}>
  <App />
</PersistGate>
```

## Проблема: API запрос не отправляется

### Проверка Network

1. F12 → Network
2. Попробуйте выполнить запрос
3. Если запроса нет в списке - проблема в коде
4. Если запрос есть:
   - Статус 200 - все ок
   - Статус 401 - проблема с токеном
   - Статус 403 - нет прав доступа
   - Статус 500 - ошибка сервера

### Debug в коде

Добавьте логи:
```typescript
export const fetchData = async () => {
  console.log('Making API request...');
  try {
    const response = await apiClient.get('/main/endpoint');
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

## Полный сброс приложения

Если ничего не помогает:

```javascript
// Откройте консоль браузера и выполните:
localStorage.clear();
sessionStorage.clear();
location.reload();
```

Затем:
1. Закройте все вкладки с приложением
2. Очистите кэш браузера (Ctrl+Shift+Delete)
3. Откройте приложение заново в режиме инкогнито
4. Попробуйте залогиниться

## Как получить помощь

1. Откройте консоль браузера (F12)
2. Скопируйте все ошибки
3. Откройте Network вкладку
4. Сделайте скриншот неудачного запроса
5. Проверьте Redux состояние в Redux DevTools

Эта информация поможет быстрее найти проблему.
