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
            <span className="mr-1 h-2 w-2 rounded-full bg-yellow-400"></span>
            Open
          </span>
        );
      case DebateStatus.ACTIVE:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <span className="mr-1 h-2 w-2 rounded-full bg-green-400"></span>
            In Progress
          </span>
        );
      case DebateStatus.COMPLETED:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <span className="mr-1 h-2 w-2 rounded-full bg-blue-400"></span>
            Completed
          </span>
        );
      case DebateStatus.ABANDONED:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <span className="mr-1 h-2 w-2 rounded-full bg-gray-400"></span>
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
    <Card
      hover
      className="h-full flex flex-col transform transition-transform duration-300 hover:-translate-y-1"
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl text-gray-900">
            {debate.topic}
          </CardTitle>
          {getStatusBadge()}
        </div>
        <CardDescription className="line-clamp-2 mt-2">
          {debate.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-3 text-sm">
          <div className="flex items-center text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-purple-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-medium text-gray-700">Created:</span>
            <span className="ml-2">{formatRelativeTime(debate.createdAt)}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-purple-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
            <span className="font-medium text-gray-700">Format:</span>
            <span className="ml-2">
              {debate.rounds} {debate.rounds === 1 ? "round" : "rounds"}
            </span>
          </div>

          {debate.status === DebateStatus.ACTIVE && (
            <div className="flex items-center text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-purple-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span className="font-medium text-gray-700">Current Round:</span>
              <span className="ml-2">
                {debate.currentRound} of {debate.rounds}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t border-gray-100 pt-4">
        {canJoin ? (
          <Button
            onClick={handleJoin}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            Join Debate
          </Button>
        ) : (
          <Link href={`/debates/${debate.id}`} className="w-full">
            <Button
              variant={isCreator || isOpponent ? "gradient" : "secondary"}
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
