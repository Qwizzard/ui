import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { usePublicQuizzes } from '../hooks/useQuiz';
import { useStartAttempt } from '../hooks/useAttempt';
import { Skeleton } from '../components/ui/skeleton';

export function PublicQuizzes() {
  const { data: quizzes, isLoading } = usePublicQuizzes();
  const { mutate: startAttempt } = useStartAttempt();

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
      <h1 className="text-3xl font-bold">Public Quizzes</h1>

      {!quizzes || quizzes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No public quizzes available yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {quizzes.map((quiz: any) => (
            <Card key={quiz._id}>
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
                  <Button onClick={() => startAttempt(quiz._id)}>
                    Start Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

