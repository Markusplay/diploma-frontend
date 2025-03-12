import { api } from '../lib/api';
import { K3ItemTypeWithId } from '../types/k3-item.ts';

class K3Service {
  static getAll() {
    return api.get<K3ItemTypeWithId[]>('/k3');
  }

  static delete(id: string) {
    return api.delete(`/k3/${id}`);
  }
}

export default K3Service;
