import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '../lib/constants';
import TeacherService from '../services/TeacherService';

export const useTeachers = () => {
  return useQuery({
    queryKey: [QUERY_KEY.TEACHERS],
    queryFn: async () => {
      const { data } = await TeacherService.getAll();
      return data;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
