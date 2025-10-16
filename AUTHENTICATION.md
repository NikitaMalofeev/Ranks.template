# Authentication Implementation

This document describes the authentication implementation in the Ranks Template project.

## Overview

The authentication system uses JWT tokens and follows the Feature-Sliced Design architecture.

## Key Components

### 1. API Configuration (`src/shared/config/api.config.ts`)

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://test.webbroker.ranks.pro';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/main/robo/admin_login/',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  // ... other endpoints
};
```

### 2. User API (`src/entities/User/api/userApi.ts`)

Handles API requests for authentication:

```typescript
export const userApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`,
      credentials
    );
    // Returns { token, userId }
  },
};
```

### 3. User Slice (`src/entities/User/slice/userSlice.ts`)

Redux slice that manages user state:

```typescript
interface UserState {
  token: string;
  userId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

**Key Actions:**
- `loginThunk` - Async thunk for login
- `logout` - Clear user state
- `clearError` - Clear error messages

### 4. Axios Interceptor (`src/shared/api/axios.config.ts`)

Automatically adds authentication token to all requests:

```typescript
apiClient.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.user.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
```

### 5. Login Page (`src/pages/LoginPage/LoginPage.tsx`)

User interface for login:
- Form validation
- Error display
- Loading states
- Automatic redirect on success

### 6. Route Protection (`src/app/providers/router/ui/RequireAuth.tsx`)

Protected routes component that redirects unauthenticated users to login:

```typescript
const RequireAuthRoute: React.FC<RequireAuthRouteProps> = ({ children }) => {
  const token = useSelector((state: RootState) => state.user.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
```

## Authentication Flow

### Login Process

1. User enters credentials on `/login` page
2. `LoginPage` dispatches `loginThunk` with credentials
3. `loginThunk` calls `userApi.login()` which makes POST request to `/main/robo/admin_login/`
4. On success:
   - Token is stored in Redux state
   - Redux persist saves token to localStorage
   - User is redirected to `/admin`
5. On failure:
   - Error message is displayed
   - User can retry

### Protected Routes

1. User navigates to protected route (e.g., `/admin`)
2. `RequireAuthRoute` component checks if token exists in Redux state
3. If token exists, render the protected component
4. If no token, redirect to `/login`

### API Requests with Token

All API requests automatically include the authentication token:

```typescript
import { apiClient } from 'shared/api/axios.config';

// Token is automatically added to headers
const response = await apiClient.get('/some/endpoint');
```

### Logout Process

1. User clicks logout button in Header
2. `logout` action is dispatched
3. User state is cleared in Redux
4. localStorage is cleared
5. User is redirected to `/login`

## Usage Examples

### Making Authenticated API Requests

```typescript
import { apiClient } from 'shared/api/axios.config';

// Example: Fetch user profile
export const fetchUserProfile = async () => {
  try {
    const response = await apiClient.get('/user/profile');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    throw error;
  }
};

// Example: Update user settings
export const updateSettings = async (settings: UserSettings) => {
  try {
    const response = await apiClient.put('/user/settings', settings);
    return response.data;
  } catch (error) {
    console.error('Failed to update settings:', error);
    throw error;
  }
};
```

### Creating a New Protected Feature

1. Create your API functions using `apiClient`:

```typescript
// src/entities/MyEntity/api/myEntityApi.ts
import { apiClient } from 'shared/api/axios.config';

export const myEntityApi = {
  getData: async () => {
    const response = await apiClient.get('/my-entity/data');
    return response.data;
  },
};
```

2. Create Redux slice with async thunks:

```typescript
// src/entities/MyEntity/slice/myEntitySlice.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { myEntityApi } from '../api/myEntityApi';
import { RootState } from 'app/providers/store/config/store';

export const fetchDataThunk = createAsyncThunk<
  MyData,
  void,
  { state: RootState; rejectValue: string }
>(
  'myEntity/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      return await myEntityApi.getData();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
```

3. Use in your component:

```typescript
import { useEffect } from 'react';
import { useAppDispatch } from 'shared/hooks/useAppDispatch';
import { fetchDataThunk } from 'entities/MyEntity/slice/myEntitySlice';

const MyComponent = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchDataThunk());
  }, [dispatch]);

  return <div>My Component</div>;
};
```

## Environment Variables

Required environment variables in `.env`:

```env
VITE_API_BASE_URL=https://test.webbroker.ranks.pro
```

## Default Credentials (For Testing)

```
Username: admin
Password: YXL%jhR2|KCVb4@wF7D~TK#7cgbdZ#vZ
```

**Note:** These credentials are pre-filled in the login form for testing purposes.

## Security Considerations

1. **Token Storage**: Tokens are stored in Redux state and persisted to localStorage via redux-persist
2. **HTTPS Only**: Always use HTTPS in production
3. **Token Expiration**: Implement token refresh logic if needed
4. **Logout on 401**: The axios interceptor detects 401 errors and can redirect to login

## Troubleshooting

### Token not being sent with requests

- Check that you're using `apiClient` from `shared/api/axios.config.ts`
- Verify token exists in Redux state
- Check browser console for errors

### Login fails with CORS error

- Verify `VITE_API_BASE_URL` is correct in `.env`
- Check that backend allows CORS from your frontend URL

### User redirected to login after page refresh

- Check that redux-persist is configured correctly
- Verify `user` slice is in persist whitelist
- Check browser localStorage for persisted state

### 401 Unauthorized errors

- Token may have expired
- Implement token refresh logic
- Check that token format is correct (`Bearer <token>`)

## Next Steps

1. Implement token refresh logic
2. Add password reset functionality
3. Add remember me feature
4. Implement role-based access control
5. Add multi-factor authentication

---

For more information, see:
- `ARCHITECTURE.md` - Project architecture
- `CLAUDE_INSTRUCTIONS.md` - Development guidelines
