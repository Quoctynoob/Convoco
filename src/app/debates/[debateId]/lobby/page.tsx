// src/app/debates/[debateId]/lobby/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { getUserProfile } from "@/lib/firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { User } from "@/types/User";
import { Debate, DebateStatus } from "@/types/Debate";
import { markUserReady, updateDebate } from "@/lib/firebase/firestore";

export default function DebateLobbyPage() {
  const params = useParams();
  const debateIdParam = params.debateId;
  // Convert to string if it's an array, or use as is if it's already a string
  const debateId = Array.isArray(debateIdParam)
    ? debateIdParam[0]
    : debateIdParam;
  const router = useRouter();
  const { user } = useAuth();

  const [debate, setDebate] = useState<Debate | null>(null);
  const [creator, setCreator] = useState<User | null>(null);
  const [opponent, setOpponent] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Check if user is a participant
  const isCreator = user?.id === debate?.creatorId;
  const isOpponent = user?.id === debate?.opponentId;
  const isParticipant = isCreator || isOpponent;

  // Real-time listener for debate updates
  useEffect(() => {
    if (!debateId) return;
    const debateRef = doc(db, "debates", debateId);
    const unsubscribe = onSnapshot(
      debateRef,
      async (docSnapshot) => {
        if (docSnapshot.exists()) {
          const debateData = {
            id: docSnapshot.id,
            ...docSnapshot.data(),
          } as Debate;
          setDebate(debateData);

          // Check if the debate has moved to ACTIVE status
          if (debateData.status === DebateStatus.ACTIVE) {
            // Redirect to the debate page after a short delay
            setTimeout(() => {
              router.push(`/debates/${debateId}`);
            }, 500);
          }
          // Check ready state
          if (isCreator && debateData.creatorReady) {
            setIsReady(true);
          } else if (isOpponent && debateData.opponentReady) {
            setIsReady(true);
          }
          // If both users are ready, start countdown
          if (
            debateData.creatorReady &&
            debateData.opponentReady &&
            countdown === null
          ) {
            setCountdown(3);
          }
          // Load user profiles
          try {
            if (!creator && debateData.creatorId) {
              const creatorProfile = await getUserProfile(debateData.creatorId);
              setCreator(creatorProfile);
            }
            if (!opponent && debateData.opponentId) {
              const opponentProfile = await getUserProfile(
                debateData.opponentId
              );
              setOpponent(opponentProfile);
            }
          } catch (e) {
            console.error("Error loading user profiles:", e);
          }
        } else {
          setError("Debate not found");
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error getting debate:", error);
        setError("Error loading debate");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [debateId, router, creator, opponent, isCreator, isOpponent, countdown]);

  // Countdown timer
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (countdown === 0 && debate) {
      // When countdown reaches zero, start the debate
      updateDebate(debate.id, {
        status: DebateStatus.ACTIVE,
        currentRound: 1,
        currentTurn: debate.creatorId,
      });
    }
  }, [countdown, debate]);

  const handleReady = async () => {
    if (!debate || !user) return;
    try {
      // Mark user as ready
      await markUserReady(debate.id, user.id, isCreator);
      setIsReady(true);
    } catch (e) {
      console.error("Error marking user as ready:", e);
      setError("Failed to ready up. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !debate) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {error || "Something went wrong"}
            </h2>
            <p className="text-gray-600 mb-6">
              Unable to load the debate lobby. It may have been deleted or you
              might not have permission to view it.
            </p>
            <Link href="/debates">
              <Button>Browse Debates</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user is not a participant, show access denied
  if (!isParticipant) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-6">
              You are not a participant in this debate.
            </p>
            <Link href="/debates">
              <Button>Browse Debates</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate how many users are ready
  const readyCount =
    (debate.creatorReady ? 1 : 0) + (debate.opponentReady ? 1 : 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Card className="overflow-hidden">
        {/* Debate topic header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
          <h1 className="text-2xl font-bold mb-2">{debate.topic}</h1>
          <p className="text-indigo-100">{debate.description}</p>
        </div>
        <CardContent className="p-6">
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Debate Lobby
            </h2>
            <p className="text-gray-600">
              Both participants must click "Ready" to begin the timed debate.
            </p>
            <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
              <p className="font-medium mb-1">Timed Debate Rules:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Each participant will have exactly 1 minute per turn to
                  respond
                </li>
                <li>The timer starts as soon as it's your turn</li>
                <li>
                  When time expires, your current response will be automatically
                  submitted
                </li>
                <li>
                  Focus on making your key points concisely within the time
                  limit
                </li>
              </ul>
            </div>
          </div>
          {/* Participants */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Creator card */}
            <div
              className={`p-4 rounded-lg border-2 ${
                debate.creatorReady
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-purple-200 hover:bg-purple-50/30"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                {creator?.photoURL ? (
                  <img
                    src={creator.photoURL}
                    alt={creator.username}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {creator?.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-semibold">
                    {creator?.username || "Creator"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {debate.creatorSide === "affirmative"
                      ? "Affirmative Side"
                      : "Negative Side"}
                  </p>
                </div>
              </div>
              <div className="mt-3 text-center">
                {debate.creatorReady ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Ready
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Not Ready
                  </span>
                )}
              </div>
            </div>
            {/* Opponent card */}
            <div
              className={`p-4 rounded-lg border-2 ${
                debate.opponentReady
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-purple-200 hover:bg-purple-50/30"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                {opponent?.photoURL ? (
                  <img
                    src={opponent.photoURL}
                    alt={opponent.username}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                    {opponent?.username.charAt(0).toUpperCase() || "?"}
                  </div>
                )}
                <div>
                  <p className="font-semibold">
                    {opponent?.username || "Opponent"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {debate.creatorSide === "affirmative"
                      ? "Negative Side"
                      : "Affirmative Side"}
                  </p>
                </div>
              </div>
              <div className="mt-3 text-center">
                {debate.opponentReady ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Ready
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Not Ready
                  </span>
                )}
              </div>
            </div>
          </div>
          {/* Ready status and button */}
          <div className="text-center">
            {countdown !== null ? (
              <div className="bg-indigo-100 rounded-lg p-8 flex flex-col items-center justify-center">
                <h3 className="text-xl font-bold text-indigo-800 mb-2">
                  Timed Debate Starting
                </h3>
                <div className="text-6xl font-bold text-indigo-700 mb-2">
                  {countdown}
                </div>
                <p className="text-indigo-600">
                  Get ready for your 1-minute timed responses!
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="inline-block bg-gray-100 rounded-full px-4 py-2 mb-4">
                    <span className="text-gray-700 font-medium">
                      {readyCount}/2 participants ready
                    </span>
                  </div>
                  {readyCount === 2 && (
                    <p className="text-green-600 font-medium">
                      Both participants are ready! Starting soon...
                    </p>
                  )}
                </div>
                <Button
                  variant="gradient"
                  size="lg"
                  className="min-w-[200px]"
                  onClick={handleReady}
                  disabled={isReady}
                >
                  {isReady ? "You're Ready" : "Ready Up"}
                </Button>
                <p className="mt-2 text-sm text-gray-500">
                  {isReady
                    ? "Waiting for other participant to ready up..."
                    : "Click when you're ready to start the timed debate"}
                </p>

              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
