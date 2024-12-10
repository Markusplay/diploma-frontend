import { api } from '../lib/api';
import { K3ItemTypeWithId, K3ItemType } from '../types/K3ItemType';

class K3Service {
  static getAll() {
    return api.get<K3ItemTypeWithId[]>('/k3');
  }

  static create(data: K3ItemType) {
    return api.post('/k3', data);
  }

  static update(data: K3ItemTypeWithId) {
    return api.put(`/k3`, data);
  }

  static delete(id: string) {
    return api.delete(`/k3/${id}`);
  }
}

export default K3Service;
