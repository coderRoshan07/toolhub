import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { 
    user, 
    isLoading, 
    loginMutation, 
    registerMutation 
  } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation('/');
    }
  }, [user, setLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      toast({
        title: 'Validation Error',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }

    if (isLogin) {
      loginMutation.mutate({ username, password });
    } else {
      registerMutation.mutate({ username, password });
    }
  };

  // If already logged in, don't render the auth page
  if (user) return null;

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
          {/* Left column - Auth form */}
          <div className="flex-1 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="max-w-md mx-auto">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {isLogin ? 'Welcome back' : 'Create an account'}
              </h1>
              <p className="text-gray-600 mb-8">
                {isLogin
                  ? 'Log in to access administrator features'
                  : 'Register to manage the ToolFinder platform'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loginMutation.isPending || registerMutation.isPending}
                >
                  {isLogin 
                    ? (loginMutation.isPending ? 'Logging in...' : 'Log In') 
                    : (registerMutation.isPending ? 'Creating account...' : 'Create Account')}
                </Button>

                <div className="mt-4 text-center text-sm">
                  {isLogin ? (
                    <p>
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setIsLogin(false)}
                        className="text-primary-600 hover:text-primary-800 font-medium"
                      >
                        Register
                      </button>
                    </p>
                  ) : (
                    <p>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setIsLogin(true)}
                        className="text-primary-600 hover:text-primary-800 font-medium"
                      >
                        Log In
                      </button>
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Right column - Hero content */}
          <div className="flex-1 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-xl p-8 flex flex-col justify-center">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">ToolFinder Admin</h2>
              <p className="text-lg opacity-90 mb-6">
                Manage tools, categories, and user suggestions from the admin dashboard.
              </p>
              <ul className="space-y-3">
                {['Add and update tools', 'Manage categories', 'Review user suggestions', 'Monitor analytics'].map(
                  (item, index) => (
                    <li key={index} className="flex items-center">
                      <span className="bg-white bg-opacity-20 rounded-full p-1 mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
