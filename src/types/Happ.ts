import { Comment } from './Comment';
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
  water: string;
  moneyUnit: MoneyUnit;
  id: string;
  imageUrls: string[];
  userId: string;
  User: User;
  Comments: Comment[];
  Tags: Tag[];
  UserStamp: UserStamp;
}

export enum Dnd {
  MODIFIED = 'MODIFIED',
  CREATED = 'CREATED'
}
export enum MoneyUnit {
  Dollar = 0,
  Won = 1,
  Yen = 2,
}
