// src/hooks/useGemini.ts
"use client";

import { useState } from "react";
import {
  analyzeArgument,
  determineDebateWinner
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
    debateArguments: Argument[],
    analyses: AIAnalysis[],
    creator: User,
    opponent: User
  ): Promise<{ winnerId: string; explanation: string } | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await determineDebateWinner(
        debate,
        debateArguments,
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

  // Removed getSuggestedTopics function

  return {
    analyzeDebateArgument,
    determineWinner,
    loading,
    error,
  };
};