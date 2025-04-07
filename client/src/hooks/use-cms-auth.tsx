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
      console.log(`[useQuery /api/auth/me] Checking for authentication token`);
      const token = getToken();
      
      if (!token) {
        console.log(`[useQuery /api/auth/me] No token found, skipping request`);
        return null;
      }
      
      console.log(`[useQuery /api/auth/me] Token found: ${token.substring(0, 15)}...`);

      try {
        console.log(`[useQuery /api/auth/me] Making request to /api/auth/me`);
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(`[useQuery /api/auth/me] Response status: ${res.status} ${res.statusText}`);

        if (!res.ok) {
          if (res.status === 401) {
            console.log(`[useQuery /api/auth/me] 401 Unauthorized, clearing token`);
            removeToken();
            return null;
          }
          console.error(`[useQuery /api/auth/me] Request failed with status ${res.status}`);
          throw new Error('Failed to fetch user data');
        }

        const data = await res.json();
        console.log(`[useQuery /api/auth/me] User data retrieved:`, data.user);
        return data.user;
      } catch (error) {
        console.error(`[useQuery /api/auth/me] Error:`, error);
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
      console.log(`[loginMutation] Attempting login for user: ${credentials.username}`);
      const res = await apiRequest('POST', '/api/auth/login', credentials);
      const data = await res.json();
      console.log(`[loginMutation] Login response:`, data);
      return data as AuthResponse;
    },
    onSuccess: (data) => {
      console.log(`[loginMutation] Login successful, token received: ${data.token.substring(0, 15)}...`);
      console.log(`[loginMutation] Setting token in localStorage`);
      setToken(data.token);
      console.log(`[loginMutation] Refetching user data`);
      refetch();
      console.log(`[loginMutation] Redirecting to dashboard`);
      setLocation('/admin/dashboard');
      toast({
        title: 'Login successful',
        description: `Welcome back, ${data.user.name || data.user.username}!`,
      });
    },
    onError: (error: Error) => {
      console.error(`[loginMutation] Login failed:`, error);
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
      console.log(`[registerMutation] Attempting registration for user: ${credentials.username}`);
      const res = await apiRequest('POST', '/api/auth/register-admin', credentials);
      const data = await res.json();
      console.log(`[registerMutation] Registration response:`, data);
      return data as AuthResponse;
    },
    onSuccess: (data) => {
      console.log(`[registerMutation] Registration successful, token received: ${data.token.substring(0, 15)}...`);
      console.log(`[registerMutation] Setting token in localStorage`);
      setToken(data.token);
      console.log(`[registerMutation] Refetching user data`);
      refetch();
      console.log(`[registerMutation] Redirecting to dashboard`);
      setLocation('/admin/dashboard');
      toast({
        title: 'Registration successful',
        description: `Welcome, ${data.user.name || data.user.username}!`,
      });
    },
    onError: (error: Error) => {
      console.error(`[registerMutation] Registration failed:`, error);
      toast({
        title: 'Registration failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Logout function
  const logout = () => {
    console.log(`[logout] Logging out user`);
    console.log(`[logout] Removing token from localStorage`);
    removeToken();
    console.log(`[logout] Clearing query cache`);
    queryClient.clear();
    console.log(`[logout] Redirecting to login page`);
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