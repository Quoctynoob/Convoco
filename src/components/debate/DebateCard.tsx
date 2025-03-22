// src/components/debate/DebateCard.tsx
"use client";
import React from "react";
import { Debate, DebateStatus } from "@/types/Debate";
import { Button } from "@/components/ui/Button";
import { formatRelativeTime } from "@/utils/dates";

interface DebateCardProps {
  debate: Debate;
  onJoin: (debateId: string) => void;
}

export const DebateCard: React.FC<DebateCardProps> = ({ debate, onJoin }) => {
  // Determine which sides are needed
  // In a real app, this would be based on the debate's actual requirements
  const needsAffirmative = !debate.opponentId;
  const needsNegative = false; // This would be dynamic based on your debate structure

  return (
    <div className="border border-gray-200 rounded-lg hover:shadow-md transition-all p-4">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{debate.topic}</h3>
          <p className="text-sm text-gray-600 line-clamp-1">
            {debate.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {/* Debate status */}
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
              ${debate.status === DebateStatus.PENDING 
                ? "bg-yellow-100 text-yellow-800 border border-yellow-200" 
                : debate.status === DebateStatus.ACTIVE
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-blue-100 text-blue-800 border border-blue-200"
              }`}>
              <span className={`mr-1 h-2 w-2 rounded-full ${
                debate.status === DebateStatus.PENDING 
                  ? "bg-yellow-400" 
                  : debate.status === DebateStatus.ACTIVE
                  ? "bg-green-400"
                  : "bg-blue-400"
              }`}></span>
              {debate.status === DebateStatus.PENDING 
                ? "Open" 
                : debate.status === DebateStatus.ACTIVE
                ? "In Progress"
                : "Completed"}
            </span>
            
            {/* Side indicators */}
            {needsAffirmative && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                Affirmative Needed
              </span>
            )}
            {needsNegative && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                Negative Needed
              </span>
            )}
            
            {/* Format */}
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
              {debate.rounds} rounds
            </span>
          </div>
          
          <div className="text-xs text-gray-500 mt-2">
            Created {formatRelativeTime(debate.createdAt)}
          </div>
        </div>
        
        <Button 
          onClick={() => onJoin(debate.id)}
          className="whitespace-nowrap ml-4"
          variant={debate.status === DebateStatus.PENDING ? "gradient" : "outline"}
          disabled={debate.status !== DebateStatus.PENDING}
        >
          {debate.status === DebateStatus.PENDING ? "Join Debate" : "View Debate"}
        </Button>
      </div>
    </div>
  );
};