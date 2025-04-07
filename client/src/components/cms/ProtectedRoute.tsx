import { useCMSAuth } from '@/hooks/use-cms-auth';
import { Loader2 } from 'lucide-react';
import { Route, Redirect } from 'wouter';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  path?: string;
  component?: React.ComponentType;
  children?: React.ReactNode;
}

export function ProtectedRoute({ path, component: Component, children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useCMSAuth();

  useEffect(() => {
    console.log(`[ProtectedRoute ${path || ''}] Auth state: isLoading=${isLoading}, isAuthenticated=${isAuthenticated}`);
    if (user) {
      console.log(`[ProtectedRoute ${path || ''}] User: id=${user.id}, username=${user.username}, role=${user.role}`);
    } else {
      console.log(`[ProtectedRoute ${path || ''}] No authenticated user found`);
    }
  }, [path, isLoading, isAuthenticated, user]);

  // If being used directly with children (no path prop)
  if (!path) {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Verifying authentication...</span>
        </div>
      );
    }
    
    if (!isAuthenticated) {
      return <Redirect to="/admin/login" />;
    }
    
    return <>{children}</>;
  }

  // If being used as a route with component prop
  return (
    <Route path={path}>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Verifying authentication...</span>
        </div>
      ) : isAuthenticated ? (
        Component ? <Component /> : children
      ) : (
        <Redirect to="/admin/login" />
      )}
    </Route>
  );
}