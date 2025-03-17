import { Outlet, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import { Button } from '@/components/ui/button.tsx';
import { User } from 'lucide-react';
import { useUser } from '@/hooks/use-user.ts';

export default function ProtectedRoute() {
  const navigate = useNavigate();
  const { data: user } = useUser();

  const handleLogout = async () => {
    AuthService.signOut();
    navigate('/login');
  };

  return (
    <>
      <div className="flex justify-between m-4">
        <div className="flex gap-2">
          <User />
          {user?.username}
        </div>
        <Button variant="destructive" onClick={handleLogout}>
          Вийти
        </Button>
      </div>

      <Outlet />
    </>
  );
}
