import { api } from '../lib/api';
import { Group } from '../types/group.ts';

class GroupService {
  static getAll() {
    return api.get<Group[]>('/groups');
  }
}
export default GroupService;
