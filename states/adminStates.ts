import { User } from 'firebase/auth';
import { atom } from 'recoil';

export const adminUser = atom<User | null>({
    key: 'adminUser',
    default: null,
});

export const isLoggedIn = atom({
    key: 'isLoggedIn',
    default: false,
});
