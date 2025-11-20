import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useMyQuizzes, useDeleteQuiz, useToggleQuizVisibility } from '../hooks/useQuiz';
import { useStartAttempt, useQuizAttemptStatus } from '../hooks/useAttempt';
import { Skeleton } from '../components/ui/skeleton';
import type { Quiz } from '../types';

function MyQuizCard({ quiz }: { quiz: Quiz }) {
  const { mutate: deleteQuiz } = useDeleteQuiz();
  const { mutate: toggleVisibility } = useToggleQuizVisibility();
  const { mutate: startAttempt, isPending } = useStartAttempt();
  const { data: attemptStatus } = useQuizAttemptStatus(quiz.slug);
  const navigate = useNavigate();

  const handleTakeQuiz = () => {
    if (attemptStatus?.status === 'in-progress' && attemptStatus.attemptId) {
      navigate(`/attempt/${attemptStatus.attemptId}`);
    } else {
      startAttempt(quiz.slug);
    }
  };

  const getTakeQuizButtonText = () => {
    if (isPending) return 'Loading...';
    if (attemptStatus?.status === 'in-progress') return 'Continue Quiz';
    if (attemptStatus?.status === 'completed') return 'Retake Quiz';
    return 'Take Quiz';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle>{quiz.topic}</CardTitle>
            <CardDescription>
              Created {new Date(quiz.createdAt).toLocaleDateString()}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant={quiz.isPublic ? 'default' : 'secondary'}>
              {quiz.isPublic ? 'Public' : 'Private'}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {quiz.difficulty}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {quiz.numberOfQuestions} questions
          </div>
          <div className="flex gap-2">
            <Button onClick={handleTakeQuiz} disabled={isPending} size="sm">
              {getTakeQuizButtonText()}
            </Button>
            <Link to={`/quizzes/${quiz.slug}`}>
              <Button variant="outline" size="sm">
                View
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleVisibility(quiz.slug)}
            >
              {quiz.isPublic ? 'Make Private' : 'Make Public'}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (confirm('Are you sure you want to delete this quiz?')) {
                  deleteQuiz(quiz.slug);
                }
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MyQuizzes() {
  const { data: quizzes, isLoading } = useMyQuizzes();

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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Quizzes</h1>
        <Link to="/quizzes/create">
          <Button>Create New Quiz</Button>
        </Link>
      </div>

      {!quizzes || quizzes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">You haven't created any quizzes yet</p>
            <Link to="/quizzes/create">
              <Button>Create Your First Quiz</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {quizzes.map((quiz: Quiz) => (
            <MyQuizCard key={quiz.slug} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
}

