import { Comment } from './Comment';
import { Friend } from './Friend';
import { Tag } from './Tag';
import { User } from './User';

export interface Happ {
  happedAt: string;
  createdAt: string;
  memo: string;
  id: string;
  imageUrls: string[];
  userId: string;
  User: User;
  Comments: Comment[];
  Tags: Tag[];
}
