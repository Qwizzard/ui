import { useState, useEffect } from 'react';
import { searchLottieAnimations, type LottieAnimation } from '../utils/lottieAnimations';

interface UseLottieAnimationOptions {
  query: string;
  page?: number;
  limit?: number;
  autoFetch?: boolean;
}

interface UseLottieAnimationReturn {
  animations: LottieAnimation[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useLottieAnimation({
  query,
  page = 1,
  limit = 15,
  autoFetch = true,
}: UseLottieAnimationOptions): UseLottieAnimationReturn {
  const [animations, setAnimations] = useState<LottieAnimation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAnimations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await searchLottieAnimations({ query, page, limit });
      setAnimations(results);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch animations'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && query) {
      fetchAnimations();
    }
  }, [query, page, limit, autoFetch]);

  return {
    animations,
    isLoading,
    error,
    refetch: fetchAnimations,
  };
}

