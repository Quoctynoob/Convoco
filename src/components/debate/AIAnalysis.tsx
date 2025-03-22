// src/components/debate/AIAnalysis.tsx
"use client";
import React, { useState } from "react";
import { AIAnalysis, FactCheck } from "@/types/Argument";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

interface AIAnalysisDisplayProps {
  analysis: AIAnalysis;
  showCounterpoints?: boolean;
}

export const AIAnalysisDisplay: React.FC<AIAnalysisDisplayProps> = ({
  analysis,
  showCounterpoints = false,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTab, setSelectedTab] = useState<
    "analysis" | "factCheck" | "counterpoints"
  >("analysis");

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-700";
    if (score >= 6) return "text-blue-700";
    if (score >= 4) return "text-yellow-700";
    return "text-red-700";
  };

  const getScoreBg = (score: number) => {
    if (score >= 8) return "bg-green-100 border-green-200";
    if (score >= 6) return "bg-blue-100 border-blue-200";
    if (score >= 4) return "bg-yellow-100 border-yellow-200";
    return "bg-red-100 border-red-200";
  };

  return (
    <Card className="border border-purple-200 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 border-b border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold">
              AI
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Gemini Analysis</h4>
              <p className="text-xs text-gray-600">
                AI-powered feedback and fact-checking
              </p>
            </div>
          </div>
          <div
            className={`${getScoreBg(
              analysis.score
            )} rounded-full px-3 py-1 text-sm font-medium border`}
          >
            Score:{" "}
            <span className={getScoreColor(analysis.score)}>
              {analysis.score}/10
            </span>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setSelectedTab("analysis")}
            className={`py-3 px-4 text-sm font-medium border-b-2 ${
              selectedTab === "analysis"
                ? "border-purple-500 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Analysis
          </button>
          <button
            onClick={() => setSelectedTab("factCheck")}
            className={`py-3 px-4 text-sm font-medium border-b-2 ${
              selectedTab === "factCheck"
                ? "border-purple-500 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Fact Check
            {analysis.factCheck && analysis.factCheck.length > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {analysis.factCheck.length}
              </span>
            )}
          </button>
          {showCounterpoints &&
            analysis.suggestedCounterpoints &&
            analysis.suggestedCounterpoints.length > 0 && (
              <button
                onClick={() => setSelectedTab("counterpoints")}
                className={`py-3 px-4 text-sm font-medium border-b-2 ${
                  selectedTab === "counterpoints"
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Counterpoints
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {analysis.suggestedCounterpoints.length}
                </span>
              </button>
            )}
        </nav>
      </div>

      <CardContent className="p-4">
        {selectedTab === "analysis" && (
          <div className="prose prose-sm max-w-none">
            {analysis.content.split("\n").map((paragraph, index) =>
              paragraph ? (
                <p key={index} className="mb-3 text-gray-700">
                  {paragraph}
                </p>
              ) : (
                <br key={index} />
              )
            )}
          </div>
        )}

        {selectedTab === "factCheck" && (
          <div className="space-y-3">
            {analysis.factCheck && analysis.factCheck.length > 0 ? (
              analysis.factCheck.map((fact, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-md ${
                    fact.verified
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={`h-5 w-5 rounded-full flex items-center justify-center text-white text-xs ${
                        fact.verified ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {fact.verified ? "✓" : "✗"}
                    </div>
                    <p className="font-medium text-gray-900">{fact.claim}</p>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">
                    {fact.explanation}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No fact checks for this argument.
                </p>
              </div>
            )}
          </div>
        )}

        {selectedTab === "counterpoints" &&
          showCounterpoints &&
          analysis.suggestedCounterpoints && (
            <div className="space-y-2">
              {analysis.suggestedCounterpoints.map((point, index) => (
                <div
                  key={index}
                  className="p-3 bg-indigo-50 border border-indigo-200 rounded-md"
                >
                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-gray-800">{point}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
      </CardContent>
    </Card>
  );
};
