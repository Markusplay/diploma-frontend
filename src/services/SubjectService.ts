import { api } from '../lib/api';
import { SubjectType } from '../types/SubjectType';

class SubjectService {
  static getAll() {
    return api.get<SubjectType[]>('/subjects');
  }
}
export default SubjectService;
