"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { DebateArena } from "@/components/debate/DebateArena";
import { useDebate } from "@/hooks/useDebate";
import { useAuth } from "@/hooks/useAuth";
import { getUserProfile } from "@/lib/firebase/auth";
import { User } from "@/types/User";

export default function DebateDetailPage() {
  const { debateId } = useParams();
  const { user } = useAuth();
  const {
    debate,
    debateArguments: args, // Changed from 'arguments'
    loading,
    error,
    joinDebate,
    submitArgument,
  } = useDebate(debateId);
  const [creator, setCreator] = useState<User | null>(null);
  const [opponent, setOpponent] = useState<User | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);

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

  if (loading || loadingUsers) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !debate) {
    return (
      <div className="text-center py-12">
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
    );
  }

  if (!creator) {
    return (
      <div className="text-center py-12">
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
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">{debate.topic}</h1>
        <p className="mt-2 text-gray-500">{debate.description}</p>
        <div className="mt-4 flex items-center text-sm text-gray-500">
          <span className="font-medium">Format:</span>
          <span className="ml-2">{debate.rounds} rounds</span>
          <span className="mx-2">•</span>
          <span className="font-medium">Created by:</span>
          <Link
            href={`/profile/${creator.id}`}
            className="ml-2 text-purple-600 hover:underline"
          >
            {creator.username}
          </Link>
        </div>
      </div>
      <DebateArena
        debate={debate}
        arguments={args} // Changed from debateArguments
        creator={creator}
        opponent={opponent}
        onJoinDebate={handleJoinDebate}
      />
    </div>
  );
}
