import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Checkbox } from '../components/ui/checkbox';
import { useAttempt, useSubmitAnswer, useSubmitAttempt } from '../hooks/useAttempt';
import { Skeleton } from '../components/ui/skeleton';

export function TakeQuiz() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const { data: attempt, isLoading } = useAttempt(attemptId!);
  const { mutate: submitAnswer } = useSubmitAnswer();
  const { mutate: submitAttempt, isPending: isSubmitting } = useSubmitAttempt();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

  const quiz = attempt?.quizId;
  const questions = quiz?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  // Load saved answer for current question
  useEffect(() => {
    if (attempt?.answers) {
      const savedAnswer = attempt.answers.find(
        (a: any) => a.questionIndex === currentQuestionIndex
      );
      setSelectedAnswers(savedAnswer?.selectedAnswers || []);
    }
  }, [attempt, currentQuestionIndex]);

  const handleAnswerSelect = (optionIndex: number) => {
    if (!currentQuestion) return;

    let newAnswers: number[];
    if (currentQuestion.questionType === 'mcq' || currentQuestion.questionType === 'true-false') {
      // Single answer
      newAnswers = [optionIndex];
    } else {
      // Multiple answers
      newAnswers = selectedAnswers.includes(optionIndex)
        ? selectedAnswers.filter((i) => i !== optionIndex)
        : [...selectedAnswers, optionIndex];
    }
    setSelectedAnswers(newAnswers);
  };

  const handleSaveAndNext = () => {
    if (selectedAnswers.length > 0) {
      submitAnswer({
        attemptId: attemptId!,
        questionIndex: currentQuestionIndex,
        selectedAnswers,
      });
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

  const handleSubmitQuiz = () => {
    if (confirm('Are you sure you want to submit the quiz? This cannot be undone.')) {
      // Save current answer if any
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
          }
        );
      } else {
        submitAttempt(attemptId!);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
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
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Quiz not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = attempt?.answers?.length || 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{quiz.topic}</h1>
        <Badge variant="outline" className="capitalize">
          {quiz.difficulty}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span>
            Answered: {answeredCount}/{questions.length}
          </span>
        </div>
        <Progress value={progress} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {currentQuestion.questionText}
          </CardTitle>
          <p className="text-sm text-muted-foreground capitalize">
            {currentQuestion.questionType === 'mcq' && 'Single Answer'}
            {currentQuestion.questionType === 'true-false' && 'True/False'}
            {currentQuestion.questionType === 'multiple-correct' && 'Multiple Answers'}
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQuestion.options.map((option: string, index: number) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-accent"
              onClick={() => handleAnswerSelect(index)}
            >
              {currentQuestion.questionType === 'multiple-correct' ? (
                <Checkbox checked={selectedAnswers.includes(index)} />
              ) : (
                <input
                  type="radio"
                  checked={selectedAnswers.includes(index)}
                  onChange={() => {}}
                  className="cursor-pointer"
                />
              )}
              <span>{option}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        <div className="flex gap-2">
          {currentQuestionIndex < questions.length - 1 ? (
            <Button onClick={handleSaveAndNext}>
              Save & Next
            </Button>
          ) : (
            <Button onClick={handleSubmitQuiz} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

