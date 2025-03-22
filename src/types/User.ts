// src/types/User.ts
export interface UserStats {
  wins: number;
  losses: number;
  totalDebates: number;
  points?: number; // Optional for backward compatibility
}

export interface User {
  id: string;
  username: string;
  email: string;
  photoURL: string | null;
  createdAt: number;
  updatedAt: number;
  gender: string;
  location: string;
  bio: string;
  debateTopics: string[];
  stats: UserStats;
}