import { Icon } from './Icon';
import { StampStatus } from './Stamp';
import { User } from './User';

export interface UserIcon {
  id: string;
  Icon: Icon;
  Friend: User;
  alias: string;
  memo: string;
  status: StampStatus;
  isDisplay: number;
}
