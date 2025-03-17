import { FC } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Link } from 'react-router-dom';

interface Props {
  title: string;
  description: string;
  link: string;
  icon: React.ReactNode;
}

export const HomePageCard: FC<Props> = ({ title, description, link, icon }) => {
  return (
    <Card className="w-[350px] border-2 border-gray-200 rounded-md">
      <CardHeader>
        <CardTitle className="flex gap-3 items-center text-xl">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link to={link}>Перейти</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
