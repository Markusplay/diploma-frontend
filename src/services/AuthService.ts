import { RegisterRequestBody } from '@/types/RegisterRequestBody';
import { api } from '../lib/api';
import { Token } from '@/types/token.ts';
import { User } from '@/types/user.ts';

class AuthService {
  static signIn(formData: FormData) {
    return api.post<Token>('/token', formData, {
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

  static getUserProfile() {
    return api.get<User>('/profile');
  }
}

export default AuthService;
