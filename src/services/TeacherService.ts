import { api } from '../lib/api';
import { Teacher } from '../types/Teacher';

class TeacherService {
  static getAll() {
    return api.get<Teacher[]>('/teachers');
  }
}

export default TeacherService;
