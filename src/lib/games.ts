import { TrainingLevel } from '@/lib/scheduling';

export type Game = {
  id: string;
  name: string;
  levels: TrainingLevel[];
};

export const GAMES: Game[] = [
  {
    id: 'naraka',
    name: 'Naraka: Bladepoint',
    levels: ['Beginner', 'Intermediate', 'Advanced'],
  },
];
