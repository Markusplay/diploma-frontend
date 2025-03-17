import { CirclePlusIcon, FileSpreadsheetIcon, SheetIcon, UsersIcon } from 'lucide-react';

interface Card {
  title: string;
  description: string;
  link: string;
  icon: React.ReactNode;
}
export const CARDS: Card[] = [
  {
    title: 'Створити навантаження',
    description: 'Сторінка додавання навантаження',
    link: '/creation',
    icon: <CirclePlusIcon />,
  },
  {
    title: 'Форма К-2',
    description: 'Індивідуальний план роботи викладача',
    link: '/k2',
    icon: <SheetIcon />,
  },
  {
    title: 'Форма К-3',
    description: 'Бюджетне та контрактне навантаження для всіх форм навчання',
    link: '/k3',
    icon: <SheetIcon />,
  },
  {
    title: 'Форма К-4',
    description: 'План навчального навантаження науково-педагогічних працівників кафедри',
    link: '/k4',
    icon: <SheetIcon />,
  },
  {
    title: 'План навантаження',
    description: 'План навчального навантаження НПП у форматі PDF',
    link: '/plan',
    icon: <FileSpreadsheetIcon />,
  },
  {
    title: 'Групи',
    description: 'Управління академ. групами',
    link: '/group',
    icon: <UsersIcon />,
  },
];
