import { api } from '../lib/api';
import { LoadType } from '../types/LoadType';
import { downloadFile } from '@/lib/downloadFile.ts';

class LoadService {
  static getAll() {
    return api.get<LoadType[]>('/load');
  }
  static create() {
    return api.post('/load');
  }

  static download() {
    return downloadFile('load', 'Report.pdf');
  }
}

export default LoadService;
