import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { usePublicQuizzes } from '../hooks/useQuiz';
import { useStartAttempt, useQuizAttemptStatus } from '../hooks/useAttempt';
import { useAuth } from '../contexts/AuthContext';
import { Skeleton } from '../components/ui/skeleton';
import { Search, Play, Eye, BookOpen, User, Calendar, Sparkles } from 'lucide-react';
import type { Quiz } from '../types';
import { motion } from 'framer-motion';
import { FadeIn, SlideIn } from '../components/animations/MotionComponents';
import { cn } from '../lib/utils';

function QuizCard({ quiz, index }: { quiz: Quiz; index: number }) {
  const { user } = useAuth();
  const { mutate: startAttempt, isPending } = useStartAttempt();
  const { data: attemptStatus } = useQuizAttemptStatus(quiz.slug);
  const navigate = useNavigate();

  const handleAction = () => {
    // Check if user is authenticated
    if (!user) {
      // Redirect to login with return URL
      navigate(`/login?returnTo=/quizzes/${quiz.slug}`);
      return;
    }

    if (attemptStatus?.status === 'in-progress' && attemptStatus.attemptId) {
      navigate(`/attempt/${attemptStatus.attemptId}`);
    } else {
      startAttempt(quiz.slug);
    }
  };

  const getButtonText = () => {
    if (isPending) return 'Loading...';
    if (attemptStatus?.status === 'in-progress') return 'Continue Quiz';
    if (attemptStatus?.status === 'completed') return 'Retake Quiz';
    return 'Start Quiz';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
      case 'hard':
        return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="card-hover h-full border-2 group">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <CardTitle className="text-xl group-hover:text-primary transition-colors">
                {quiz.topic}
              </CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {quiz.creatorId?.username || 'Unknown'}
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(quiz.createdAt).toLocaleDateString()}
                </div>
              </CardDescription>
            </div>
            <Badge variant="outline" className={cn('capitalize', getDifficultyColor(quiz.difficulty))}>
              {quiz.difficulty}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span className="font-medium">{quiz.numberOfQuestions}</span> questions
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAction} disabled={isPending} size="default" className="group/btn">
                <Play className="mr-2 h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                {getButtonText()}
              </Button>
              <Link to={`/quizzes/${quiz.slug}`}>
                <Button variant="outline" size="default">
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>
              </Link>
            </div>
          </div>
          
          {attemptStatus?.status === 'in-progress' && (
            <div className="mt-3 p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <p className="text-xs text-orange-700 dark:text-orange-400 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                You have an ongoing attempt
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function PublicQuizzes() {
  const { data: quizzes, isLoading } = usePublicQuizzes();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuizzes = useMemo(() => {
    if (!quizzes) return [];
    if (!searchQuery.trim()) return quizzes;

    const query = searchQuery.toLowerCase().trim();
    return quizzes.filter((quiz: Quiz) => {
      const topic = quiz.topic?.toLowerCase() || '';
      const difficulty = quiz.difficulty?.toLowerCase() || '';
      const username = quiz.creatorId?.username?.toLowerCase() || '';
      
      return topic.includes(query) || difficulty.includes(query) || username.includes(query);
    });
  }, [quizzes, searchQuery]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-full max-w-md" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-2">
              <CardHeader>
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Browse <span className="gradient-text">Public Quizzes</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover and take quizzes created by the community
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by topic, difficulty, or creator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{filteredQuizzes.length}</span> quizzes available
              </span>
            </div>
            {searchQuery && (
              <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            )}
          </div>
        </div>
      </FadeIn>

      {/* Quiz Grid */}
      {filteredQuizzes.length === 0 ? (
        <SlideIn direction="up" delay={0.1}>
          <Card className="border-2">
            <CardContent className="py-16 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-medium mb-1">
                  {searchQuery ? 'No quizzes found' : 'No public quizzes available'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? 'Try adjusting your search terms'
                    : 'Be the first to create a public quiz!'}
                </p>
              </div>
              {!searchQuery && (
                <Link to="/quizzes/create">
                  <Button>Create Quiz</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </SlideIn>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredQuizzes.map((quiz: Quiz, index: number) => (
            <QuizCard key={quiz._id} quiz={quiz} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
