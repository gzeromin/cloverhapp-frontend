import { User } from './User';

export interface Notif {
  id: string;
  senderId: string;
  receiverId: string;
  type: NotificationType;
  property1: string;
  property2: string;
  property3: string;
  Sender: User;
  Receiver: User;
}

export enum NotificationType {
  REQUEST_FRIEND = 'REQUEST_FRIEND',
  CHANGE_ALIAS = 'CHANGE_ALIAS',
  STAMPED_ME = 'STAMPED_ME',
}
