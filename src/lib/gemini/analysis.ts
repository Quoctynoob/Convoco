// src/lib/gemini/analysis.ts
import { AIAnalysis, Argument, FactCheck } from "@/types/Argument";

interface AnalysisResponse {
  analysis: string;
  factCheck: {
    claim: string;
    verified: boolean;
    explanation: string;
  }[];
  score: number;
  suggestedCounterpoints: string[];
}

interface WinnerResponse {
  winnerId: string;
  explanation: string;
}

export const parseAnalysisResponse = (
  responseText: string,
  argument: Argument
): AIAnalysis => {
  try {
    // Extract JSON from the response (in case there's any wrapping text)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const jsonStr = jsonMatch[0];
    const parsed: AnalysisResponse = JSON.parse(jsonStr);

    return {
      argumentId: argument.id,
      userId: argument.userId,
      round: argument.round,
      content: parsed.analysis,
      factCheck: parsed.factCheck || [],
      score: parsed.score || 5,
      suggestedCounterpoints: parsed.suggestedCounterpoints || [],
      createdAt: Date.now(),
    };
  } catch (error) {
    console.error("Error parsing analysis response:", error);
    console.log("Raw response:", responseText);

    // Fallback analysis
    return {
      argumentId: argument.id,
      userId: argument.userId,
      round: argument.round,
      content: "We couldn't properly parse the AI analysis response.",
      factCheck: [],
      score: 5,
      createdAt: Date.now(),
    };
  }
};

export const parseWinnerResponse = (
  responseText: string,
  creatorId: string,
  opponentId: string
): { winnerId: string; explanation: string } => {
  try {
    // Extract JSON from the response (in case there's any wrapping text)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const jsonStr = jsonMatch[0];
    const parsed: WinnerResponse = JSON.parse(jsonStr);

    // Validate winner ID
    if (parsed.winnerId !== creatorId && parsed.winnerId !== opponentId) {
      throw new Error("Invalid winner ID");
    }

    return {
      winnerId: parsed.winnerId,
      explanation: parsed.explanation,
    };
  } catch (error) {
    console.error("Error parsing winner response:", error);
    console.log("Raw response:", responseText);

    // Fallback to creator as winner
    return {
      winnerId: creatorId,
      explanation:
        "Due to an error in determining the winner, the debate creator has been assigned as the winner by default.",
    };
  }
};
