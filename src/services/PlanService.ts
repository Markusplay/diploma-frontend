import { api } from '../lib/api';
import { PlanItem } from '../types/plan-item.ts';
import { downloadFile, FileVariant } from '@/lib/downloadFile.ts';

class PlanService {
  static getAll() {
    return api.get<PlanItem[]>('/plan');
  }

  static getByTeacherId(teacherId: string) {
    return api.get<PlanItem[]>(`/plan/${teacherId}`);
  }

  static download(teacherId?: string) {
    return downloadFile(FileVariant.PLAN, 'Report.pdf', teacherId);
  }
}

export default PlanService;
