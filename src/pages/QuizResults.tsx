import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useResult, useToggleResultVisibility } from '../hooks/useResult';
import { Skeleton } from '../components/ui/skeleton';
import { CheckCircle2, XCircle, Globe, Lock, Share2 } from 'lucide-react';
import type { ResultAnswer } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export function QuizResults() {
  const { resultId } = useParams<{ resultId: string }>();
  const { data: result, isLoading } = useResult(resultId!);
  const { user } = useAuth();
  const { mutate: toggleVisibility, isPending: isTogglingVisibility } = useToggleResultVisibility();

  const isOwner = result && user && String(result.userId) === String(user.id);

  const handleToggleVisibility = () => {
    if (resultId) {
      toggleVisibility(resultId);
    }
  };

  const handleShareResult = () => {
    const shareUrl = `${window.location.origin}/results/${resultId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Result link copied to clipboard!');
  };

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
        <div className="flex gap-2">
          {/* Show share button for everyone if result is public */}
          {result.isResultPublic && (
            <Button
              variant="outline"
              size="default"
              onClick={handleShareResult}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          )}
          {/* Only show visibility toggle for owners */}
          {isOwner && (
            <Button
              variant="outline"
              size="default"
              onClick={handleToggleVisibility}
              disabled={isTogglingVisibility}
            >
              {result.isResultPublic ? (
                <>
                  <Globe className="mr-2 h-4 w-4" />
                  Make Private
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Make Public
                </>
              )}
            </Button>
          )}
          {user && (
            <Link to="/">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl">{result.quizTopic}</CardTitle>
                {!isOwner && result.isResultPublic && (
                  <Badge variant="secondary" className="text-xs">
                    <Globe className="mr-1 h-3 w-3" />
                    Public Result
                  </Badge>
                )}
              </div>
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
        {result.answers.map((answer: ResultAnswer, index: number) => (
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

