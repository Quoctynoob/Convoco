// src/hooks/useGemini.ts
"use client";

import { useState } from "react";
import {
  analyzeArgument,
  determineDebateWinner,
  suggestDebateTopics,
} from "@/lib/gemini/api";
import { Debate } from "@/types/Debate";
import { Argument, AIAnalysis } from "@/types/Argument";
import { User } from "@/types/User";

export const useGemini = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeDebateArgument = async (
    debate: Debate,
    argument: Argument,
    previousArguments: Argument[],
    creator: User,
    opponent: User
  ): Promise<AIAnalysis | null> => {
    setLoading(true);
    setError(null);

    try {
      const analysis = await analyzeArgument(
        debate,
        argument,
        previousArguments,
        creator,
        opponent
      );

      return analysis;
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Unknown error analyzing argument";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const determineWinner = async (
    debate: Debate,
    arguments: Argument[],
    analyses: AIAnalysis[],
    creator: User,
    opponent: User
  ): Promise<{ winnerId: string; explanation: string } | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await determineDebateWinner(
        debate,
        arguments,
        analyses,
        creator,
        opponent
      );

      return result;
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Unknown error determining winner";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getSuggestedTopics = async (): Promise<string[]> => {
    setLoading(true);
    setError(null);

    try {
      const topics = await suggestDebateTopics();
      return topics;
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Unknown error fetching topics";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    analyzeDebateArgument,
    determineWinner,
    getSuggestedTopics,
    loading,
    error,
  };
};
