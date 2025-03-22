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
}

export const DebateResults: React.FC<DebateResultsProps> = ({
  debate,
  arguments: debateArguments,
  analyses,
  creator,
  opponent,
  winnerId,
}) => {
  const winner = winnerId === creator.id ? creator : opponent;
  const loser = winnerId === creator.id ? opponent : creator;

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

  return (
    <div className="space-y-6">
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-center">Debate Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4 mb-6">
            <div className="flex items-center justify-center gap-3">
              <div className="text-lg font-semibold">Winner:</div>
              <div className="flex items-center gap-2">
                {winner.photoURL ? (
                  <img
                    src={winner.photoURL}
                    alt={winner.username}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">
                    {winner.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-xl">{winner.username}</h3>
                  <div className="text-sm">
                    {winnerId === creator.id ? "Creator" : "Opponent"}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-sm">
              <h4 className="text-center font-medium mb-2">Score Summary</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-2 bg-blue-100 rounded">
                  <div className="font-medium">{creator.username}</div>
                  <div className="text-2xl font-bold">
                    {creatorAvgScore.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">Average Score</div>
                </div>
                <div className="text-center p-2 bg-green-100 rounded">
                  <div className="font-medium">{opponent.username}</div>
                  <div className="text-2xl font-bold">
                    {opponentAvgScore.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">Average Score</div>
                </div>
              </div>
            </div>
          </div>

          <div className="prose prose-sm max-w-none">
            <h4>AI Judgment</h4>
            <p>
              After analyzing all arguments from both participants, Gemini has
              determined that {winner.username}
              presented stronger arguments with better reasoning and evidence on
              the topic:
              <span className="font-medium"> {debate.topic}</span>.
            </p>

            <h4>Key Factors</h4>
            <ul>
              <li>Argument quality and logical coherence</li>
              <li>Evidence presented and factual accuracy</li>
              <li>Responsiveness to opponent's points</li>
              <li>Overall persuasiveness throughout the debate</li>
            </ul>

            <p>
              Both participants presented thoughtful arguments, but{" "}
              {winner.username}'s arguments were more comprehensive and
              supported by stronger evidence.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
