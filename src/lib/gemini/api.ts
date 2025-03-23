// src/lib/gemini/api.ts
import { Debate, DebateStatus } from "@/types/Debate";
import { Argument, AIAnalysis, FactCheck } from "@/types/Argument";
import { User } from "@/types/User";
import { addAIAnalysis } from "@/lib/firebase/firestore";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const MODEL = 'gemini-2.0-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

async function callGeminiAPI(prompt: string): Promise<string> {
  try {
    if (!API_KEY) {
      console.warn('No Gemini API key found. Using mock response.');
      return mockGeminiResponse(prompt);
    }

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.candidates && 
        data.candidates[0] && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts[0] &&
        data.candidates[0].content.parts[0].text) {
      return data.candidates[0].content.parts[0].text;
    }
    
    throw new Error('Unexpected API response format');
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return mockGeminiResponse(prompt);
  }
}

function mockGeminiResponse(prompt: string): string {
  if (prompt.includes('analyze the following argument')) {
    return JSON.stringify({
      score: 7.5,
      analysis: "This argument presents several strong points and uses evidence effectively. The logical flow is clear, though some claims could benefit from additional support. Overall, the argument demonstrates a good understanding of the topic and presents a persuasive case.",
      factCheck: [
        {
          claim: "Example claim from the argument",
          verified: true,
          explanation: "This claim is generally accurate based on available data."
        }
      ],
      suggestedCounterpoints: [
        "Consider addressing alternative explanations for the evidence presented.",
        "The economic impact argument could be challenged with recent studies.",
        "There are ethical considerations not addressed in this argument."
      ]
    });
  } else if (prompt.includes('determine the winner')) {
    return JSON.stringify({
      winnerId: prompt.includes('creatorId') ? prompt.split('creatorId":"')[1].split('"')[0] : "user123",
      explanation: "After analyzing both participants' arguments, this debater demonstrated stronger reasoning, better evidence usage, and more effective rebuttals to opposing points. Their arguments were more logically consistent and grounded in factual information."
    });
  } else if (prompt.includes('suggest debate topics')) {
    return JSON.stringify([
      "Should artificial intelligence development be regulated by international law?",
      "Is universal basic income a viable solution to technological unemployment?",
      "Should social media platforms be legally responsible for content moderation?",
      "Is space exploration a worthwhile investment given Earth's current challenges?",
      "Should gene editing in humans be allowed for non-medical purposes?"
    ]);
  }
  
  return "Mock response for testing purposes. Please add your API key for actual functionality.";
}

export async function analyzeArgument(
  debate: Debate,
  argument: Argument,
  previousArguments: Argument[],
  creator: User,
  opponent: User
): Promise<AIAnalysis> {
  try {
    console.log("Analyzing argument:", argument.id);
    
    const previousArgsContext = previousArguments.map(arg => {
      const user = arg.userId === creator.id ? creator.username : opponent.username;
      const position = arg.userId === creator.id 
        ? (debate.creatorSide === 'affirmative' ? 'Affirmative' : 'Negative')
        : (debate.creatorSide === 'affirmative' ? 'Negative' : 'Affirmative');
      
      return `${user} (${position}, Round ${arg.round}): "${arg.content}"`;
    }).join('\n\n');
    
    const currentUser = argument.userId === creator.id ? creator : opponent;
    const position = argument.userId === creator.id 
      ? (debate.creatorSide === 'affirmative' ? 'Affirmative' : 'Negative')
      : (debate.creatorSide === 'affirmative' ? 'Negative' : 'Affirmative');
    
    const prompt = `
You are an expert debate judge and fact-checker. Please analyze the following argument from a debate.

DEBATE TOPIC: "${debate.topic}"
DEBATE DESCRIPTION: "${debate.description}"

${previousArgsContext ? `PREVIOUS ARGUMENTS:\n${previousArgsContext}\n\n` : ''}

CURRENT ARGUMENT TO ANALYZE:
${currentUser.username} (${position}, Round ${argument.round}): "${argument.content}"

Analyze this argument and provide:
1. A score from 1-10
2. A detailed analysis of the argument's strengths and weaknesses
3. Fact-checking for any claims made (identify 2-3 key claims and verify them)
4. 3 suggested counterpoints that the opponent could make

Return your analysis as a JSON object with the following format:
{
  "score": number,
  "analysis": "detailed analysis text",
  "factCheck": [
    {
      "claim": "quoted claim from the argument",
      "verified": boolean,
      "explanation": "explanation of verification or issues"
    }
  ],
  "suggestedCounterpoints": [
    "counterpoint 1",
    "counterpoint 2",
    "counterpoint 3"
  ]
}
`;

    const responseText = await callGeminiAPI(prompt);
    
    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse Gemini API response as JSON:", e);
      console.log("Raw response:", responseText);
      parsed = {
        score: 7.0,
        analysis: "The system was unable to generate a detailed analysis. This is a fallback analysis.",
        factCheck: [],
        suggestedCounterpoints: []
      };
    }
    
    const analysis: AIAnalysis = {
      id: `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`, // Add temporary ID
      argumentId: argument.id,
      userId: argument.userId,  // Include userId to match your existing implementation
      round: argument.round,    // Include round to match your existing implementation
      debateId: debate.id,
      score: parsed.score || 7.0,
      content: parsed.analysis || "No analysis provided", // Note: using 'analysis' from the response
      factCheck: parsed.factCheck || [],
      suggestedCounterpoints: parsed.suggestedCounterpoints || [],
      createdAt: Date.now()
    };
    
    try {
      await addAIAnalysis(analysis);
    } catch (error) {
      console.error("Error saving analysis to Firestore:", error);
    }
    
    return analysis;
  } catch (error) {
    console.error("Error in analyzeArgument:", error);
    
    const fallbackAnalysis: AIAnalysis = {
      id: `fallback_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      argumentId: argument.id,
      userId: argument.userId,
      round: argument.round, 
      debateId: debate.id,
      score: 5.0,
      content: "The system encountered an error analyzing this argument. This is a fallback analysis.",
      factCheck: [],
      suggestedCounterpoints: [],
      createdAt: Date.now()
    };
    
    try {
      await addAIAnalysis(fallbackAnalysis);
    } catch (saveError) {
      console.error("Error saving fallback analysis:", saveError);
    }
    
    return fallbackAnalysis;
  }
}

export async function determineDebateWinner(
  debate: Debate,
  debateArguments: Argument[],
  analyses: AIAnalysis[],
  creator: User,
  opponent: User
): Promise<{ winnerId: string; explanation: string }> {
  try {
    console.log("Determining debate winner for:", debate.id);
    
    if (debate.forfeitedBy) {
      const winnerId = debate.forfeitedBy === creator.id ? opponent.id : creator.id;
      return {
        winnerId,
        explanation: `${debate.forfeitedBy === creator.id ? creator.username : opponent.username} forfeited the debate.`
      };
    }
    
    const creatorArgs = debateArguments.filter(arg => arg.userId === creator.id);
    const opponentArgs = debateArguments.filter(arg => arg.userId === opponent.id);
    
    const creatorScores = analyses
      .filter(analysis => creatorArgs.some(arg => arg.id === analysis.argumentId))
      .map(analysis => analysis.score);
    
    const opponentScores = analyses
      .filter(analysis => opponentArgs.some(arg => arg.id === analysis.argumentId))
      .map(analysis => analysis.score);
    
    const creatorAvgScore = creatorScores.length > 0
      ? creatorScores.reduce((sum, score) => sum + score, 0) / creatorScores.length
      : 0;
    
    const opponentAvgScore = opponentScores.length > 0
      ? opponentScores.reduce((sum, score) => sum + score, 0) / opponentScores.length
      : 0;
    
    const formattedArgs = debateArguments
      .sort((a, b) => a.round - b.round || a.createdAt - b.createdAt)
      .map(arg => {
        const user = arg.userId === creator.id ? creator.username : opponent.username;
        const position = arg.userId === creator.id 
          ? (debate.creatorSide === 'affirmative' ? 'Affirmative' : 'Negative')
          : (debate.creatorSide === 'affirmative' ? 'Negative' : 'Affirmative');
        
        return `${user} (${position}, Round ${arg.round}): "${arg.content}"`;
      }).join('\n\n');
    
    const prompt = `
You are an expert debate judge. Please determine the winner of the following debate.

DEBATE TOPIC: "${debate.topic}"
DEBATE DESCRIPTION: "${debate.description}"

DEBATERS:
1. ${creator.username} (${debate.creatorSide === 'affirmative' ? 'Affirmative' : 'Negative'})
2. ${opponent.username} (${debate.creatorSide === 'affirmative' ? 'Negative' : 'Affirmative'})

ARGUMENTS:
${formattedArgs}

AVERAGE SCORES:
${creator.username}: ${creatorAvgScore.toFixed(2)}/10
${opponent.username}: ${opponentAvgScore.toFixed(2)}/10

Based on the arguments, determine which debater presented the stronger case overall.
Consider:
- Quality of reasoning and evidence
- Effectiveness in addressing opponent's points
- Clarity and persuasiveness
- Adherence to logical principles

Return your decision as a JSON object with the following format:
{
  "winnerId": "${creator.id}" or "${opponent.id}",
  "explanation": "detailed explanation of why this debater won"
}

Note: The winnerId must be EXACTLY one of the two provided IDs, not the username.
`;

    const responseText = await callGeminiAPI(prompt);
    
    let decisionData;
    try {
      decisionData = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse Gemini API response as JSON:", e);
      console.log("Raw response:", responseText);
      
      const winnerId = creatorAvgScore >= opponentAvgScore ? creator.id : opponent.id;
      return {
        winnerId,
        explanation: `Based on average argument scores, ${winnerId === creator.id ? creator.username : opponent.username} performed better.`
      };
    }
    
    if (decisionData.winnerId !== creator.id && decisionData.winnerId !== opponent.id) {
      console.error("Invalid winnerId returned by API:", decisionData.winnerId);
      decisionData.winnerId = creatorAvgScore >= opponentAvgScore ? creator.id : opponent.id;
    }
    
    return {
      winnerId: decisionData.winnerId,
      explanation: decisionData.explanation || `${decisionData.winnerId === creator.id ? creator.username : opponent.username} presented the stronger case.`
    };
  } catch (error) {
    console.error("Error in determineDebateWinner:", error);
    
    const creatorArgs = debateArguments.filter(arg => arg.userId === creator.id);
    const opponentArgs = debateArguments.filter(arg => arg.userId === opponent.id);
    
    const creatorScores = analyses
      .filter(analysis => creatorArgs.some(arg => arg.id === analysis.argumentId))
      .map(analysis => analysis.score);
    
    const opponentScores = analyses
      .filter(analysis => opponentArgs.some(arg => arg.id === analysis.argumentId))
      .map(analysis => analysis.score);
    
    const creatorAvgScore = creatorScores.length > 0
      ? creatorScores.reduce((sum, score) => sum + score, 0) / creatorScores.length
      : 0;
    
    const opponentAvgScore = opponentScores.length > 0
      ? opponentScores.reduce((sum, score) => sum + score, 0) / opponentScores.length
      : 0;
    
    const winnerId = creatorAvgScore >= opponentAvgScore ? creator.id : opponent.id;
    
    return {
      winnerId,
      explanation: `The system encountered an error determining the debate winner. ${winnerId === creator.id ? creator.username : opponent.username} is declared the winner based on average argument scores.`
    };
  }
}

export async function suggestDebateTopics(count = 5): Promise<string[]> {
  try {
    console.log("Suggesting debate topics");
    
    const prompt = `
Suggest ${count} interesting, balanced, and engaging debate topics that would work well for a structured debate platform.

The topics should:
- Be balanced (people could reasonably argue either side)
- Be engaging and thought-provoking
- Cover a variety of domains (technology, ethics, society, etc.)
- Be specific enough to debate effectively
- Avoid extremely divisive political topics

Return your suggestions as a JSON array of strings, like:
["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"]
`;

    const responseText = await callGeminiAPI(prompt);
    
    let topicsData;
    try {
      topicsData = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse Gemini API response as JSON:", e);
      console.log("Raw response:", responseText);
      
      return [
        "Should artificial intelligence development be regulated?",
        "Is universal basic income a viable economic policy?",
        "Should genetic engineering in humans be permitted?",
        "Is space exploration a worthwhile investment?",
        "Should social media platforms be responsible for content moderation?"
      ];
    }
    
    if (!Array.isArray(topicsData)) {
      console.error("API did not return an array:", topicsData);
      topicsData = [];
    }
    
    return topicsData.slice(0, count);
  } catch (error) {
    console.error("Error in suggestDebateTopics:", error);
    
    return [
      "Should artificial intelligence development be regulated?",
      "Is universal basic income a viable economic policy?",
      "Should genetic engineering in humans be permitted?",
      "Is space exploration a worthwhile investment?",
      "Should social media platforms be responsible for content moderation?"
    ];
  }
}