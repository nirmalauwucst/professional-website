import { createContext, ReactNode, useContext, useEffect } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationResult,
} from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

interface User {
  id: number;
  username: string;
  name: string | null;
  email: string | null;
  role: string;
}

interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterCredentials extends LoginCredentials {
  name?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  loginMutation: UseMutationResult<AuthResponse, Error, LoginCredentials>;
  registerMutation: UseMutationResult<AuthResponse, Error, RegisterCredentials>;
  logout: () => void;
}

const CMS_AUTH_TOKEN_KEY = 'cms_auth_token';

const AuthContext = createContext<AuthContextType | null>(null);

export function CMSAuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // Get token from localStorage
  const getToken = (): string | null => {
    return localStorage.getItem(CMS_AUTH_TOKEN_KEY);
  };

  // Set token in localStorage
  const setToken = (token: string): void => {
    localStorage.setItem(CMS_AUTH_TOKEN_KEY, token);
  };

  // Remove token from localStorage
  const removeToken = (): void => {
    localStorage.removeItem(CMS_AUTH_TOKEN_KEY);
  };

  // Check if token exists and fetch user data
  const {
    data: user,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['/api/auth/me'],
    queryFn: async () => {
      const token = getToken();
      if (!token) return null;

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            removeToken();
            return null;
          }
          throw new Error('Failed to fetch user data');
        }

        const data = await res.json();
        return data.user;
      } catch (error) {
        removeToken();
        return null;
      }
    },
    enabled: !!getToken(),
    retry: false,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const res = await apiRequest('POST', '/api/auth/login', credentials);
      const data = await res.json();
      return data as AuthResponse;
    },
    onSuccess: (data) => {
      setToken(data.token);
      refetch();
      setLocation('/admin/dashboard');
      toast({
        title: 'Login successful',
        description: `Welcome back, ${data.user.name || data.user.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Login failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const res = await apiRequest('POST', '/api/auth/register-admin', credentials);
      const data = await res.json();
      return data as AuthResponse;
    },
    onSuccess: (data) => {
      setToken(data.token);
      refetch();
      setLocation('/admin/dashboard');
      toast({
        title: 'Registration successful',
        description: `Welcome, ${data.user.name || data.user.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Registration failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Logout function
  const logout = () => {
    removeToken();
    queryClient.clear();
    setLocation('/admin/login');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
    });
  };

  // Token refresh on mount
  useEffect(() => {
    if (getToken()) {
      refetch();
    }
  }, [refetch]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        isAuthenticated: !!user,
        loginMutation,
        registerMutation,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useCMSAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useCMSAuth must be used within a CMSAuthProvider');
  }
  return context;
}