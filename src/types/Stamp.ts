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
  ACCOUNT = 'Account',
  BOOK = 'Book',
  STUDY = 'Study',
  WORK = 'Work',
}

