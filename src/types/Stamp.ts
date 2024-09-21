import { User } from './User';

export interface Stamp {
  id: string;
  name: string;
  description: string;
  url: string;
  droplet: number;
  type: StampType;
  userId: string;
  Register: User;
}

export enum StampType {
  WAKE_UP = 'WakeUp',
  GO_TO_BED = 'GoToBed',
  HAPPY = 'Happy',
  WATER = 'Water',
  MEDITATION = 'Meditation',
  MEDICINE = 'Medicine',
  MEAL = 'Meal',
  EXERCISE = 'Exercise',
  INCOME = 'Income',
  EXPENSE = 'Expense',
  BOOK = 'Book',
  STUDY = 'Study',
}

export const WEEK_TOTAL = [
  StampType.HAPPY,
  StampType.STUDY,
  StampType.EXERCISE,
  StampType.MEDITATION,
  StampType.BOOK,
];
