import { Link, Outlet } from 'react-router-dom';
import { Button } from './ui/button';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { useLogout } from '../hooks/useAuth';

export function Layout() {
  const { user } = useAuth();
  const logout = useLogout();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-primary">
              Quiz-Me
            </Link>
            <nav className="flex items-center gap-4">
              <Link to="/" className="text-muted-foreground hover:text-foreground">
                Dashboard
              </Link>
              <Link to="/quizzes/create" className="text-muted-foreground hover:text-foreground">
                Create Quiz
              </Link>
              <Link to="/quizzes/my-quizzes" className="text-muted-foreground hover:text-foreground">
                My Quizzes
              </Link>
              <Link to="/quizzes/public" className="text-muted-foreground hover:text-foreground">
                Browse Quizzes
              </Link>
              <div className="flex items-center gap-2 ml-4 pl-4 border-l">
                <ThemeToggle />
                <span className="text-sm text-muted-foreground">{user?.username}</span>
                <Button onClick={logout} variant="outline" size="sm">
                  Logout
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

