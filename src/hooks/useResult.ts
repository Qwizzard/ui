import { useQuery } from '@tanstack/react-query';
import axios from '../lib/axios';

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

