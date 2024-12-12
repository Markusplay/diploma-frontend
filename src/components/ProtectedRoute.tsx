import { Outlet, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import { Button } from '@/components/ui/button.tsx';

export default function ProtectedRoute() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    AuthService.signOut();
    navigate('/login');
  };

  return (
    <>
      <Button className="m-4 " variant="outline" onClick={handleLogout}>
        Вийти
      </Button>
      <Outlet />
    </>
  );
}
