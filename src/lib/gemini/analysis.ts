// src/lib/gemini/analysis.ts
import { User } from "@/types/User";
import { AIAnalysis, Argument, FactCheck } from "@/types/Argument";
import { Debate } from "@/types/Debate";

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

function parseAnalysisResponse(response: any, argument: Argument): AIAnalysis {
  try {
    // Attempt to parse the response as JSON if it's a string
    const parsed = typeof response === 'string' ? JSON.parse(response) : response;
    
    return {
      id: `analysis_${Date.now()}`,
      argumentId: argument.id,
      debateId: argument.debateId, // Add this line to fix error
      userId: argument.userId,
      round: argument.round,
      content: parsed.analysis || parsed.content || "No analysis provided",
      factCheck: parsed.factCheck || [],
      score: parsed.score || 5.0,
      suggestedCounterpoints: parsed.suggestedCounterpoints || [],
      createdAt: Date.now()
    };
  } catch (error) {
    console.error("Error parsing analysis response:", error);
    
    // Return a fallback analysis
    return {
      id: `fallback_${Date.now()}`,
      argumentId: argument.id,
      debateId: argument.debateId, // Add this line to fix error
      userId: argument.userId,
      round: argument.round,
      content: "Failed to parse analysis response",
      factCheck: [],
      score: 5.0,
      createdAt: Date.now()
    };
  }
}

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

export async function analyzeArgument(
  debate: Debate,
  argument: Argument
): Promise<AIAnalysis> {
  try {
    // This is a simplified implementation without actual AI
    // In a real implementation, this would call an AI API
    console.log("Analyzing argument:", argument.id);
    
    // Create a mock analysis
    const mockAnalysis: AIAnalysis = {
      id: `analysis_${Date.now()}`,
      argumentId: argument.id,
      debateId: argument.debateId, // Make sure to include the debateId from the argument
      userId: argument.userId,
      round: argument.round,
      score: 7.5, // Mock score between 1-10
      content: "This is a mock analysis of the argument. In a real implementation, this would be AI-generated content analyzing the quality of the argument.",
      factCheck: [
        {
          claim: "Example claim from the argument",
          verified: true,
          explanation: "This is a mock fact-check. In a real implementation, this would verify claims made in the argument."
        }
      ],
      suggestedCounterpoints: [
        "This is a mock counterpoint suggestion.",
        "Another mock counterpoint suggestion.",
        "A third mock counterpoint suggestion."
      ],
      createdAt: Date.now()
    };
    
    return mockAnalysis;
  } catch (error) {
    console.error("Error analyzing argument:", error);
    
    // Return a fallback analysis in case of error
    return {
      id: `fallback_${Date.now()}`,
      argumentId: argument.id,
      debateId: argument.debateId, // Make sure to include the debateId from the argument
      userId: argument.userId,
      round: argument.round,
      score: 5.0,
      content: "Failed to generate analysis for this argument.",
      factCheck: [],
      suggestedCounterpoints: [],
      createdAt: Date.now()
    };
  }
}

export function determineDebateWinner(
  debate: Debate,
  debateArguments: Argument[],
  analyses: AIAnalysis[]
): { winnerId: string; explanation: string } {
  try {
    // Calculate scores
    const creatorArgs = debateArguments.filter(arg => arg.userId === debate.creatorId);
    const opponentArgs = debateArguments.filter(arg => arg.userId === debate.opponentId);
    
    const creatorAnalyses = analyses.filter(analysis => 
      creatorArgs.some(arg => arg.id === analysis.argumentId)
    );
    
    const opponentAnalyses = analyses.filter(analysis => 
      opponentArgs.some(arg => arg.id === analysis.argumentId)
    );
    
    const creatorAvgScore = creatorAnalyses.length > 0
      ? creatorAnalyses.reduce((sum, analysis) => sum + analysis.score, 0) / creatorAnalyses.length
      : 0;
      
    const opponentAvgScore = opponentAnalyses.length > 0
      ? opponentAnalyses.reduce((sum, analysis) => sum + analysis.score, 0) / opponentAnalyses.length
      : 0;
    
    // Ensure we have a valid creatorId to fall back on
    const fallbackId = debate.creatorId || "unknown-creator";
    
    // Ensure opponent ID is valid
    const opponentId = debate.opponentId || fallbackId;
    
    // Determine winner based on average scores
    // Use non-nullish operator to ensure we always have a string
    const winnerId = creatorAvgScore >= opponentAvgScore ? fallbackId : opponentId;
    
    return {
      winnerId: winnerId, // This is now guaranteed to be a string
      explanation: `Based on the overall quality of arguments, ${winnerId === debate.creatorId ? 'the creator' : 'the opponent'} presented a stronger case.`
    };
  } catch (error) {
    console.error("Error determining debate winner:", error);
    
    // Default to creator as winner in case of error
    // Make sure creator ID exists, or use a fallback
    const fallbackId = debate.creatorId || "unknown-creator";
    
    return {
      winnerId: fallbackId,
      explanation: "Due to an error in evaluation, the debate creator is declared the winner by default."
    };
  }
}