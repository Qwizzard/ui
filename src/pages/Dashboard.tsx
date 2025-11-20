import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useMyQuizzes } from '../hooks/useQuiz';
import { useMyResults } from '../hooks/useResult';
import { Skeleton } from '../components/ui/skeleton';
import { PlusCircle, BookOpen, Trophy } from 'lucide-react';
import type { Quiz, Result } from '../types';

export function Dashboard() {
  const { data: quizzes, isLoading: quizzesLoading } = useMyQuizzes();
  const { data: results, isLoading: resultsLoading } = useMyResults();

  const stats = {
    totalQuizzes: quizzes?.length || 0,
    totalAttempts: results?.length || 0,
    averageScore:
      results && results.length > 0
        ? (results.reduce((acc: number, r: Result) => acc + r.percentage, 0) / results.length).toFixed(1)
        : 0,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your quiz overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quizzes Created</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuizzes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quizzes Attempted</CardTitle>
            <PlusCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAttempts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Quick Actions</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/quizzes/create" className="block">
              <Button className="w-full justify-start" variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Quiz
              </Button>
            </Link>
            <Link to="/quizzes/public" className="block">
              <Button className="w-full justify-start" variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                Browse Public Quizzes
              </Button>
            </Link>
            <Link to="/quizzes/my-quizzes" className="block">
              <Button className="w-full justify-start" variant="outline">
                View My Quizzes
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Results</CardTitle>
            <CardDescription>Your latest quiz attempts</CardDescription>
          </CardHeader>
          <CardContent>
            {resultsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : !results || results.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No quiz attempts yet
              </p>
            ) : (
              <div className="space-y-3">
                {results.slice(0, 5).map((result: Result) => (
                  <Link
                    key={result._id}
                    to={`/results/${result.slug}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{result.quizId?.topic}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(result.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant={result.percentage >= 70 ? 'default' : 'secondary'}
                      >
                        {result.percentage.toFixed(0)}%
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Quizzes</CardTitle>
          <CardDescription>Quizzes you've created</CardDescription>
        </CardHeader>
        <CardContent>
          {quizzesLoading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : !quizzes || quizzes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">You haven't created any quizzes yet</p>
              <Link to="/quizzes/create">
                <Button>Create Your First Quiz</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {quizzes.slice(0, 5).map((quiz: Quiz) => (
                <Link
                  key={quiz._id}
                  to={`/quizzes/${quiz.slug}`}
                  className="block"
                >
                  <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent">
                    <div className="flex-1">
                      <p className="font-medium">{quiz.topic}</p>
                      <p className="text-sm text-muted-foreground">
                        {quiz.numberOfQuestions} questions • {quiz.difficulty}
                      </p>
                    </div>
                    <Badge variant={quiz.isPublic ? 'default' : 'secondary'}>
                      {quiz.isPublic ? 'Public' : 'Private'}
                    </Badge>
                  </div>
                </Link>
              ))}
              {quizzes.length > 5 && (
                <Link to="/quizzes/my-quizzes">
                  <Button variant="outline" className="w-full">
                    View All Quizzes
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

