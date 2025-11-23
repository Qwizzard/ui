import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Checkbox } from '../components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import {
  useAttempt,
  useSubmitAnswer,
  useSubmitAttempt,
} from '../hooks/useAttempt';
import { Skeleton } from '../components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  AlertCircle,
  Send,
  Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';

export function TakeQuiz() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const { data: attempt, isLoading } = useAttempt(attemptId!);
  const { mutate: submitAnswer } = useSubmitAnswer();
  const { mutate: submitAttempt, isPending: isSubmitting } = useSubmitAttempt();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [answerSaved, setAnswerSaved] = useState(false);

  const quiz = attempt?.quizId;
  const questions = quiz?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  // Initialize to first unanswered question when attempt loads
  useEffect(() => {
    if (attempt && questions.length > 0 && !hasInitialized) {
      const answeredIndices = new Set(
        attempt.answers?.map((a: { questionIndex: number }) => a.questionIndex) || []
      );
      
      let firstUnanswered = 0;
      for (let i = 0; i < questions.length; i++) {
        if (!answeredIndices.has(i)) {
          firstUnanswered = i;
          break;
        }
      }
      
      setCurrentQuestionIndex(firstUnanswered);
      setHasInitialized(true);
    }
  }, [attempt, questions.length, hasInitialized]);

  // Load saved answer when navigating between questions
  useEffect(() => {
    const savedAnswer = attempt?.answers?.find(
      (a: { questionIndex: number; selectedAnswers: number[] }) =>
        a.questionIndex === currentQuestionIndex
    );
    setSelectedAnswers(savedAnswer?.selectedAnswers || []);
    setAnswerSaved(false);
  }, [currentQuestionIndex, attempt]);

  const handleAnswerSelect = (optionIndex: number) => {
    if (!currentQuestion) return;

    let newAnswers: number[];
    if (
      currentQuestion.questionType === 'mcq' ||
      currentQuestion.questionType === 'true-false'
    ) {
      newAnswers = [optionIndex];
    } else {
      newAnswers = selectedAnswers.includes(optionIndex)
        ? selectedAnswers.filter((i) => i !== optionIndex)
        : [...selectedAnswers, optionIndex];
    }
    setSelectedAnswers(newAnswers);
    setAnswerSaved(false);
  };

  const handleSaveAndNext = () => {
    if (selectedAnswers.length > 0) {
      submitAnswer({
        attemptId: attemptId!,
        questionIndex: currentQuestionIndex,
        selectedAnswers,
      });
      setAnswerSaved(true);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (selectedAnswers.length > 0) {
      submitAnswer(
        {
          attemptId: attemptId!,
          questionIndex: currentQuestionIndex,
          selectedAnswers,
        },
        {
          onSuccess: () => {
            submitAttempt(attemptId!);
          },
          onError: (error) => {
            console.error('Failed to save final answer:', error);
            submitAttempt(attemptId!);
          },
        }
      );
    } else {
      submitAttempt(attemptId!);
    }
    setShowSubmitDialog(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-2/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quiz || !currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Quiz not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  const actualAnsweredCount = (() => {
    const savedAnswers = new Set(
      attempt?.answers?.map((a: { questionIndex: number }) => a.questionIndex) || []
    );
    if (selectedAnswers.length > 0) {
      savedAnswers.add(currentQuestionIndex);
    }
    return savedAnswers.size;
  })();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold mb-2">{quiz.topic}</h1>
          <p className="text-muted-foreground">
            Answer all questions to complete the quiz
          </p>
        </div>
        <Badge 
          variant="outline" 
          className="capitalize w-fit text-base px-4 py-2"
        >
          {quiz.difficulty}
        </Badge>
      </motion.div>

      {/* Progress Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-2">
          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-medium">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>
              <Badge 
                variant={actualAnsweredCount === questions.length ? 'default' : 'secondary'}
                className="font-mono"
              >
                {actualAnsweredCount}/{questions.length} Answered
              </Badge>
            </div>
            <div className="relative">
              <Progress value={progress} className="h-3" />
              <motion.div
                className="absolute top-0 left-0 h-3 bg-primary/20 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2">
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <CardTitle className="text-2xl leading-relaxed flex-1">
                  {currentQuestion.questionText}
                </CardTitle>
                <div className="flex-shrink-0">
                  {answerSaved && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Saved</span>
                    </motion.div>
                  )}
                </div>
              </div>
              <Badge variant="outline" className="w-fit capitalize text-sm">
                {currentQuestion.questionType === 'mcq' && '📝 Single Answer'}
                {currentQuestion.questionType === 'true-false' && '✓✗ True/False'}
                {currentQuestion.questionType === 'multiple-correct' && '☑️ Multiple Answers'}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentQuestion.options.map((option: string, index: number) => {
                const isSelected = selectedAnswers.includes(index);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleAnswerSelect(index)}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all',
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-md'
                        : 'border-border hover:border-primary/50 hover:bg-accent/50'
                    )}
                  >
                    {currentQuestion.questionType === 'multiple-correct' ? (
                      <Checkbox 
                        checked={isSelected} 
                        className="pointer-events-none"
                      />
                    ) : (
                      <div className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                        isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
                      )}>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-primary-foreground rounded-full"
                          />
                        )}
                      </div>
                    )}
                    <span className={cn(
                      'flex-1 text-lg',
                      isSelected && 'font-medium text-primary'
                    )}>
                      {option}
                    </span>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between gap-4"
      >
        <Button
          variant="outline"
          size="lg"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="group"
        >
          <ChevronLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Previous
        </Button>

        <div className="flex gap-2">
          {currentQuestionIndex < questions.length - 1 ? (
            <Button 
              size="lg" 
              onClick={handleSaveAndNext}
              disabled={selectedAnswers.length === 0}
              className="group"
            >
              Save & Next
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          ) : (
            <Button 
              size="lg"
              onClick={() => setShowSubmitDialog(true)} 
              disabled={isSubmitting}
              className="group"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  Submit Quiz
                </>
              )}
            </Button>
          )}
        </div>
      </motion.div>

      {/* Submit Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Submit Quiz?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                Are you sure you want to submit the quiz? This action cannot be undone.
              </p>
              {actualAnsweredCount < questions.length && (
                <div className="flex items-start gap-2 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                    You have only answered {actualAnsweredCount} out of {questions.length} questions.
                    Unanswered questions will be marked as incorrect.
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleSubmitQuiz}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
