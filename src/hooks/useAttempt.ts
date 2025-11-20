import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from '../lib/axios';
import { toast } from 'sonner';

export function useStartAttempt() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (quizId: string) => {
      const response = await axios.post('/attempts/start', { quizId });
      return response.data;
    },
    onSuccess: (data) => {
      navigate(`/attempt/${data.slug}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to start attempt');
    },
  });
}

export function useAttempt(attemptId: string) {
  return useQuery({
    queryKey: ['attempt', attemptId],
    queryFn: async () => {
      const response = await axios.get(`/attempts/${attemptId}`);
      return response.data;
    },
    enabled: !!attemptId,
  });
}

export function useSubmitAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      attemptId,
      questionIndex,
      selectedAnswers,
    }: {
      attemptId: string;
      questionIndex: number;
      selectedAnswers: number[];
    }) => {
      const response = await axios.post(`/attempts/${attemptId}/answer`, {
        questionIndex,
        selectedAnswers,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['attempt', variables.attemptId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to save answer');
    },
  });
}

export function useSubmitAttempt() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (attemptId: string) => {
      const response = await axios.post(`/attempts/${attemptId}/submit`);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success('Quiz submitted successfully!');
      navigate(`/results/${data.slug}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit quiz');
    },
  });
}

export function useMyAttempts() {
  return useQuery({
    queryKey: ['my-attempts'],
    queryFn: async () => {
      const response = await axios.get('/attempts/my-attempts');
      return response.data;
    },
  });
}

export function useQuizAttemptStatus(quizId: string | undefined) {
  return useQuery({
    queryKey: ['quiz-attempt-status', quizId],
    queryFn: async () => {
      if (!quizId) return null;
      const response = await axios.get(`/attempts/quiz/${quizId}/status`);
      return response.data;
    },
    enabled: !!quizId,
  });
}

