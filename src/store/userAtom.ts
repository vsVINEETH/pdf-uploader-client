import { atomWithStorage } from 'jotai/utils';

export interface UserInfo {
    name: string;
    email: string;
    userId: string;
  }
  
  export const userAtom = atomWithStorage<{
    userId: string;
    name: string;
    email: string;
  } | null>('user', null);