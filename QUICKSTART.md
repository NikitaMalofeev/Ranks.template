# 🚀 Quick Start Guide

Get up and running with Ranks Template in 5 minutes!

## 1️⃣ Installation

```bash
# Clone or download this template
cd Ranks.template

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

## 2️⃣ Start Development

```bash
# Start dev server
npm run dev

# Open http://localhost:5173
```

You should see the welcome page! 🎉

## 3️⃣ Understanding the Structure

```
src/
├── app/          # App initialization, providers, global styles
├── pages/        # Your pages (HomePage, LoginPage, etc.)
├── widgets/      # Reusable composite blocks (Header, Footer)
├── features/     # Business features (Auth, etc.)
├── entities/     # Business entities (User, etc.)
└── shared/       # Shared utilities, UI components, hooks
```

## 4️⃣ Quick Tasks

### Add a New Page

1. **Create page component:**
```tsx
// src/pages/AboutPage/AboutPage.tsx
const AboutPage = () => {
  return <div>About Page</div>;
};

export default AboutPage;
```

2. **Add route:**
```tsx
// src/app/providers/router/ui/AppRouter.tsx
const AboutPage = lazy(() => import('pages/AboutPage/AboutPage'));

// In Routes:
<Route
  path="/about"
  element={
    <Suspense fallback={<Loader />}>
      <AboutPage />
    </Suspense>
  }
/>
```

### Add a New Component

```tsx
// src/shared/ui/Card/Card.tsx
import styles from './Card.module.scss';

interface CardProps {
  title: string;
  children: React.ReactNode;
}

export const Card = ({ title, children }: CardProps) => {
  return (
    <div className={styles.card}>
      <h3>{title}</h3>
      {children}
    </div>
  );
};
```

### Add Redux State

1. **Create slice:**
```tsx
// src/entities/Product/slice/productSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
  name: 'product',
  initialState: { items: [] },
  reducers: {
    addProduct: (state, action) => {
      state.items.push(action.payload);
    },
  },
});

export const { addProduct } = productSlice.actions;
export default productSlice.reducer;
```

2. **Add to store:**
```tsx
// src/app/providers/store/config/store.ts
import productReducer from 'entities/Product/slice/productSlice';

const rootReducer = combineReducers({
  user: userReducer,
  product: productReducer, // Add here
});
```

### Use Ant Design Components

```tsx
import { Button, Input, Card } from 'antd';

const MyComponent = () => {
  return (
    <Card title="Example">
      <Input placeholder="Enter text" />
      <Button type="primary">Submit</Button>
    </Card>
  );
};
```

## 5️⃣ Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Check for errors
npm run lint -- --fix   # Auto-fix errors
```

## 6️⃣ Path Aliases

Use clean imports with aliases:

```tsx
// ✅ Use aliases
import { Button } from 'shared/ui/Button/Button';
import { useAppDispatch } from 'shared/hooks/useAppDispatch';
import { HomePage } from 'pages/HomePage/HomePage';

// ❌ Don't use relative paths
import { Button } from '../../../shared/ui/Button/Button';
```

Available aliases:
- `app/*` - Application layer
- `pages/*` - Pages
- `widgets/*` - Widgets
- `features/*` - Features
- `entities/*` - Entities
- `shared/*` - Shared code

## 7️⃣ Authentication Flow

The template includes mock authentication:

1. **Login page** (`/login`) - enter any credentials
2. **Redirects to home** (`/`) - protected route
3. **Click logout** - returns to login

Replace mock auth with real API:

```tsx
// src/entities/User/api/userApi.ts
export const userApi = {
  login: async (credentials) => {
    // Replace this with real API call
    const response = await axios.post('/api/auth/login', credentials);
    return response.data;
  },
};
```

## 8️⃣ Styling

### Use SCSS Modules

```tsx
// Component.tsx
import styles from './Component.module.scss';

export const Component = () => {
  return <div className={styles.container}>Content</div>;
};
```

```scss
// Component.module.scss
.container {
  padding: var(--spacing-md);
  color: var(--primary-color);
}
```

### Use Ant Design Theme

```tsx
// src/app/App.tsx
import { ConfigProvider } from 'antd';

<ConfigProvider
  theme={{
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 4,
    },
  }}
>
  <App />
</ConfigProvider>
```

## 9️⃣ Environment Variables

```bash
# .env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_TITLE=My App
```

```tsx
// Usage
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

## 🔟 Next Steps

- 📖 Read [README.md](./README.md) for full documentation
- 🏗 Check [ARCHITECTURE.md](./ARCHITECTURE.md) to understand FSD
- 🤝 Read [CONTRIBUTING.md](./CONTRIBUTING.md) for best practices
- 📜 See [SCRIPTS.md](./SCRIPTS.md) for all available commands

## 🆘 Troubleshooting

### Port already in use
```bash
npm run dev -- --port 3000
```

### TypeScript errors
```bash
npx tsc --noEmit
```

### Clear cache and restart
```bash
rm -rf node_modules/.vite
npm run dev
```

### Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🎯 Common Patterns

### Async API Call with Redux
```tsx
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUser = createAsyncThunk(
  'user/fetch',
  async (userId: string) => {
    const response = await userApi.getUser(userId);
    return response.data;
  }
);

// In component
const dispatch = useAppDispatch();
useEffect(() => {
  dispatch(fetchUser('123'));
}, []);
```

### Protected Route
```tsx
<Route
  path="/dashboard"
  element={
    <RequireAuth>
      <DashboardPage />
    </RequireAuth>
  }
/>
```

### Form with Ant Design
```tsx
import { Form, Input, Button } from 'antd';

const MyForm = () => {
  const onFinish = (values) => {
    console.log(values);
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item name="username" rules={[{ required: true }]}>
        <Input placeholder="Username" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">Submit</Button>
      </Form.Item>
    </Form>
  );
};
```

---

**Happy Coding! 🎉**

Need help? Check the full documentation or create an issue on GitHub.
