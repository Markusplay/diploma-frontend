import { HomePageCard } from '@/screens/HomePage/components/HomePageCard.tsx';
import { CARDS } from '@/screens/HomePage/constants.ts';

export const HomePage = () => {
  return (
    <div className="flex px-4 gap-3 flex-wrap">
      {CARDS.map((card, index) => (
        <HomePageCard
          key={index}
          title={card.title}
          description={card.description}
          link={card.link}
        />
      ))}
    </div>
  );
};
