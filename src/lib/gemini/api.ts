import { model } from './client';
import { Debate } from '@/types/Debate';
import { Argument, AIAnalysis } from '@/types/Argument';
import { User } from '@/types/User';
import { saveArgumentAnalysis } from '@/lib/firebase/firestore';

// Helper to truncate text for token savings
const truncateText = (text: string, maxLength: number = 500): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Analyze a debate argument with minimal token usage
export const analyzeArgument = async (
  debate: Debate,
  argument: Argument,
  previousArguments: Argument[],
  creator: User,
  opponent: User
): Promise<AIAnalysis> => {
  try {
    // Only use most recent previous argument to save tokens
    const lastArgument = previousArguments.length > 0
      ? previousArguments[previousArguments.length - 1]
      : null;
    
    // Highly condensed prompt
    const prompt = `
Debate analysis task:
TOPIC: ${debate.topic}
SIDE: ${argument.userId === creator.id ? creator.username : opponent.username} (${argument.side === 'creator' ? debate.creatorSide : (debate.creatorSide === 'affirmative' ? 'negative' : 'affirmative')})
ROUND: ${argument.round}/${debate.rounds}

ARGUMENT:
${truncateText(argument.content, 800)}

${lastArgument ? `PREVIOUS ARGUMENT:
${truncateText(lastArgument.content, 300)}` : ''}

Return JSON only:
{"score":(1-10),"content":"brief analysis","factCheck":[{"claim":"claim text","verified":true/false,"explanation":"why"}],"suggestedCounterpoints":["point1","point2"]}`;

    // Call Gemini API
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Safe parsing with fallback
    let analysisData;
    try {
      analysisData = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse Gemini response:", e);
      analysisData = {
        score: 5,
        content: "Analysis unavailable due to processing error.",
        factCheck: [],
        suggestedCounterpoints: ["Address the main points more directly"]
      };
    }
    
    // Create analysis object with all required properties
    const analysis: Omit<AIAnalysis, 'id'> = {
      argumentId: argument.id,
      debateId: debate.id,  // Add missing debateId
      createdAt: Date.now(), // Add missing createdAt
      score: analysisData.score || 5,
      content: analysisData.content || "No analysis provided",
      factCheck: analysisData.factCheck || [],
      suggestedCounterpoints: analysisData.suggestedCounterpoints || []
    };
    
    // Save to Firebase
    const analysisId = await saveArgumentAnalysis(analysis);
    return { ...analysis, id: analysisId };
    
  } catch (error) {
    console.error("Error analyzing argument:", error);
    // Fallback if API fails - with all required properties
    const fallbackAnalysis: Omit<AIAnalysis, 'id'> = {
      argumentId: argument.id,
      debateId: debate.id,  // Add missing debateId
      createdAt: Date.now(), // Add missing createdAt
      score: 5,
      content: "Unable to analyze this argument due to a technical issue.",
      factCheck: [],
      suggestedCounterpoints: []
    };
    
    try {
      const analysisId = await saveArgumentAnalysis(fallbackAnalysis);
      return { ...fallbackAnalysis, id: analysisId };
    } catch (e) {
      return { ...fallbackAnalysis, id: 'error' };
    }
  }
};

// Determine winner with minimal token usage
export const determineDebateWinner = async (
  debate: Debate,
  debateArguments: Argument[],
  analyses: AIAnalysis[],
  creator: User,
  opponent: User
): Promise<{ winnerId: string; explanation: string }> => {
  try {
    // Get average scores to reduce token needs
    const creatorArgs = debateArguments.filter(arg => arg.userId === creator.id);
    const opponentArgs = debateArguments.filter(arg => arg.userId === opponent.id);
    
    const creatorScores = analyses
      .filter(a => creatorArgs.some(arg => arg.id === a.argumentId))
      .map(a => a.score);
    const opponentScores = analyses
      .filter(a => opponentArgs.some(arg => arg.id === a.argumentId))
      .map(a => a.score);
    
    const avgCreatorScore = creatorScores.length > 0
      ? creatorScores.reduce((acc, val) => acc + val, 0) / creatorScores.length
      : 0;
    const avgOpponentScore = opponentScores.length > 0
      ? opponentScores.reduce((acc, val) => acc + val, 0) / opponentScores.length
      : 0;

    // Ultra-minimal prompt
    const prompt = `
Debate winner determination:
TOPIC: ${debate.topic}
PARTICIPANTS:
- ${creator.username} (${debate.creatorSide}): Score ${avgCreatorScore.toFixed(1)}/10
- ${opponent.username} (${debate.creatorSide === 'affirmative' ? 'negative' : 'affirmative'}): Score ${avgOpponentScore.toFixed(1)}/10

${creatorArgs.length > 0 ? `${creator.username}'s main point: ${truncateText(creatorArgs[creatorArgs.length-1].content, 100)}` : ''}
${opponentArgs.length > 0 ? `${opponent.username}'s main point: ${truncateText(opponentArgs[opponentArgs.length-1].content, 100)}` : ''}

Return JSON only:
{"winnerId":"${creator.id}" or "${opponent.id}","explanation":"brief reason"}`;

    // Call Gemini API
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse JSON response safely
    let winnerData;
    try {
      winnerData = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse Gemini winner response:", e);
      // Fallback based on scores
      const winnerId = avgCreatorScore >= avgOpponentScore ? creator.id : opponent.id;
      return {
        winnerId,
        explanation: `${winnerId === creator.id ? creator.username : opponent.username} had stronger arguments overall.`
      };
    }
    
    // Validate winner ID
    if (winnerData.winnerId !== creator.id && winnerData.winnerId !== opponent.id) {
      console.error("Invalid winnerId returned:", winnerData.winnerId);
      return {
        winnerId: avgCreatorScore >= avgOpponentScore ? creator.id : opponent.id,
        explanation: winnerData.explanation || "Winner determined based on argument quality."
      };
    }
    
    return {
      winnerId: winnerData.winnerId,
      explanation: winnerData.explanation || "Winner determined based on argument quality."
    };
    
  } catch (error) {
    console.error("Error determining winner:", error);
    // Simple score-based fallback
    const creatorArgs = debateArguments.filter(arg => arg.userId === creator.id);
    const opponentArgs = debateArguments.filter(arg => arg.userId === opponent.id);
    
    const creatorScores = analyses
      .filter(a => creatorArgs.some(arg => arg.id === a.argumentId))
      .map(a => a.score);
    const opponentScores = analyses
      .filter(a => opponentArgs.some(arg => arg.id === a.argumentId))
      .map(a => a.score);
    
    const avgCreatorScore = creatorScores.length > 0
      ? creatorScores.reduce((acc, val) => acc + val, 0) / creatorScores.length
      : 0;
    const avgOpponentScore = opponentScores.length > 0
      ? opponentScores.reduce((acc, val) => acc + val, 0) / opponentScores.length
      : 0;
    
    const winnerId = avgCreatorScore >= avgOpponentScore ? creator.id : opponent.id;
    return {
      winnerId,
      explanation: `${winnerId === creator.id ? creator.username : opponent.username} had stronger arguments based on AI scoring.`
    };
  }
};