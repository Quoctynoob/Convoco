// src/types/User.ts
export interface User {
  id: string;
  username: string;
  email: string;
  photoURL: string;
  bio: string;
  gender?: string;
  location?: string;
  debateTopics: string[];
  stats: {
    wins: number;
    losses: number;
    totalDebates: number;
  };
  createdAt: number;
  updatedAt: number;
}