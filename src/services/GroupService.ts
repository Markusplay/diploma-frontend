import { api } from '../lib/api';
import { Group, GroupWithId } from '../types/group.ts';

class GroupService {
  static getAll() {
    return api.get<GroupWithId[]>('/groups');
  }

  static getById(groupId: number) {
    return api.get<GroupWithId>(`/groups/${groupId}`);
  }

  static create(group: Omit<Group, 'groupId'>) {
    return api.post<GroupWithId>('/groups', group);
  }

  static update(groupId: number, group: Omit<Group, 'groupId'>) {
    return api.put<GroupWithId>(`/groups/${groupId}`, group);
  }

  static delete(groupId: number) {
    return api.delete(`/groups/${groupId}`);
  }
}

export default GroupService;
