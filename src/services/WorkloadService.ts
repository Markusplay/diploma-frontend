import { api } from '@/lib/api.ts';
import { Workload } from '@/types/workload.ts';

class WorkloadService {
  static post(data: Workload) {
    return api.post('/workload', data);
  }
}

export default WorkloadService;
