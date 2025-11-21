import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Spinner } from '../components/ui/spinner';

export function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed.current) {
      return;
    }
    hasProcessed.current = true;

    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    const error = searchParams.get('error');

    if (error) {
      toast.error(decodeURIComponent(error));
      navigate('/login', { replace: true });
      return;
    }

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        login(token, user);
        toast.success('Successfully signed in with Google!');
        navigate('/', { replace: true });
      } catch (err) {
        console.error('Failed to parse user data:', err);
        toast.error('Authentication failed. Please try again.');
        navigate('/login', { replace: true });
      }
    } else {
      toast.error('Missing authentication data');
      navigate('/login', { replace: true });
    }
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Completing Sign In</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Spinner className="h-8 w-8 mb-4" />
          <p className="text-muted-foreground">
            Please wait while we complete your authentication...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

