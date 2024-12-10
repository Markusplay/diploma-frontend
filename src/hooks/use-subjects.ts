import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '../lib/constants';
import SubjectService from '../services/SubjectService';

export const useSubjects = () => {
  return useQuery({
    queryKey: [QUERY_KEY.SUBJECTS],
    queryFn: async () => {
      const { data } = await SubjectService.getAll();
      return data;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
