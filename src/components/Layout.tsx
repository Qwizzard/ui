import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ThemeToggle } from './ThemeToggle';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useAuth } from '../contexts/AuthContext';
import { useLogout } from '../hooks/useAuth';
import { Menu, Brain, Home, PlusCircle, BookOpen, Trophy, LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export function Layout() {
  const { user, isAuthenticated } = useAuth();
  const logout = useLogout();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: Home, auth: true },
    { to: '/quizzes/create', label: 'Create Quiz', icon: PlusCircle, auth: true },
    { to: '/quizzes/my-quizzes', label: 'My Quizzes', icon: BookOpen, auth: true },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-background/80 backdrop-blur-lg border-b shadow-sm'
            : 'bg-background border-b'
        )}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center"
              >
                <Brain className="h-6 w-6 text-primary" />
              </motion.div>
              <span className="text-2xl font-bold gradient-text">Qwizzard</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                if (link.auth && !isAuthenticated) return null;
                const Icon = link.icon;
                const active = isActive(link.to);
                
                return (
                  <Link key={link.to} to={link.to}>
                    <Button
                      variant="ghost"
                      className={cn(
                        'relative gap-2',
                        active && 'text-primary'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                      {active && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </Button>
                  </Link>
                );
              })}
              
              <div className="flex items-center gap-2 ml-4 pl-4 border-l">
                <ThemeToggle />
                {isAuthenticated ? (
                  <>
                    <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{user?.username}</span>
                    </div>
                    <Button onClick={logout} variant="outline" size="sm" className="gap-2">
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="ghost" size="sm">
                        Login
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button size="sm" className="gap-2">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
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
                <SheetContent side="right" className="w-[300px]">
                  <div className="flex flex-col gap-6 mt-8">
                    {/* User Info */}
                    {isAuthenticated && user && (
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{user.username}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    )}

                    {/* Navigation Links */}
                    <nav className="flex flex-col gap-2">
                      {navLinks.map((link) => {
                        if (link.auth && !isAuthenticated) return null;
                        const Icon = link.icon;
                        const active = isActive(link.to);
                        
                        return (
                          <Link key={link.to} to={link.to} onClick={() => setOpen(false)}>
                            <Button
                              variant={active ? 'default' : 'ghost'}
                              className="w-full justify-start gap-2"
                            >
                              <Icon className="h-4 w-4" />
                              {link.label}
                            </Button>
                          </Link>
                        );
                      })}
                    </nav>

                    {/* Auth Buttons */}
                    <div className="flex flex-col gap-2 pt-4 border-t">
                      {isAuthenticated ? (
                        <Button 
                          onClick={() => {
                            logout();
                            setOpen(false);
                          }} 
                          variant="outline"
                          className="w-full gap-2"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </Button>
                      ) : (
                        <>
                          <Link to="/login" onClick={() => setOpen(false)}>
                            <Button variant="outline" className="w-full">
                              Login
                            </Button>
                          </Link>
                          <Link to="/register" onClick={() => setOpen(false)}>
                            <Button className="w-full">
                              Sign Up
                            </Button>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold gradient-text">Qwizzard</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Qwizzard. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/" className="hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link to="/" className="hover:text-primary transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
