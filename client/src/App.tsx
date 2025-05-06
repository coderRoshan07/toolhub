import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import CategoryPage from "@/pages/category";
import SearchPage from "@/pages/search";
import DummyPage from "@/pages/dummy-page";
import AdminDashboard from "@/pages/admin";
import AuthPage from "@/pages/auth-page";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/category/:slug" component={CategoryPage}/>
      <Route path="/search" component={SearchPage}/>
      <Route path="/page/:pageId" component={DummyPage}/>
      <Route path="/auth" component={AuthPage}/>
      <Route path="/admin" component={AdminDashboard}/>
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
