import { Book } from './Book';
import { Friend } from './Friend';
import { Stamp, StampStatus } from './Stamp';
import { Tag } from './Tag';

export interface UserStamp {
  id: string;
  userId: string;
  Stamp: Stamp;
  alias: string;
  memo: string;
  isDisplay: boolean;
  displayOrder: number;
  status: StampStatus;
  existGoal: boolean;
  goalUnit: CounterUnit;
  goalInterval: IntervalUnit;
  goalNumber: string;
  Tags: Tag[];
  Friends: Friend[];
  Book: Book;
  bookPercent: string;
}

export enum CounterUnit {
  Number = 'Number',
  Milliliter = 'Milliliter',
  Time = 'Time',
  Hour = 'Hour',
  Book = 'Book',
  Dollar = 'Dollar',
  Yen = 'Yen',
  Won = 'Won'
}

export enum IntervalUnit {
  Month = 'Month',
  Week = 'Week',
  Day = 'Day'
}