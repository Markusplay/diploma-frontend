import { api } from '../lib/api';
import { GroupType } from '../types/GroupType';

class GroupService {
  static getAll() {
    return api.get<GroupType[]>('/groups');
  }
}
export default GroupService;
