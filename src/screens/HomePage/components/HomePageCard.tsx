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
}

export const HomePageCard: FC<Props> = ({ title, description, link }) => {
  return (
    <Card className="w-[350px] border-2 border-gray-200 rounded-md">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button asChild>
          <Link to={link}>Перейти</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
