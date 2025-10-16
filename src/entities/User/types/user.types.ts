export interface User {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

export interface AuthState {
  token: string;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
