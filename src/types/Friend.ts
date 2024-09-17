import { User } from './User';

export interface Friend {
  id: string;
  friendId: string;
  userId: string;
  alias: string;
  Friend: User;
}
