// src/components/debate/DebateCard.tsx
"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatRelativeTime } from "@/utils/dates";
import { Debate, DebateStatus } from "@/types/Debate";
import { useAuth } from "@/hooks/useAuth";

interface DebateCardProps {
  debate: Debate;
  onJoin?: (debateId: string) => void;
}

export const DebateCard: React.FC<DebateCardProps> = ({ debate, onJoin }) => {
  const { user, isAuthenticated } = useAuth();

  const isCreator = user?.id === debate.creatorId;
  const isOpponent = user?.id === debate.opponentId;
  const canJoin =
    isAuthenticated &&
    !isCreator &&
    !isOpponent &&
    debate.status === DebateStatus.PENDING;

  const getStatusBadge = () => {
    switch (debate.status) {
      case DebateStatus.PENDING:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Open
          </span>
        );
      case DebateStatus.ACTIVE:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            In Progress
          </span>
        );
      case DebateStatus.COMPLETED:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Completed
          </span>
        );
      case DebateStatus.ABANDONED:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Abandoned
          </span>
        );
      default:
        return null;
    }
  };

  const handleJoin = () => {
    if (onJoin && canJoin) {
      onJoin(debate.id);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{debate.topic}</CardTitle>
          {getStatusBadge()}
        </div>
        <CardDescription>
          {debate.description.length > 100
            ? `${debate.description.substring(0, 100)}...`
            : debate.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-semibold">Format:</span> {debate.rounds}{" "}
            rounds
          </p>
          <p>
            <span className="font-semibold">Created:</span>{" "}
            {formatRelativeTime(debate.createdAt)}
          </p>
          {debate.status === DebateStatus.ACTIVE && (
            <p>
              <span className="font-semibold">Current Round:</span>{" "}
              {debate.currentRound} of {debate.rounds}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        {canJoin ? (
          <Button onClick={handleJoin} className="w-full">
            Join Debate
          </Button>
        ) : (
          <Link href={`/debates/${debate.id}`} className="w-full">
            <Button
              variant={isCreator || isOpponent ? "default" : "secondary"}
              className="w-full"
            >
              {isCreator || isOpponent ? "Continue Debate" : "View Debate"}
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};
