import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { ThemeToggle } from '../components/ThemeToggle';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { useLogin } from '../hooks/useAuth';
import { FadeIn, SlideIn } from '../components/animations/MotionComponents';
import { Brain, Sparkles, LogIn } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function Login() {
  const { mutate: login, isPending } = useLogin();
  const [searchParams] = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Handle error from Google OAuth redirect
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      toast.error(decodeURIComponent(error));
    }
  }, [searchParams]);

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left side - Hero Animation */}
      <div className="hidden lg:flex flex-col justify-center items-center p-12 bg-gradient-to-br from-primary/10 via-secondary/5 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <FadeIn className="relative z-10 text-center space-y-8 max-w-md">
          <div className="mx-auto w-32 h-32 bg-primary/10 rounded-3xl flex items-center justify-center rotate-3 hover:rotate-6 transition-transform duration-300">
            <Brain className="h-16 w-16 text-primary animate-pulse-slow" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-bold">
              Welcome Back to
              <span className="gradient-text block mt-2">Quiz-Me</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Continue your learning journey and test your knowledge
            </p>
          </div>

          <div className="flex items-center justify-center gap-8 pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Quizzes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">Learners</div>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Right side - Login Form */}
      <div className="flex items-center justify-center p-4 md:p-12">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        
        <SlideIn direction="right" className="w-full max-w-md">
          <Card className="border-2 shadow-xl">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <LogIn className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold">Sign In</CardTitle>
              <CardDescription className="text-base">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <GoogleSignInButton text="Sign in with Google" />
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or continue with email
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...register('email')}
                    disabled={isPending}
                    className="transition-all focus:scale-[1.02]"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive animate-slide-in">{errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register('password')}
                    disabled={isPending}
                    className="transition-all focus:scale-[1.02]"
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive animate-slide-in">{errors.password.message}</p>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full group" 
                  disabled={isPending}
                  size="lg"
                >
                  {isPending ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      Sign In
                    </>
                  )}
                </Button>
                
                <p className="text-sm text-center text-muted-foreground">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary hover:underline font-semibold">
                    Create one now
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </SlideIn>
      </div>
    </div>
  );
}
