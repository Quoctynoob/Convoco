// src/components/debate/SimpleDebateList.tsx
"use client";
import React from "react";
import { Debate } from "@/types/Debate";
import { DebateCard } from "./DebateCard";

interface SimpleDebateListProps {
  debates: Debate[];
  onJoinDebate: (debateId: string) => void;
  emptyMessage?: string;
}

export const SimpleDebateList: React.FC<SimpleDebateListProps> = ({
  debates,
  onJoinDebate,
  emptyMessage = "No debates found."
}) => {
  if (debates.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {debates.map((debate) => (
        <DebateCard 
          key={debate.id} 
          debate={debate} 
          onJoin={onJoinDebate} 
        />
      ))}
    </div>
  );
};