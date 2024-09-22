import { Comment } from './Comment';
import { Tag } from './Tag';
import { User } from './User';
import { UserStamp } from './UserStamp';

export interface Happ {
  happedAt: string;
  positionX: string;
  positionY: string;
  createdAt: string;
  memo: string;
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