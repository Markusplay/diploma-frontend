import { api } from '../lib/api';
import { PlanItem } from '../types/plan-item.ts';
import { downloadFile, FileVariant } from '@/lib/downloadFile.ts';

class PlanService {
  static getAll() {
    return api.get<PlanItem[]>('/plan');
  }

  static download() {
    return downloadFile(FileVariant.PLAN, 'Report.pdf');
  }
}

export default PlanService;
