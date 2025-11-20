import { Link, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Button } from './ui/button';
import { ThemeToggle } from './ThemeToggle';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useAuth } from '../contexts/AuthContext';
import { useLogout } from '../hooks/useAuth';
import { Menu } from 'lucide-react';

export function Layout() {
  const { user } = useAuth();
  const logout = useLogout();
  const [open, setOpen] = useState(false);

  const navigationLinks = (
    <>
      <Link 
        to="/" 
        className="text-muted-foreground hover:text-foreground"
        onClick={() => setOpen(false)}
      >
        Dashboard
      </Link>
      <Link 
        to="/quizzes/create" 
        className="text-muted-foreground hover:text-foreground"
        onClick={() => setOpen(false)}
      >
        Create Quiz
      </Link>
      <Link 
        to="/quizzes/my-quizzes" 
        className="text-muted-foreground hover:text-foreground"
        onClick={() => setOpen(false)}
      >
        My Quizzes
      </Link>
      <Link 
        to="/quizzes/public" 
        className="text-muted-foreground hover:text-foreground"
        onClick={() => setOpen(false)}
      >
        Browse Quizzes
      </Link>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-primary">
              Quiz-Me
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              {navigationLinks}
              <div className="flex items-center gap-2 ml-4 pl-4 border-l">
                <ThemeToggle />
                <span className="text-sm text-muted-foreground">{user?.username}</span>
                <Button onClick={logout} variant="outline" size="sm">
                  Logout
                </Button>
              </div>
            </nav>

            {/* Mobile Navigation */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col gap-6 mt-8">
                    <div className="flex flex-col gap-4">
                      {navigationLinks}
                    </div>
                    <div className="flex flex-col gap-2 pt-4 border-t">
                      <span className="text-sm text-muted-foreground">
                        Logged in as {user?.username}
                      </span>
                      <Button 
                        onClick={() => {
                          logout();
                          setOpen(false);
                        }} 
                        variant="outline"
                        className="w-full"
                      >
                        Logout
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

