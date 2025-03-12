import { api } from '../lib/api';
import { Subject } from '../types/subject.ts';

class SubjectService {
  static getAll() {
    return api.get<Subject[]>('/subjects');
  }
}
export default SubjectService;
