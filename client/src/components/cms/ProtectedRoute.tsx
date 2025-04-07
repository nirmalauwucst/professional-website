import { useCMSAuth } from '@/hooks/use-cms-auth';
import { Loader2 } from 'lucide-react';
import { Route, Redirect } from 'wouter';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType;
}

export function ProtectedRoute({ path, component: Component }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useCMSAuth();

  useEffect(() => {
    console.log(`[ProtectedRoute ${path}] Auth state: isLoading=${isLoading}, isAuthenticated=${isAuthenticated}`);
    if (user) {
      console.log(`[ProtectedRoute ${path}] User: id=${user.id}, username=${user.username}, role=${user.role}`);
    } else {
      console.log(`[ProtectedRoute ${path}] No authenticated user found`);
    }
  }, [path, isLoading, isAuthenticated, user]);

  return (
    <Route path={path}>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Verifying authentication...</span>
        </div>
      ) : isAuthenticated ? (
        <Component />
      ) : (
        <Redirect to="/admin/login" />
      )}
    </Route>
  );
}