// src/types/User.ts
export interface User {
  id: string;
  username: string;
  email: string;
  photoURL?: string;
  bio?: string;
  debateTopics?: string[]; // Topics the user wants to debate
  stats: {
    wins: number;
    losses: number;
    totalDebates: number;
  };
  createdAt: number;
  updatedAt: number;
}
