import { UserStamp } from './UserStamp';

export interface User {
  id: string;
  nickname: string;
  email: string;
  locale: Locale;
  photoUrl?: string;
  droplet: number;
  notifNum: number;
  UserStamp: UserStamp[];
}

export enum Locale {
  Kr = 'KR',
  En = 'EN',
  Jp = 'JP',
}
