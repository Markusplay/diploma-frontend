import { Outlet, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import AuthService from '../services/AuthService';
import { Button } from '@/components/ui/button.tsx';

export default function AuthWrapper() {
  const navigate = useNavigate();

  const fetchMe = async () => {
    try {
      await AuthService.getUser();
    } catch (e) {
      if (e instanceof AxiosError && e.response?.status === 401) {
        AuthService.signOut();
        navigate('/login');
      }
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const handleLogout = async () => {
    AuthService.signOut();
    navigate('/login');
  };

  return (
    <>
      <Button variant="outline" onClick={handleLogout}>
        Вийти
      </Button>
      <Outlet />
    </>
  );
}
