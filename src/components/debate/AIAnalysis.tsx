// src/components/debate/AIAnalysis.tsx
"use client";

import React, { useState } from "react";
import { AIAnalysis, FactCheck } from "@/types/Argument";
import { Button } from "@/components/ui/Button";

interface AIAnalysisDisplayProps {
  analysis: AIAnalysis;
  showCounterpoints?: boolean;
}

export const AIAnalysisDisplay: React.FC<AIAnalysisDisplayProps> = ({
  analysis,
  showCounterpoints = false,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
            AI
          </div>
          <h4 className="font-medium text-purple-800">Gemini Analysis</h4>
        </div>

        <div className="bg-white border border-purple-200 rounded-full px-3 py-1 text-sm font-medium">
          Score: <span className="text-purple-700">{analysis.score}/10</span>
        </div>
      </div>

      <div className="prose prose-sm max-w-none mb-3">
        {analysis.content
          .split("\n")
          .map((paragraph, index) =>
            paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
          )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDetails(!showDetails)}
        className="mb-3"
      >
        {showDetails ? "Hide Details" : "Show Fact Checks"}
      </Button>

      {showDetails && analysis.factCheck && analysis.factCheck.length > 0 && (
        <div className="mt-4 space-y-3">
          <h5 className="font-medium text-sm">Fact Checks</h5>
          {analysis.factCheck.map((fact, index) => (
            <div
              key={index}
              className={`p-3 rounded-md ${
                fact.verified
                  ? "bg-green-100 border border-green-200"
                  : "bg-red-100 border border-red-200"
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
                <p className="font-medium">{fact.claim}</p>
              </div>
              <p className="text-sm">{fact.explanation}</p>
            </div>
          ))}
        </div>
      )}

      {showCounterpoints &&
        analysis.suggestedCounterpoints &&
        analysis.suggestedCounterpoints.length > 0 && (
          <div className="mt-4 p-3 bg-white border border-purple-200 rounded-md">
            <h5 className="font-medium text-sm mb-2">
              Suggested Counterpoints
            </h5>
            <ul className="list-disc pl-5 space-y-1">
              {analysis.suggestedCounterpoints.map((point, index) => (
                <li key={index} className="text-sm">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}
    </div>
  );
};
