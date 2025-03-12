interface Card {
  title: string;
  description: string;
  link: string;
}
export const CARDS: Card[] = [
  {
    title: 'Створити навантаження',
    description: 'Сторінка додавання навантаження',
    link: '/creation',
  },
  {
    title: 'Форма К-2',
    description: 'Індивідуальний план роботи викладача',
    link: '/k2',
  },
  {
    title: 'Форма К-3',
    description: 'Бюджетне та контрактне навантаження для всіх форм навчання',
    link: '/k3',
  },
  {
    title: 'Форма К-4',
    description: 'План навчального навантаження науково-педагогічних працівників кафедри',
    link: '/k4',
  },
  {
    title: 'План навантаження',
    description: 'План навчального навантаження НПП у форматі PDF',
    link: '/plan',
  },
];
