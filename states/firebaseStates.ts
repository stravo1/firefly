import { Auth } from "firebase/auth";
import { Database } from "firebase/database";
import { atom } from "jotai";

export const authApp = atom<Auth | null>(null);
export const databaseApp = atom<Database | null>(null);