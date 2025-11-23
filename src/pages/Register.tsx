import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { ThemeToggle } from '../components/ThemeToggle';
import { GoogleSignInButton } from '../components/GoogleSignInButton';
import { useRegister } from '../hooks/useAuth';
import { FadeIn, SlideIn } from '../components/animations/MotionComponents';
import { Trophy, Sparkles, UserPlus } from 'lucide-react';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function Register() {
  const { mutate: register, isPending } = useRegister();
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    register(data);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left side - Registration Form */}
      <div className="flex items-center justify-center p-4 md:p-12 order-2 lg:order-1">
        <div className="absolute top-4 left-4 lg:left-auto lg:right-4">
          <ThemeToggle />
        </div>
        
        <SlideIn direction="left" className="w-full max-w-md">
          <Card className="border-2 shadow-xl">
            <CardHeader className="space-y-1 text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <UserPlus className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
              <CardDescription className="text-base">
                Start your learning journey today
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <GoogleSignInButton text="Sign up with Google" />
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or register with email
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="johndoe"
                    {...registerField('username')}
                    disabled={isPending}
                    className="transition-all focus:scale-[1.02]"
                  />
                  {errors.username && (
                    <p className="text-sm text-destructive animate-slide-in">{errors.username.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...registerField('email')}
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
                    {...registerField('password')}
                    disabled={isPending}
                    className="transition-all focus:scale-[1.02]"
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive animate-slide-in">{errors.password.message}</p>
                  )}
                </div>

                <p className="text-xs text-muted-foreground text-center pt-2">
                  By creating an account, you agree to our Terms of Service and Privacy Policy
                </p>
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
                      Creating account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                      Create Account
                    </>
                  )}
                </Button>
                
                <p className="text-sm text-center text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:underline font-semibold">
                    Sign in instead
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </SlideIn>
      </div>

      {/* Right side - Hero Animation */}
      <div className="hidden lg:flex flex-col justify-center items-center p-12 bg-gradient-to-bl from-secondary/10 via-primary/5 to-background relative overflow-hidden order-1 lg:order-2">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <FadeIn className="relative z-10 text-center space-y-8 max-w-md">
          <div className="mx-auto w-32 h-32 bg-secondary/10 rounded-3xl flex items-center justify-center -rotate-3 hover:rotate-3 transition-transform duration-300">
            <Trophy className="h-16 w-16 text-secondary animate-pulse-slow" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-bold">
              <span className="gradient-text">Start Learning</span>
              <span className="block mt-2">Today</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Join thousands of learners and create your first quiz in minutes
            </p>
          </div>

          <div className="space-y-4 pt-4">
            {[
              'Create unlimited quizzes',
              'Track your progress',
              'Share with friends',
              'Learn at your own pace',
            ].map((feature, idx) => (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-muted-foreground">{feature}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
