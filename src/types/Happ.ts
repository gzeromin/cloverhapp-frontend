import { Comment } from './Comment';
import { Friend } from './Friend';
import { StampStatus } from './Stamp';
import { Tag } from './Tag';
import { User } from './User';
import { UserStamp } from './UserStamp';

export interface Happ {
  startTime: string;
  endTime: string;
  positionX: string;
  positionY: string;
  createdAt: string;
  memo: string;
  money: string;
  moneyUnit: MoneyUnit;
  water: string;
  todo: TodoStatus;
  status: StampStatus;
  id: string;
  imageUrls: string[];
  userId: string;
  User: User;
  Comments: Comment[];
  Tags: Tag[];
  Friends: Friend[];
  UserStamp: UserStamp;
}

export enum MoneyUnit {
  Dollar = 'EN',
  Won = 'KR',
  Yen = 'JP',
}

export enum TodoStatus {
  NOT_TODO = 'NOT_TODO',
  TODO = 'TODO',
  COMPLETE = 'COMPLETE',
}

