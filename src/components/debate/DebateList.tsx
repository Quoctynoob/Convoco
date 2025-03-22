// src/components/debate/DebateList.tsx
"use client";

import React from "react";
import { Debate } from "@/types/Debate";
import { DebateCard } from "./DebateCard";
import { useRouter } from "next/navigation";
import { useDebate } from "@/hooks/useDebate";
import { useAuth } from "@/hooks/useAuth";

interface DebateListProps {
  debates: Debate[];
  emptyMessage?: string;
}

export const DebateList: React.FC<DebateListProps> = ({
  debates,
  emptyMessage = "No debates found.",
}) => {
  const router = useRouter();
  const { user } = useAuth();

  const handleJoinDebate = async (debateId: string) => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Since we can't use the useDebate hook here with a dynamic ID,
    // we'll navigate to the debate page where the user can join
    router.push(`/debates/${debateId}`);
  };

  if (debates.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {debates.map((debate) => (
        <DebateCard key={debate.id} debate={debate} onJoin={handleJoinDebate} />
      ))}
    </div>
  );
};
