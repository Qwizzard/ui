import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30 seconds - refresh more frequently
      refetchOnWindowFocus: true, // Refetch when user returns to tab
      retry: 1,
    },
  },
});

