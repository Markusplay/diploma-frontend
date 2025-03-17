import { api } from '../lib/api';
import { K3ItemTypeWithId } from '../types/k3-item.ts';

class K3Service {
  static getAll() {
    return api.get<K3ItemTypeWithId[]>('/k3');
  }
}

export default K3Service;
