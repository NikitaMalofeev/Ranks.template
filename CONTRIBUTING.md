# Contributing Guide

## 🎯 Development Workflow

### 1. Setup Development Environment

```bash
# Clone the repository
git clone <your-repo-url>

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start dev server
npm run dev
```

### 2. Coding Standards

#### TypeScript
- Always use TypeScript for all files
- Define interfaces for all props and state
- Avoid using `any` type
- Use strict mode

```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

// ❌ Bad
const Button = (props: any) => { ... }
```

#### React Components
- Use functional components with hooks
- Use `React.memo()` when needed for optimization
- Keep components small and focused

```typescript
// ✅ Good
export const Button = memo(({ label, onClick }: ButtonProps) => {
  return <button onClick={onClick}>{label}</button>;
});

// ❌ Bad - no memo, unclear props
export const Button = (props) => { ... }
```

#### Naming Conventions
- Components: PascalCase (`UserCard.tsx`)
- Functions/Variables: camelCase (`getUserData`)
- Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)
- Types/Interfaces: PascalCase with descriptive names (`UserProfile`, `LoginFormProps`)

### 3. Project Structure Rules

#### Follow FSD layers strictly:

```
✅ Allowed:
pages → widgets → features → entities → shared

❌ Not allowed:
features → features
entities → features
pages → pages
```

#### File placement:

**Entity example:**
```
entities/User/
├── api/userApi.ts         # API calls
├── slice/userSlice.ts     # Redux slice
├── types/user.types.ts    # TypeScript types
└── ui/UserCard.tsx        # UI components
```

**Feature example:**
```
features/Auth/
├── LoginForm/
│   ├── LoginForm.tsx
│   └── LoginForm.module.scss
└── RegisterForm/
```

### 4. Styling Guidelines

#### Use SCSS Modules
```scss
// Component.module.scss
.container {
  padding: var(--spacing-md);

  &__title {
    color: var(--primary-color);
  }
}
```

#### Use CSS Variables
```scss
// Use from global.scss
.myClass {
  color: var(--primary-color);
  padding: var(--spacing-md);
}
```

#### Responsive Design
```scss
@use 'app/styles/mixins' as mix;

.container {
  padding: 10px;

  @include mix.respond-to('tablet') {
    padding: 20px;
  }
}
```

### 5. State Management

#### Redux Toolkit
- Use `createSlice` for all reducers
- Use `createAsyncThunk` for async actions
- Keep slices in `entities/` layer

```typescript
// entities/User/slice/userSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUser = createAsyncThunk(
  'user/fetch',
  async (userId: string) => {
    const response = await userApi.getUser(userId);
    return response.data;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});
```

### 6. Git Workflow

#### Commit Messages
Follow conventional commits:

```
feat: add user authentication
fix: resolve login form validation
docs: update README with setup instructions
style: format code with prettier
refactor: restructure user entity
test: add tests for login feature
chore: update dependencies
```

#### Branch Naming
```
feature/user-authentication
fix/login-validation-bug
refactor/user-entity
docs/update-readme
```

### 7. Testing (to be implemented)

```typescript
// Example test structure
describe('LoginForm', () => {
  it('should render login form', () => {
    // test implementation
  });

  it('should validate email', () => {
    // test implementation
  });
});
```

### 8. Pull Request Process

1. Create a branch from `main`
2. Make your changes following the guidelines
3. Update documentation if needed
4. Run linter: `npm run lint`
5. Create a Pull Request with clear description
6. Wait for code review

#### PR Template:
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console.logs or debugger statements
```

### 9. Common Patterns

#### API Calls
```typescript
// entities/User/api/userApi.ts
export const userApi = {
  getUser: async (id: string) => {
    return await axios.get(`/users/${id}`);
  },
};
```

#### Custom Hooks
```typescript
// shared/hooks/useAuth.ts
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const token = useSelector((state: RootState) => state.user.token);

  const login = useCallback((credentials) => {
    dispatch(loginThunk(credentials));
  }, [dispatch]);

  return { token, login };
};
```

### 10. Performance Best Practices

- Use `React.memo()` for expensive components
- Use `useMemo()` and `useCallback()` when appropriate
- Implement lazy loading for routes
- Optimize images and assets
- Avoid inline functions in JSX when possible

```typescript
// ✅ Good
const handleClick = useCallback(() => {
  doSomething();
}, []);

return <Button onClick={handleClick} />;

// ❌ Bad
return <Button onClick={() => doSomething()} />;
```

## 🚀 Quick Reference

### Adding a new page:
1. Create in `pages/PageName/`
2. Add route in `app/providers/router/ui/AppRouter.tsx`
3. Implement lazy loading

### Adding a new feature:
1. Create in `features/FeatureName/`
2. Can use entities and shared
3. Should be self-contained

### Adding a new entity:
1. Create in `entities/EntityName/`
2. Add slice, api, types, ui as needed
3. Register in store if using Redux

---

Happy coding! 🎉
