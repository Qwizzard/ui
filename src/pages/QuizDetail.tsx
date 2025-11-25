import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui/tooltip';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useQuiz, useDeleteQuiz, useToggleQuizVisibility } from '../hooks/useQuiz';
import { useStartAttempt, useQuizAttemptStatus } from '../hooks/useAttempt';
import { useAuth } from '../contexts/AuthContext';
import { AdaptiveQuizTimeline } from '../components/AdaptiveQuizTimeline';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Globe, 
  Lock, 
  AlertTriangle, 
  Sparkles,
  Info 
} from 'lucide-react';
import type { Question } from '../types';

export function QuizDetail() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: quiz, isLoading, error } = useQuiz(quizId!);
  const { mutate: deleteQuiz, isPending: isDeleting } = useDeleteQuiz();
  const { mutate: toggleVisibility, isPending: isTogglingVisibility } = useToggleQuizVisibility();
  const { mutate: startAttempt, isPending: isStarting } = useStartAttempt();
  const { data: attemptStatus } = useQuizAttemptStatus(quizId!);

  const handleTakeQuiz = () => {
    // Check if user is authenticated
    if (!user) {
      // Redirect to login with return URL
      navigate(`/login?returnTo=/quizzes/${quizId}`);
      return;
    }

    if (!quiz?.slug) return;
    
    if (attemptStatus?.status === 'in-progress' && attemptStatus.attemptId) {
      navigate(`/attempt/${attemptStatus.attemptId}`);
    } else {
      startAttempt(quiz.slug);
    }
  };

  const getTakeQuizButtonText = () => {
    if (isStarting) return 'Loading...';
    if (attemptStatus?.status === 'in-progress') return 'Continue Quiz';
    if (attemptStatus?.status === 'completed') return 'Retake Quiz';
    return 'Take Quiz';
  };

  const handleDelete = () => {
    if (!quiz?.slug) return;
    if (confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      deleteQuiz(quiz.slug, {
        onSuccess: () => {
          navigate('/quizzes/my-quizzes');
        },
      });
    }
  };

  const handleToggleVisibility = () => {
    if (!quiz?.slug) return;
    toggleVisibility(quiz.slug);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-32" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="space-y-6">
        <Link to="/quizzes/my-quizzes">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Quizzes
          </Button>
        </Link>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-destructive mb-4">
              {error ? 'Failed to load quiz' : 'Quiz not found'}
            </p>
            <Link to="/quizzes/my-quizzes">
              <Button>Go to My Quizzes</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOwner = quiz.isOwner !== false;
  const isAdaptive = !!quiz.parentQuizId;
  const hasCompletedQuiz = quiz.hasCompletedQuiz || false;
  const canViewQuestions = isOwner || hasCompletedQuiz;

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <Link to="/quizzes/my-quizzes">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Quizzes
          </Button>
        </Link>
      </div>

      {/* Quiz Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-3xl">{quiz.topic}</CardTitle>
                {isAdaptive && (
                  <Badge variant="outline" className="adaptive-badge gap-1">
                    <Sparkles className="h-3 w-3" />
                    Adaptive
                  </Badge>
                )}
              </div>
              <CardDescription className="text-base mt-2">
                Created {new Date(quiz.createdAt).toLocaleDateString()} by{' '}
                {quiz.creatorId?.username || 'Unknown'}
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2">
              <Badge
                variant={quiz.isPublic ? 'default' : 'secondary'}
                className="w-fit"
              >
                {quiz.isPublic ? (
                  <>
                    <Globe className="mr-1 h-3 w-3" />
                    Public
                  </>
                ) : (
                  <>
                    <Lock className="mr-1 h-3 w-3" />
                    Private
                  </>
                )}
              </Badge>
              <Badge variant="outline" className="capitalize w-fit">
                {quiz.difficulty}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div>
              <span className="font-semibold text-foreground">
                {quiz.numberOfQuestions}
              </span>{' '}
              questions
            </div>
            <div>
              <span className="font-semibold text-foreground">
                {quiz.questionTypes?.join(', ') || 'Mixed'}
              </span>{' '}
              question types
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            {isAdaptive && attemptStatus?.status === 'completed' ? (
              <Button disabled variant="outline">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Cannot Retake Adaptive Quiz
              </Button>
            ) : (
              <Button onClick={handleTakeQuiz} disabled={isStarting}>
                {getTakeQuizButtonText()}
              </Button>
            )}
            
            {isOwner && (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Button
                          variant="outline"
                          onClick={handleToggleVisibility}
                          disabled={isTogglingVisibility || isAdaptive}
                        >
                          {isTogglingVisibility
                            ? 'Updating...'
                            : quiz.isPublic
                              ? 'Make Private'
                              : 'Make Public'}
                        </Button>
                      </div>
                    </TooltipTrigger>
                    {isAdaptive && (
                      <TooltipContent>
                        <p>Adaptive quizzes cannot be shared</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete Quiz'}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Questions Section */}
      {!canViewQuestions && !user && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Questions and answers are hidden. Please{' '}
            <Link to={`/login?returnTo=/quizzes/${quizId}`} className="font-semibold underline">
              sign in
            </Link>{' '}
            and take the quiz to view them.
          </AlertDescription>
        </Alert>
      )}

      {!canViewQuestions && user && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Questions and answers are hidden until you complete this quiz at least once. 
            Click "Take Quiz" above to start!
          </AlertDescription>
        </Alert>
      )}

      {canViewQuestions && quiz.questions && (
        <Card>
          <CardHeader>
            <div className="space-y-2">
              <CardTitle>Questions & Answers</CardTitle>
              <CardDescription>
                View all questions, options, correct answers, and explanations
              </CardDescription>
              {!isOwner && (
                <Alert className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                    <strong>Caution:</strong> Reviewing answers may affect your learning. 
                    Consider taking the quiz again before viewing solutions.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {quiz.questions.map((question: Question, index: number) => (
                <AccordionItem key={index} value={`question-${index}`}>
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="font-semibold text-muted-foreground min-w-[2rem]">
                        {index + 1}.
                      </span>
                      <div className="flex-1">
                        <p className="font-medium">{question.questionText}</p>
                        <Badge
                          variant="outline"
                          className="mt-2 text-xs capitalize"
                        >
                          {question.questionType === 'mcq'
                            ? 'Multiple Choice'
                            : question.questionType === 'true-false'
                              ? 'True/False'
                              : 'Multiple Correct'}
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-11 space-y-4 pt-2">
                      {/* Options */}
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-muted-foreground">
                          Options:
                        </p>
                        <div className="space-y-2">
                          {question.options?.map((option: string, optIndex: number) => {
                            const isCorrect = question.correctAnswers?.includes(optIndex);
                            return (
                              <div
                                key={optIndex}
                                className={`flex items-start gap-2 p-3 rounded-lg border ${
                                  isCorrect
                                    ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900'
                                    : 'bg-muted/50'
                                }`}
                              >
                                {isCorrect ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                )}
                                <div className="flex-1">
                                  <p className="text-sm">
                                    <span className="font-medium mr-2">
                                      {String.fromCharCode(65 + optIndex)}.
                                    </span>
                                    {option}
                                  </p>
                                  {isCorrect && (
                                    <p className="text-xs text-green-700 dark:text-green-300 mt-1 font-medium">
                                      ✓ Correct Answer
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Explanation */}
                      {question.explanation && (
                        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                            💡 Explanation:
                          </p>
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* Adaptive Quiz Timeline - Only show for original quizzes if user is owner */}
      {isOwner && !isAdaptive && (
        <AdaptiveQuizTimeline parentQuizSlug={quiz.slug} />
      )}
    </div>
  );
}
