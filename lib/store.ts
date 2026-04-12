import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  username: string;
  display_name: string;
  bio: string;
  role: 'USER' | 'ADMIN';
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null });
      },
      isAuthenticated: () => !!get().token,
      isAdmin: () => get().user?.role === 'ADMIN',
    }),
    {
      name: 'auth-storage',
    }
  )
);
