export interface Quiz {
  _id: string;
  slug: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  numberOfQuestions: number;
  questionTypes?: string[];
  isPublic: boolean;
  createdAt: string;
  creatorId?: {
    username: string;
  };
  isOwner?: boolean;
  questions?: Question[];
  parentQuizId?: string;
  sourceResultId?: string;
  generationType?: string;
  hasCompletedQuiz?: boolean;
}

export interface Question {
  questionText: string;
  questionType: 'mcq' | 'true-false' | 'multiple-correct';
  options: string[];
  correctAnswers: number[];
  explanation?: string;
}

export interface Result {
  _id: string;
  slug: string;
  quizId?: string | {
    _id: string;
    slug: string;
    topic: string;
  };
  quizSlug?: string;
  quizTopic: string;
  quizDifficulty: 'easy' | 'medium' | 'hard';
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
  answers: ResultAnswer[];
  isResultPublic: boolean;
  userId?: string;
}

export interface ResultAnswer {
  questionText: string;
  options: string[];
  selectedAnswers: number[];
  correctAnswers: number[];
  isCorrect: boolean;
  explanation: string;
}

export interface AdaptiveQuizChild {
  _id: string;
  slug: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  generationType: string;
  createdAt: string;
  sourceResult?: {
    score: number;
    totalQuestions: number;
    percentage: number;
    completedAt: string;
  };
  completionResult?: {
    score: number;
    totalQuestions: number;
    percentage: number;
    completedAt: string;
    slug: string;
  } | null;
  attemptCount: number;
}

