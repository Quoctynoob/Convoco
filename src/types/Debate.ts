// src/types/Debate.ts
import { Argument, AIAnalysis } from "./Argument";

export enum DebateStatus {
  PENDING = "pending", // Waiting for opponent
  ACTIVE = "active", // Debate in progress
  COMPLETED = "completed", // Debate finished with result
  ABANDONED = "abandoned", // Debate abandoned
}

export interface Debate {
  id: string;
  topic: string;
  description: string;
  creatorId: string;
  creatorSide: "affirmative" | "negative"; // New field to track which side the creator chose
  opponentId?: string;
  status: DebateStatus;
  currentTurn?: string; // User ID of whose turn it is
  winner?: string; // User ID of the winner
  rounds: number; // Total number of rounds
  currentRound: number; // Current round number
  arguments: Argument[]; // List of arguments made
  aiAnalysis: AIAnalysis[]; // AI analysis for each argument
  createdAt: number;
  updatedAt: number;
}