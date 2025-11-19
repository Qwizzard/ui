import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useResult } from '../hooks/useResult';
import { Skeleton } from '../components/ui/skeleton';
import { CheckCircle2, XCircle } from 'lucide-react';

export function QuizResults() {
  const { resultId } = useParams<{ resultId: string }>();
  const { data: result, isLoading } = useResult(resultId!);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Results not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A', color: 'text-green-600' };
    if (percentage >= 80) return { grade: 'B', color: 'text-blue-600' };
    if (percentage >= 70) return { grade: 'C', color: 'text-yellow-600' };
    if (percentage >= 60) return { grade: 'D', color: 'text-orange-600' };
    return { grade: 'F', color: 'text-red-600' };
  };

  const { grade, color } = getGrade(result.percentage);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quiz Results</h1>
        <Link to="/">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{result.quizTopic}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1 capitalize">
                {result.quizDifficulty} difficulty •{' '}
                {new Date(result.completedAt).toLocaleDateString()}
              </p>
            </div>
            <Badge variant="outline" className={`text-2xl px-4 py-2 ${color}`}>
              Grade: {grade}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold">{result.score}</p>
              <p className="text-sm text-muted-foreground">Correct Answers</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{result.totalQuestions - result.score}</p>
              <p className="text-sm text-muted-foreground">Incorrect Answers</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{result.percentage.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Detailed Breakdown</h2>
        {result.answers.map((answer: any, index: number) => (
          <Card
            key={index}
            className={
              answer.isCorrect
                ? 'border-green-500/50 dark:border-green-500'
                : 'border-red-500/50 dark:border-red-500'
            }
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-medium">
                  Question {index + 1}
                </CardTitle>
                {answer.isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                )}
              </div>
              <p className="text-base font-normal mt-2">{answer.questionText}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {answer.options.map((option: string, optionIndex: number) => {
                  const isSelected = answer.selectedAnswers.includes(optionIndex);
                  const isCorrect = answer.correctAnswers.includes(optionIndex);

                  let bgColor = '';
                  let textColor = '';
                  let icon = null;

                  if (isCorrect) {
                    bgColor = 'bg-green-500/20 border-green-500/50 dark:bg-green-500/20 dark:border-green-500';
                    textColor = 'text-green-900 dark:text-green-100';
                    icon = <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />;
                  } else if (isSelected && !isCorrect) {
                    bgColor = 'bg-red-500/20 border-red-500/50 dark:bg-red-500/20 dark:border-red-500';
                    textColor = 'text-red-900 dark:text-red-100';
                    icon = <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
                  } else {
                    textColor = 'text-foreground';
                  }

                  return (
                    <div
                      key={optionIndex}
                      className={`p-3 rounded-lg border ${bgColor}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={textColor}>{option}</span>
                        {icon}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-blue-500/20 border border-blue-500/50 dark:bg-blue-500/20 dark:border-blue-500 rounded-lg p-4">
                <p className="font-medium text-sm text-blue-900 dark:text-blue-100 mb-1">Explanation:</p>
                <p className="text-sm text-blue-800 dark:text-blue-200">{answer.explanation}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

