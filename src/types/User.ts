import { UserIcon } from './UserIcon';

export interface User {
  id: string;
  nickname: string;
  email: string;
  locale: Locale;
  photoUrl?: string;
  droplet: number;
  notifNum: number;
  UserIcons: UserIcon[];
}

export enum Locale {
  En = 0,
  Kr = 1,
  Jp = 2,
}
