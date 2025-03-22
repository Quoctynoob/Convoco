// src/lib/gemini/api.ts
import { AIAnalysis, Argument } from "@/types/Argument";
import { parseAnalysisResponse, parseWinnerResponse } from "./analysis";
import { generateAnalysisPrompt, generateWinnerPrompt } from "./prompt";
import { Debate } from "@/types/Debate";
import { User } from "@/types/User";

// This is a placeholder API key for development; you should use an environment variable
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "dummy-key";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

export const analyzeArgument = async (
  debate: Debate,
  argument: Argument,
  previousArguments: Argument[],
  creator: User,
  opponent: User
): Promise<AIAnalysis> => {
  try {
    // Generate the prompt for analysis
    const prompt = generateAnalysisPrompt(
      debate,
      argument,
      previousArguments,
      creator,
      opponent
    );

    // PLACEHOLDER IMPLEMENTATION - Replace with actual Gemini API call when ready
    // This will return a mock response during development and build
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "dummy-key") {
      console.log("Using mock Gemini analysis (API key not provided)");
      return {
        id: `mock_${Date.now()}`,
        argumentId: argument.id,
        userId: argument.userId,
        round: argument.round,
        content: "This is a mock analysis generated during development. Add your Gemini API key to get real analyses.",
        factCheck: [
          {
            claim: "Example claim from the argument",
            verified: true,
            explanation: "This is a mock verification."
          }
        ],
        score: 7,
        suggestedCounterpoints: [
          "This is a mock counterpoint.",
          "Another mock counterpoint."
        ],
        createdAt: Date.now()
      };
    }

    // Real implementation with API call
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data: GeminiResponse = await response.json();
    const analysisText = data.candidates[0].content.parts[0].text;
    
    // Parse the structured response
    return parseAnalysisResponse(analysisText, argument);
  } catch (error) {
    console.error("Error analyzing argument with Gemini:", error);
    
    // Fallback analysis in case of error
    return {
      id: `error_${Date.now()}`,
      argumentId: argument.id,
      userId: argument.userId,
      round: argument.round,
      content: "We couldn't analyze this argument due to a technical issue.",
      factCheck: [],
      score: 5,
      createdAt: Date.now(),
    };
  }
};

export const determineDebateWinner = async (
  debate: Debate,
  debateArguments: Argument[],
  analyses: AIAnalysis[],
  creator: User,
  opponent: User
): Promise<{ winnerId: string; explanation: string }> => {
  try {
    // Generate the prompt for winner determination
    const prompt = generateWinnerPrompt(
      debate,
      debateArguments,
      analyses,
      creator,
      opponent
    );

    // PLACEHOLDER IMPLEMENTATION - Replace with actual Gemini API call when ready
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "dummy-key") {
      console.log("Using mock Gemini winner determination (API key not provided)");
      // Randomly select winner during development
      const randomWinner = Math.random() > 0.5 ? creator.id : opponent.id;
      return {
        winnerId: randomWinner,
        explanation: "This is a mock winner determination. Add your Gemini API key to get real results."
      };
    }

    // Real implementation with API call
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data: GeminiResponse = await response.json();
    const result = data.candidates[0].content.parts[0].text;
    
    // Parse the winner determination
    return parseWinnerResponse(result, creator.id, opponent.id);
  } catch (error) {
    console.error("Error determining winner with Gemini:", error);
    
    // Default to creator as winner in case of error
    return {
      winnerId: creator.id,
      explanation:
        "Due to a technical issue, we couldn't determine the winner. The debate creator has been assigned as the winner by default.",
    };
  }
};

export const suggestDebateTopics = async (): Promise<string[]> => {
  try {
    // PLACEHOLDER IMPLEMENTATION - Replace with actual Gemini API call when ready
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "dummy-key") {
      console.log("Using mock debate topics (API key not provided)");
      return [
        "Should artificial intelligence be regulated more strictly?",
        "Is universal basic income a viable economic policy?",
        "Should social media platforms be responsible for content moderation?",
        "Is space exploration a worthwhile investment of resources?",
        "Should voting be mandatory in democratic countries?",
      ];
    }

    const prompt =
      "Suggest 5 interesting debate topics that would generate thoughtful discussion. Provide the topics only, no explanations.";
      
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }
    
    const data: GeminiResponse = await response.json();
    const topicsText = data.candidates[0].content.parts[0].text;
    
    // Parse the topics list
    const topics = topicsText
      .split("\n")
      .map((line) => line.replace(/^[0-9\.\-\*]+\s*/, "").trim())
      .filter((topic) => topic.length > 0);
      
    return topics.slice(0, 5);
  } catch (error) {
    console.error("Error suggesting topics with Gemini:", error);
    
    // Fallback topics in case of error
    return [
      "Should artificial intelligence be regulated more strictly?",
      "Is universal basic income a viable economic policy?",
      "Should social media platforms be responsible for content moderation?",
      "Is space exploration a worthwhile investment of resources?",
      "Should voting be mandatory in democratic countries?",
    ];
  }
};