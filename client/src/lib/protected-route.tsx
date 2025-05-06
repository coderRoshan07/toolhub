import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Route, useLocation } from "wouter";

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType;
  adminOnly?: boolean;
}

export function ProtectedRoute({
  path,
  component: Component,
  adminOnly = false,
}: ProtectedRouteProps) {
  const { user, isAdmin, isLoading } = useAuth();
  const [location] = useLocation();

  // Convert the wrapped component to a function that handles auth
  const WrappedComponent = () => {
    // If loading, show spinner
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      );
    }

    // If not authenticated, redirect to login
    if (!user) {
      window.location.href = "/auth";
      return null;
    }

    // If admin-only and not admin, redirect to home
    if (adminOnly && !isAdmin) {
      window.location.href = "/";
      return null;
    }

    // User is authenticated and has necessary permissions
    return <Component />;
  };

  // Render the route with our wrapper
  return <Route path={path} component={WrappedComponent} />;
}
