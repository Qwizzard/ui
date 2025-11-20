import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { usePublicQuizzes } from '../hooks/useQuiz';
import { useStartAttempt, useQuizAttemptStatus } from '../hooks/useAttempt';
import { Skeleton } from '../components/ui/skeleton';
import { Search } from 'lucide-react';
import type { Quiz } from '../types';

function QuizCard({ quiz }: { quiz: Quiz }) {
  const { mutate: startAttempt, isPending } = useStartAttempt();
  const { data: attemptStatus } = useQuizAttemptStatus(quiz.slug);
  const navigate = useNavigate();

  const handleAction = () => {
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle>{quiz.topic}</CardTitle>
            <CardDescription>
              By {quiz.creatorId?.username || 'Unknown'} •{' '}
              {new Date(quiz.createdAt).toLocaleDateString()}
            </CardDescription>
          </div>
          <Badge variant="outline" className="capitalize">
            {quiz.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {quiz.numberOfQuestions} questions
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAction} disabled={isPending}>
              {getButtonText()}
            </Button>
            <Link to={`/quizzes/${quiz.slug}`}>
              <Button variant="outline" size="default">
                View
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
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
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Public Quizzes</h1>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by topic, difficulty, or creator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {!quizzes || quizzes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No public quizzes available yet</p>
          </CardContent>
        </Card>
      ) : filteredQuizzes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No quizzes found matching "{searchQuery}"</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredQuizzes.map((quiz: Quiz) => (
            <QuizCard key={quiz.slug} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
}

