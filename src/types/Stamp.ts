import { Comment } from './Comment';
import { Friend } from './Friend';
import { Tag } from './Tag';
import { User } from './User';

export interface Stamp {
  stampedAt: string;
  createdAt: string;
  memo: string;
  stampName: string;
  id: string;
  imageUrls: string[];
  status: StampStatus;
  userId: string;
  User: User;
  Comments: Comment[];
  Friends: Friend[];
  Tags: Tag[];
}

export enum StampStatus {
  PUBLIC = 'PUBLIC',
  PROTECTED = 'PROTECTED',
  PRIVATE = 'PRIVATE',
}
