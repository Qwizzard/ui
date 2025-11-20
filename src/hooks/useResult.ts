import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../lib/axios';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface ErrorResponse {
  message?: string;
}

export function useMyResults() {
  return useQuery({
    queryKey: ['my-results'],
    queryFn: async () => {
      const response = await axios.get('/results/my-results');
      return response.data;
    },
  });
}

export function useResult(resultId: string) {
  return useQuery({
    queryKey: ['result', resultId],
    queryFn: async () => {
      const response = await axios.get(`/results/${resultId}`);
      return response.data;
    },
    enabled: !!resultId,
  });
}

export function useQuizResults(quizId: string) {
  return useQuery({
    queryKey: ['quiz-results', quizId],
    queryFn: async () => {
      const response = await axios.get(`/results/quiz/${quizId}`);
      return response.data;
    },
    enabled: !!quizId,
  });
}

export function useToggleResultVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resultId: string) => {
      const response = await axios.patch(`/results/${resultId}/visibility`);
      return response.data;
    },
    onSuccess: (_, resultId) => {
      queryClient.invalidateQueries({ queryKey: ['result', resultId] });
      queryClient.invalidateQueries({ queryKey: ['my-results'] });
      toast.success('Result visibility updated');
    },
    onError: (error: unknown) => {
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data?.message || 'Failed to update visibility');
    },
  });
}

