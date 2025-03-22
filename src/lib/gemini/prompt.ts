// src/lib/gemini/prompt.ts
import { Argument, AIAnalysis } from "@/types/Argument";
import { Debate } from "@/types/Debate";
import { User } from "@/types/User";

export const generateAnalysisPrompt = (
  debate: Debate,
  currentArgument: Argument,
  previousArguments: Argument[],
  creator: User,
  opponent: User
): string => {
  return `
You are an AI debate moderator for a structured debate on the topic: "${
    debate.topic
  }".
Current round: ${currentArgument.round} of ${debate.rounds}
Current speaker: ${
    currentArgument.userId === creator.id ? creator.username : opponent.username
  } (${currentArgument.side})
Their argument:
"${currentArgument.content}"
${
  previousArguments.length > 0
    ? `
Previous arguments:
${previousArguments
  .map(
    (arg) =>
      `[Round ${arg.round}] ${
        arg.userId === creator.id ? creator.username : opponent.username
      } (${arg.side}): "${arg.content}"`
  )
  .join("\n")}
`
    : "This is the first argument in the debate."
}
Please analyze this argument objectively. Respond in JSON format with the following structure:
{
  "analysis": "Your detailed analysis of the argument's strengths and weaknesses",
  "factCheck": [
    {
      "claim": "A specific claim made in the argument",
      "verified": true/false,
      "explanation": "Explanation of the factual accuracy"
    }
  ],
  "score": 5, // A score from 1-10 based on logic, evidence, and persuasiveness
  "suggestedCounterpoints": [
    "A potential counterpoint the opponent could make",
    "Another potential counterpoint"
  ]
}
Be fair and objective in your analysis. Focus on the quality of argumentation rather than your personal views on the topic.
`;
};

export const generateWinnerPrompt = (
  debate: Debate,
  debateArguments: Argument[],
  analyses: AIAnalysis[],
  creator: User,
  opponent: User
): string => {
  const creatorArguments = debateArguments.filter(
    (arg) => arg.userId === creator.id
  );
  const opponentArguments = debateArguments.filter(
    (arg) => arg.userId === opponent.id
  );
  const creatorScores = analyses
    .filter((analysis) =>
      creatorArguments.some((arg) => arg.id === analysis.argumentId)
    )
    .map((analysis) => analysis.score);
  const opponentScores = analyses
    .filter((analysis) =>
      opponentArguments.some((arg) => arg.id === analysis.argumentId)
    )
    .map((analysis) => analysis.score);
  const creatorAvgScore =
    creatorScores.length > 0
      ? creatorScores.reduce((sum, score) => sum + score, 0) /
        creatorScores.length
      : 0;
  const opponentAvgScore =
    opponentScores.length > 0
      ? opponentScores.reduce((sum, score) => sum + score, 0) /
        opponentScores.length
      : 0;
  return `
You are an AI judge for a structured debate on the topic: "${debate.topic}".
Debate participants:
- Creator: ${creator.username} (average score: ${creatorAvgScore.toFixed(2)})
- Opponent: ${opponent.username} (average score: ${opponentAvgScore.toFixed(2)})
The debate consisted of ${
    debate.rounds
  } rounds. Here's a summary of the arguments and analyses:
${debateArguments
  .map((arg) => {
    const speaker =
      arg.userId === creator.id ? creator.username : opponent.username;
    const side = arg.side;
    const analysis = analyses.find((a) => a.argumentId === arg.id);
    return `
[Round ${arg.round}] ${speaker} (${side}):
Argument: "${arg.content}"
Analysis: "${analysis?.content || "No analysis available"}"
Score: ${analysis?.score || "N/A"}
`;
  })
  .join("\n")}
Based on the quality of arguments, evidence provided, logical reasoning, and overall persuasiveness, determine who won this debate.
Respond in JSON format with the following structure:
{
  "winnerId": "${creator.id}" or "${opponent.id}",
  "explanation": "A detailed explanation of why this participant won the debate"
}
Be fair and objective in your judgment. Focus on the quality of argumentation rather than your personal views on the topic.
`;
};
