// src/app/debates/[debateId]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { DebateArena } from "@/components/debate/DebateArena";
import { useDebate } from "@/hooks/useDebate";
import { useAuth } from "@/hooks/useAuth";
import { getUserProfile } from "@/lib/firebase/auth";
import { User } from "@/types/User";
import { leaveDebate } from "@/lib/firebase/firestore";

export default function DebateDetailPage() {
  const params = useParams();
  const debateIdParam = params.debateId;
  // Convert to string if it's an array, or use as is if it's already a string
  const debateId = Array.isArray(debateIdParam)
    ? debateIdParam[0]
    : debateIdParam;

  const router = useRouter();
  const { user } = useAuth();
  const {
    debate,
    debateArguments: args,
    loading,
    error,
    joinDebate,
    submitArgument,
  } = useDebate(debateId);

  const [creator, setCreator] = useState<User | null>(null);
  const [opponent, setOpponent] = useState<User | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      if (!debate) return;
      setLoadingUsers(true);
      try {
        const creatorProfile = await getUserProfile(debate.creatorId);
        setCreator(creatorProfile);
        if (debate.opponentId) {
          const opponentProfile = await getUserProfile(debate.opponentId);
          setOpponent(opponentProfile);
        }
      } catch (e) {
        console.error("Error loading user profiles:", e);
      } finally {
        setLoadingUsers(false);
      }
    };
    loadUsers();
  }, [debate]);

  const handleJoinDebate = async () => {
    if (!user) return false;
    return await joinDebate(user.id);
  };

  const handleLeaveDebate = async () => {
    if (!user || !debate) return;

    setIsLeaving(true);
    try {
      // Check if the user is the creator or opponent
      const isCreator = user.id === debate.creatorId;
      const isOpponent = user.id === debate.opponentId;

      if (!isCreator && !isOpponent) {
        return; // User is not a participant
      }

      // Call the leaveDebate function
      await leaveDebate(debate.id, user.id);

      // Redirect to debates page
      router.push("/debates");
    } catch (error) {
      console.error("Error leaving debate:", error);
      alert("There was an error leaving the debate. Please try again.");
    } finally {
      setIsLeaving(false);
    }
  };

  if (loading || loadingUsers) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error || !debate) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Debate Not Found
          </h1>
          <p className="text-gray-500 mb-6">
            The debate you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/debates">
            <Button>Browse Debates</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Debate
          </h1>
          <p className="text-gray-500 mb-6">
            Could not load creator information for this debate.
          </p>
          <Link href="/debates">
            <Button>Browse Debates</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Check if the current user is a participant
  const isParticipant =
    user && (user.id === debate.creatorId || user.id === debate.opponentId);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <Link href="/debates">
          <Button variant="outline" size="sm">
            <svg
              className="h-4 w-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            Back to Debates
          </Button>
        </Link>

        {/* Leave Button - Only show if user is a participant */}
        {isParticipant && (
          <Button
            variant="outline"
            onClick={handleLeaveDebate}
            disabled={isLeaving}
            className="text-red-600 border-red-200 hover:bg-red-50"
            size="sm"
          >
            {isLeaving ? "Leaving..." : "Leave Debate"}
          </Button>
        )}
      </div>

      <DebateArena
        debate={debate}
        arguments={args}
        creator={creator}
        opponent={opponent}
        onJoinDebate={handleJoinDebate}
      />
    </div>
  );
}
