import { RegisterRequestBody } from '@/types/RegisterRequestBody';
import { api } from '../lib/api';

class AuthService {
  static async signIn(formData: FormData) {
    return api.post('/token', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  static signOut() {
    localStorage.clear();
  }

  static signUp(values: RegisterRequestBody) {
    return api.post('/register', values);
  }

  static getUser() {
    return api.get('/me');
  }
}

export default AuthService;
