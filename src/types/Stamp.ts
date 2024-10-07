import { User } from './User';

export interface Stamp {
  id: string;
  name: string;
  description: string;
  url: string;
  droplet: number;
  type: StampType;
  status: StampStatus;
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

export enum StampStatus {
  PUBLIC = 'Public',
  FRIEND = 'Friend',
  PRIVATE = 'Private',
}

export const WEEK_TOTAL = [
  StampType.HAPPY,
  StampType.STUDY,
  StampType.EXERCISE,
  StampType.MEDITATION,
  StampType.BOOK,
];

export const DAY_TOTAL = [
  StampType.WATER,
  StampType.MEAL,
];
