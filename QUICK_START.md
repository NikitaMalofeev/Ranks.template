# 🚀 Quick Start

## Запуск

```bash
npm run dev
```

Откройте http://localhost:5173

## Что произойдет?

### Первый запуск

```
http://localhost:5173
    ↓
Токена нет в localStorage
    ↓
Редирект → /login
    ↓
Введите логин/пароль
    ↓
Токен сохранен
    ↓
Редирект → /admin ✅
```

### Последующие запуски

```
http://localhost:5173
    ↓
Токен найден в localStorage
    ↓
Редирект → /admin ✅
```

## Данные для входа

```
Username: admin
Password: YXL%jhR2|KCVb4@wF7D~TK#7cgbdZ#vZ
```

## Выход

Нажмите **"Logout"** в Header → автоматический редирект на `/login`

## Проверка токена

```javascript
// В консоли браузера
localStorage.getItem('persist:root')
```

## API запросы с токеном

Используйте `apiClient` - токен добавится автоматически:

```typescript
import { apiClient } from 'shared/api/axios.config';

// GET запрос
const getData = async () => {
  const response = await apiClient.get('/main/robo/endpoint/');
  return response.data;
};

// POST запрос
const postData = async (data) => {
  const response = await apiClient.post('/main/robo/endpoint/', data);
  return response.data;
};
```

## Файлы

- `LOGIN_SETUP.md` - Подробная инструкция
- `REDIRECT_LOGIC.md` - Схема работы редиректов
- `AUTHENTICATION.md` - Полная документация

## Готово! 🎉

✅ Токен проверяется автоматически
✅ Редиректы работают автоматически
✅ Токен сохраняется автоматически
✅ Токен добавляется к запросам автоматически

**Просто запустите и используйте!**
