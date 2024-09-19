import { Stamp } from './Stamp';
import { User } from './User';

export interface UserStamp{
  id: string;
  Stamp: Stamp;
  Friend: User;
  alias: string;
  memo: string;
  isDisplay: number;
}
