import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface ErrorResponse {
  message?: string;
}

interface GenerateQuizData {
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionTypes: string[];
  numberOfQuestions: number;
}

interface GenerateAdaptiveQuizData {
  resultSlug: string;
  focusOnWeakAreas: boolean;
  useHarderDifficulty: boolean;
}

export function useGenerateQuiz() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: GenerateQuizData) => {
      const response = await axios.post('/quizzes/generate', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-quizzes'] });
      toast.success('Quiz generated successfully!');
      navigate('/quizzes/my-quizzes');
    },
    onError: (error: unknown) => {
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data?.message || 'Failed to generate quiz');
    },
  });
}

export function useGenerateAdaptiveQuiz() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: GenerateAdaptiveQuizData) => {
      const response = await axios.post('/quizzes/adaptive', data);
      return response.data;
    },
    onSuccess: (quiz) => {
      queryClient.invalidateQueries({ queryKey: ['my-quizzes'] });
      toast.success('Adaptive quiz generated successfully!');
      // Navigate to the new quiz
      navigate(`/quizzes/${quiz.slug}`);
    },
    onError: (error: unknown) => {
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(
        axiosError.response?.data?.message || 'Failed to generate adaptive quiz',
      );
    },
  });
}

export function useMyQuizzes() {
  return useQuery({
    queryKey: ['my-quizzes'],
    queryFn: async () => {
      const response = await axios.get('/quizzes/my-quizzes');
      return response.data;
    },
  });
}

export function usePublicQuizzes() {
  return useQuery({
    queryKey: ['public-quizzes'],
    queryFn: async () => {
      const response = await axios.get('/quizzes/public');
      return response.data;
    },
  });
}

export function useQuiz(quizId: string) {
  return useQuery({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      const response = await axios.get(`/quizzes/${quizId}`);
      return response.data;
    },
    enabled: !!quizId,
  });
}

export function useDeleteQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quizId: string) => {
      await axios.delete(`/quizzes/${quizId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-quizzes'] });
      toast.success('Quiz deleted successfully');
    },
    onError: (error: unknown) => {
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data?.message || 'Failed to delete quiz');
    },
  });
}

export function useToggleQuizVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quizId: string) => {
      const response = await axios.patch(`/quizzes/${quizId}/visibility`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['public-quizzes'] });
      toast.success('Quiz visibility updated');
    },
    onError: (error: unknown) => {
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data?.message || 'Failed to update visibility');
    },
  });
}

export function useHasCompletedQuiz(quizId: string) {
  return useQuery({
    queryKey: ['has-completed', quizId],
    queryFn: async () => {
      const response = await axios.get(`/quizzes/${quizId}/has-completed`);
      return response.data;
    },
    enabled: !!quizId,
  });
}

export function useAdaptiveQuizzes(parentQuizSlug: string) {
  return useQuery({
    queryKey: ['adaptive-quizzes', parentQuizSlug],
    queryFn: async () => {
      const response = await axios.get(`/quizzes/${parentQuizSlug}/adaptive-children`);
      return response.data;
    },
    enabled: !!parentQuizSlug,
  });
}

