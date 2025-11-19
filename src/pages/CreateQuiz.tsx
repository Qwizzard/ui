import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { useGenerateQuiz } from '../hooks/useQuiz';

const createQuizSchema = z.object({
  topic: z.string().min(3, 'Topic must be at least 3 characters'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  questionTypes: z.array(z.string()).min(1, 'Select at least one question type'),
  numberOfQuestions: z.number().min(1).max(20),
});

type CreateQuizFormData = z.infer<typeof createQuizSchema>;

const questionTypeOptions = [
  { value: 'mcq', label: 'Multiple Choice (Single Answer)' },
  { value: 'true-false', label: 'True/False' },
  { value: 'multiple-correct', label: 'Multiple Choice (Multiple Answers)' },
];

export function CreateQuiz() {
  const { mutate: generateQuiz, isPending } = useGenerateQuiz();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateQuizFormData>({
    resolver: zodResolver(createQuizSchema),
    defaultValues: {
      difficulty: 'medium',
      questionTypes: ['mcq'],
      numberOfQuestions: 10,
    },
  });

  const selectedQuestionTypes = watch('questionTypes') || [];

  const onSubmit = (data: CreateQuizFormData) => {
    generateQuiz(data);
  };

  const handleQuestionTypeToggle = (type: string) => {
    const current = selectedQuestionTypes;
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    setValue('questionTypes', updated);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Quiz</CardTitle>
          <CardDescription>
            Generate an AI-powered quiz on any topic
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., JavaScript Basics, World History, Biology"
                {...register('topic')}
                disabled={isPending}
              />
              {errors.topic && (
                <p className="text-sm text-red-500">{errors.topic.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Difficulty Level</Label>
              <div className="grid grid-cols-3 gap-4">
                {['easy', 'medium', 'hard'].map((level) => (
                  <label
                    key={level}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      value={level}
                      {...register('difficulty')}
                      className="cursor-pointer"
                      disabled={isPending}
                    />
                    <span className="capitalize">{level}</span>
                  </label>
                ))}
              </div>
              {errors.difficulty && (
                <p className="text-sm text-red-500">{errors.difficulty.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Question Types</Label>
              <div className="space-y-3">
                {questionTypeOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.value}
                      checked={selectedQuestionTypes.includes(option.value)}
                      onCheckedChange={() => handleQuestionTypeToggle(option.value)}
                      disabled={isPending}
                    />
                    <label
                      htmlFor={option.value}
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
              {errors.questionTypes && (
                <p className="text-sm text-red-500">{errors.questionTypes.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfQuestions">Number of Questions</Label>
              <Input
                id="numberOfQuestions"
                type="number"
                min="1"
                max="20"
                {...register('numberOfQuestions', { valueAsNumber: true })}
                disabled={isPending}
              />
              {errors.numberOfQuestions && (
                <p className="text-sm text-red-500">
                  {errors.numberOfQuestions.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Generating Quiz...' : 'Generate Quiz'}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}

