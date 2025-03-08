import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '@/lib/constants.ts';
import AuthService from '@/services/AuthService.ts';

export const useUser = () => {
  return useQuery({
    queryKey: [QUERY_KEY.USER],
    queryFn: async () => {
      const { data } = await AuthService.getUserProfile();
      return data;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
