import { FC } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { useNavigate } from 'react-router-dom';

export const BackButton: FC = () => {
  const navigate = useNavigate();

  return (
    <Button
      className="w-fit"
      onClick={() => {
        navigate('/');
      }}
      size="lg"
    >
      Назад
    </Button>
  );
};
