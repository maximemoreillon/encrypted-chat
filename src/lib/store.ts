import type { User } from "firebase/auth";
import { writable } from "svelte/store";
import type { DocumentData } from "firebase/firestore";

export const currentUser = writable<User | null>();

// TODO: not nereded here anymore
export const chats = writable<DocumentData[]>([]);
