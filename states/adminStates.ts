import { User } from 'firebase/auth';
import { atom } from 'jotai';

export const adminUser = atom<User | null>(null);

export const isLoggedIn = atom(false);
