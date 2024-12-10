import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '../lib/constants';
import GroupService from '../services/GroupService';

export const useGroups = () => {
  return useQuery({
    queryKey: [QUERY_KEY.GROUPS],
    queryFn: async () => {
      const { data } = await GroupService.getAll();
      return data;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
