// src/components/debate/DebateResults.tsx
"use client";
import React from "react";
import { Debate } from "@/types/Debate";
import { Argument, AIAnalysis } from "@/types/Argument";
import { User } from "@/types/User";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

interface DebateResultsProps {
  debate: Debate;
  arguments: Argument[];
  analyses: AIAnalysis[];
  creator: User;
  opponent: User;
  winnerId: string;
  wasForfeit?: boolean;
}

export const DebateResults: React.FC<DebateResultsProps> = ({
  debate,
  arguments: debateArguments,
  analyses,
  creator,
  opponent,
  winnerId,
  wasForfeit = false,
}) => {
  const winner = winnerId === creator.id ? creator : opponent;
  const loser = winnerId === creator.id ? opponent : creator;
  const forfeitedBy = debate.forfeitedBy === creator.id ? creator : opponent;

  // Only calculate scores if there was no forfeit
  const calculateScores = !wasForfeit;
  let creatorAvgScore = 0;
  let opponentAvgScore = 0;

  if (calculateScores) {
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

    creatorAvgScore =
      creatorScores.length > 0
        ? creatorScores.reduce((sum, score) => sum + score, 0) /
          creatorScores.length
        : 0;

    opponentAvgScore =
      opponentScores.length > 0
        ? opponentScores.reduce((sum, score) => sum + score, 0) /
          opponentScores.length
        : 0;
  }

  return (
    <div className="space-y-6">
      <Card
        className={`${
          wasForfeit
            ? "bg-amber-50 border-amber-200"
            : "bg-blue-50 border-blue-200"
        }`}
      >
        <CardHeader>
          <CardTitle className="text-center">Debate Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4 mb-6">
            <div className="flex flex-col items-center gap-3">
              <div className="text-lg font-semibold">Winner:</div>
              <div className="flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-sm border border-gray-100">
                {winner.photoURL ? (
                  <img
                    src={winner.photoURL}
                    alt={winner.username}
                    className="h-12 w-12 rounded-full"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-xl">
                    {winner.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-xl">{winner.username}</h3>
                  <div className="text-sm text-gray-500">
                    {winnerId === creator.id ? "Creator" : "Opponent"}
                  </div>
                </div>
              </div>
            </div>
            {wasForfeit ? (
              <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-sm border border-amber-100">
                <h4 className="text-center font-medium mb-3 text-amber-700">
                  Forfeit Information
                </h4>
                <p className="text-center text-gray-700">
                  {forfeitedBy.username} forfeited this debate, automatically
                  awarding the win to {winner.username}.
                </p>
              </div>
            ) : (
              <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <h4 className="text-center font-medium mb-4 text-gray-700">
                  Score Summary
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <div className="font-medium">{creator.username}</div>
                    <div className="text-2xl font-bold">
                      {creatorAvgScore.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">Average Score</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-b from-green-50 to-green-100 rounded-lg border border-green-200">
                    <div className="font-medium">{opponent.username}</div>
                    <div className="text-2xl font-bold">
                      {opponentAvgScore.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">Average Score</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="prose prose-sm max-w-none bg-white p-5 rounded-lg shadow-sm border border-gray-100">
            <h4 className="text-lg font-medium mb-3">
              {wasForfeit ? "Forfeit Results" : "AI Judgment"}
            </h4>
            {wasForfeit ? (
              <>
                <p>
                  {forfeitedBy.username} has forfeited this debate on the topic:
                  <span className="font-medium"> {debate.topic}</span>.
                </p>
                <p>
                  According to the rules of the platform, forfeiting a debate
                  counts as a loss, and the win is automatically awarded to the
                  other participant.
                </p>
                <h4>Why Debates Can Be Forfeited</h4>
                <ul>
                  <li>Time constraints or personal circumstances</li>
                  <li>Inability to continue with the argumentation</li>
                  <li>Recognition of the opponent's stronger position</li>
                </ul>
                <p>
                  Regardless of the reason, we encourage participants to
                  complete their debates whenever possible, as the full exchange
                  of ideas benefits everyone involved.
                </p>
              </>
            ) : (
              <>
                <p>
                  After analyzing all arguments from both participants in this
                  timed debate, Gemini has determined that {winner.username}
                  presented stronger arguments with better reasoning and
                  evidence on the topic:
                  <span className="font-medium"> {debate.topic}</span>.
                </p>
                <h4>Key Factors</h4>
                <ul>
                  <li>Argument quality and logical coherence</li>
                  <li>Evidence presented and factual accuracy</li>
                  <li>Responsiveness to opponent's points</li>
                  <li>
                    Overall persuasiveness within the one-minute time
                    constraints
                  </li>
                  <li>Efficient use of the limited time to make key points</li>
                </ul>
                <p>
                  Both participants presented thoughtful arguments within the
                  timed format, but {winner.username}'s arguments were more
                  comprehensive and supported by stronger evidence, even with
                  the time constraints.
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
