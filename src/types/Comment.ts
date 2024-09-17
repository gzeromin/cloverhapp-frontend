import { User } from './User';

export interface Comment {
  id: string;
  body: string;
  stampId: string;
  User: User;
  createdAt: string;
}
