import { api } from '@/lib/api.ts';
import { Workload } from '@/types/workload.ts';

interface WorkloadResponse {
  max_hours: number;
  min_hours: number;
  imbalance: number;
  is_balanced: boolean;
  overloaded_teachers: string[];
  underloaded_lecturers: number[];
  suggestions: unknown[];
  optimization_applied: boolean;
  iterations: number;
  fitness_improvement: number;
}

class WorkloadService {
  static post(data: Workload) {
    return api.post('/workload', data);
  }

  static analyze() {
    return api.get<WorkloadResponse>('/workload/analyze');
  }

  static delete(id: string) {
    return api.delete(`/workload/${id}`);
  }

  static analyzeTeacher(teacherId: string) {
    return api.get(`/workload/analyze/teacher/${teacherId}`);
  }
}

export default WorkloadService;
