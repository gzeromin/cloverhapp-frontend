import { UserStamp } from './UserStamp';

export interface User {
  id: string;
  nickname: string;
  email: string;
  locale: Locale;
  photoUrl?: string;
  droplet: number;
  notifNum: number;
  keyValues: string[];
  sentence: string;
  UserStamp: UserStamp[];
}

export enum Locale {
  Kr = 'KR',
  En = 'EN',
  Jp = 'JP',
}
