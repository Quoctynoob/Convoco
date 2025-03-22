// src/components/debate/DebateArena.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Debate, DebateStatus } from "@/types/Debate";
import { Argument, AIAnalysis } from "@/types/Argument";
import { User } from "@/types/User";
import { ArgumentInput } from "./ArgumentInput";
import { ArgumentDisplay } from "./ArgumentDisplay";
import { AIAnalysisDisplay } from "./AIAnalysis";
import { DebateResults } from "./DebateResults";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useAuth } from "@/hooks/useAuth";
import {
  addArgument,
  getArgumentAnalysis,
  updateDebate,
  forfeitDebate,
  getDebateArguments,
} from "@/lib/firebase/firestore";
import { analyzeArgument } from "@/lib/gemini/api";
import { onSnapshot, collection, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

interface DebateArenaProps {
  debate: Debate;
  arguments: Argument[];
  creator: User;
  opponent: User | null;
  onJoinDebate: () => Promise<boolean>;
}

export const DebateArena: React.FC<DebateArenaProps> = ({
  debate,
  arguments: initialArguments,
  creator,
  opponent,
  onJoinDebate,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyses, setAnalyses] = useState<AIAnalysis[]>([]);
  const [showForfeitModal, setShowForfeitModal] = useState(false);
  const [isForfeiting, setIsForfeiting] = useState(false);
  const [debateArguments, setDebateArguments] =
    useState<Argument[]>(initialArguments);

  const isCreator = user?.id === debate.creatorId;
  const isOpponent = user?.id === debate.opponentId;
  const isParticipant = isCreator || isOpponent;
  const isMyTurn = user?.id === debate.currentTurn;

  // Determine if a debate was forfeited and by whom
  const wasForfeited = !!debate.forfeitedBy;
  const forfeitedByCreator = debate.forfeitedBy === debate.creatorId;
  const forfeitedByMe = user?.id === debate.forfeitedBy;

  // Real-time listener for debate arguments
  useEffect(() => {
    if (!debate.id) return;

    // Create a simpler query to listen for debate arguments
    const argumentsRef = collection(db, "arguments");
    const q = query(
      argumentsRef,
      where("debateId", "==", debate.id)
      // Remove the orderBy clause temporarily
    );

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const argumentsList: Argument[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          argumentsList.push({
            id: doc.id,
            debateId: data.debateId,
            userId: data.userId,
            content: data.content,
            round: data.round,
            side: data.side,
            createdAt: data.createdAt,
          });
        });
        // Sort them client-side instead
        argumentsList.sort((a, b) => a.createdAt - b.createdAt);
        setDebateArguments(argumentsList);
        console.log(
          "Real-time arguments update received:",
          argumentsList.length
        );
      },
      (err) => {
        console.error("Error in arguments listener:", err);
        setError("Failed to get real-time updates for debate arguments.");
      }
    );

    return () => unsubscribe();
  }, [debate.id]);

  useEffect(() => {
    // Load analyses for existing arguments
    const loadAnalyses = async () => {
      const analysisPromises = debateArguments.map(async (arg) => {
        try {
          const analysis = await getArgumentAnalysis(arg.id);
          return analysis;
        } catch (error) {
          console.error(
            `Error loading analysis for argument ${arg.id}:`,
            error
          );
          return null;
        }
      });
      const results = await Promise.all(analysisPromises);
      setAnalyses(results.filter((a): a is AIAnalysis => a !== null));
    };
    loadAnalyses();
  }, [debateArguments]);

  const handleJoin = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const success = await onJoinDebate();
      if (!success) {
        setError("Failed to join debate. Please try again.");
      }
    } catch (e) {
      setError("An unexpected error occurred.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleForfeit = async () => {
    if (!user || !isParticipant) return;
    setIsForfeiting(true);
    try {
      await forfeitDebate(debate.id, user.id);
      setShowForfeitModal(false);
    } catch (e) {
      setError("Failed to forfeit debate. Please try again.");
      console.error("Error forfeiting debate:", e);
    } finally {
      setIsForfeiting(false);
    }
  };

  const getPreviousArgument = (): Argument | null => {
    if (!debateArguments.length) return null;
    // If it's the creator's turn, get the last argument from the opponent
    // If it's the opponent's turn, get the last argument from the creator
    const targetUserId = isCreator ? debate.opponentId : debate.creatorId;
    // Sort arguments by creation time (newest first)
    const sortedArgs = [...debateArguments].sort(
      (a, b) => b.createdAt - a.createdAt
    );
    // Find the most recent argument from the target user
    return sortedArgs.find((arg) => arg.userId === targetUserId) || null;
  };

  const getPreviousArgumentUser = (): User | null => {
    const prevArg = getPreviousArgument();
    if (!prevArg) return null;
    // Return the user who created the previous argument
    return prevArg.userId === creator.id ? creator : opponent;
  };

  const handleSubmitArgument = async (content: string) => {
    if (!user || !isMyTurn || !opponent) return;
    setLoading(true);
    setError(null);
    try {
      // Determine which side the user is on
      const side = isCreator ? "creator" : "opponent";
      // Create the new argument
      const newArgument: Omit<Argument, "id" | "createdAt"> = {
        debateId: debate.id,
        userId: user.id,
        content,
        round: debate.currentRound,
        side,
      };
      // Add argument to Firestore
      const argumentId = await addArgument(newArgument);
      const argument = {
        id: argumentId,
        ...newArgument,
        createdAt: Date.now(),
      };
      // Get previous arguments for context
      const previousArgs = debateArguments.filter(
        (arg) =>
          arg.round < debate.currentRound ||
          (arg.round === debate.currentRound && arg.userId !== user.id)
      );
      // Get AI analysis
      const analysis = await analyzeArgument(
        debate,
        argument,
        previousArgs,
        creator,
        opponent
      );
      // Determine next turn or complete debate
      let updates: Partial<Debate> = {};
      if (side === "opponent" && debate.currentRound >= debate.rounds) {
        // Debate will be completed after determining winner
        updates = {
          status: DebateStatus.COMPLETED,
          currentTurn: null, // Use null instead of undefined for Firestore
        };
      } else if (side === "creator") {
        // Switch to opponent's turn
        updates = {
          currentTurn: debate.opponentId,
        };
      } else {
        // Switch back to creator's turn and increment round
        updates = {
          currentRound: debate.currentRound + 1,
          currentTurn: debate.creatorId,
        };
      }
      // Update debate status
      await updateDebate(debate.id, updates);
    } catch (e) {
      setError("Failed to submit argument. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const renderDebateStatus = () => {
    switch (debate.status) {
      case DebateStatus.PENDING:
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex items-center mb-2">
              <div className="h-3 w-3 rounded-full bg-yellow-400 mr-2"></div>
              <h3 className="text-lg font-medium text-yellow-800">
                Waiting for an opponent
              </h3>
            </div>
            <p className="text-sm text-yellow-700">
              This debate is waiting for someone to join. Share the link with
              others or wait for someone to discover it.
            </p>
            {!isCreator && user && (
              <Button onClick={handleJoin} disabled={loading} className="mt-4">
                {loading ? "Joining..." : "Join This Debate"}
              </Button>
            )}
          </div>
        );
      case DebateStatus.ACTIVE:
        return (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex items-center mb-2">
              <div className="h-3 w-3 rounded-full bg-green-400 mr-2"></div>
              <h3 className="text-lg font-medium text-green-800">
                Round {debate.currentRound} of {debate.rounds}
              </h3>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-green-700">
                {isMyTurn
                  ? "It's your turn to present your argument."
                  : `Waiting for ${
                      debate.currentTurn === creator.id
                        ? creator.username
                        : opponent?.username
                    } to respond.`}
              </p>
              {isParticipant && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => setShowForfeitModal(true)}
                >
                  Forfeit Debate
                </Button>
              )}
            </div>
          </div>
        );
      case DebateStatus.COMPLETED:
        return (
          <div
            className={`${
              wasForfeited
                ? "bg-amber-50 border-amber-200"
                : "bg-blue-50 border-blue-200"
            } border rounded-lg p-4 mb-6 shadow-sm`}
          >
            <div className="flex items-center mb-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  wasForfeited ? "bg-amber-400" : "bg-blue-400"
                } mr-2`}
              ></div>
              <h3 className="text-lg font-medium text-gray-800">
                Debate Completed
              </h3>
            </div>
            {wasForfeited ? (
              <p className="text-sm text-amber-700">
                This debate was forfeited by{" "}
                {forfeitedByCreator ? creator.username : opponent?.username}.
                {forfeitedByMe &&
                  " You forfeited this debate, which counts as a loss."}
              </p>
            ) : (
              <p className="text-sm text-blue-700">
                This debate has been completed and a winner has been determined.
              </p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const renderDebateContent = () => {
    if (debate.status === DebateStatus.COMPLETED && debate.winner) {
      return (
        <DebateResults
          debate={debate}
          arguments={debateArguments}
          analyses={analyses}
          creator={creator}
          opponent={opponent!}
          winnerId={debate.winner}
          wasForfeit={wasForfeited}
        />
      );
    }
    return (
      <div className="space-y-8">
        {/* Round indicators */}
        {debate.status === DebateStatus.ACTIVE && (
          <div className="flex justify-center mb-8">
            <div className="flex space-x-4">
              {Array.from({ length: debate.rounds }).map((_, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center ${
                    index + 1 === debate.currentRound ? "scale-110" : ""
                  }`}
                >
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center font-medium 
                      ${
                        index + 1 < debate.currentRound
                          ? "bg-purple-600 text-white"
                          : index + 1 === debate.currentRound
                          ? "bg-purple-100 text-purple-600 border-2 border-purple-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`text-xs mt-1 ${
                      index + 1 === debate.currentRound
                        ? "font-medium text-purple-600"
                        : "text-gray-500"
                    }`}
                  >
                    Round {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Arguments and analyses */}
        {debateArguments.length > 0 ? (
          <div className="space-y-8">
            {debateArguments.map((argument) => {
              const analysis = analyses.find(
                (a) => a.argumentId === argument.id
              );
              const isCreatorArgument = argument.userId === creator.id;
              const argUser = isCreatorArgument ? creator : opponent;
              return (
                <div key={argument.id} className="space-y-4">
                  <ArgumentDisplay
                    argument={argument}
                    user={argUser!}
                    isCreator={isCreatorArgument}
                  />
                  {analysis && (
                    <AIAnalysisDisplay
                      analysis={analysis}
                      showCounterpoints={
                        isParticipant && debate.currentTurn === user?.id
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <p className="text-gray-500">
              No arguments have been made yet.
              {isMyTurn &&
                debate.status === DebateStatus.ACTIVE &&
                " It's your turn to start the debate."}
            </p>
          </div>
        )}
        {debate.status === DebateStatus.ACTIVE && isMyTurn && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50">
              <h3 className="text-lg font-medium text-gray-900">
                Your Turn - Round {debate.currentRound}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Present your argument with clear reasoning and evidence.
              </p>
            </div>
            <div className="p-4">
              <ArgumentInput
                onSubmit={handleSubmitArgument}
                loading={loading}
                round={debate.currentRound}
                maxLength={5000}
                previousArgument={getPreviousArgument()}
                previousUser={getPreviousArgumentUser()}
              />
            </div>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto my-8 px-4">
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {debate.topic}
        </h1>
        <p className="text-gray-600 mb-4">{debate.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
            {debate.rounds} rounds
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
            Creator: {creator.username}
          </span>
          {opponent && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
              Opponent: {opponent.username}
            </span>
          )}
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
            Creator Position:{" "}
            {debate.creatorSide === "affirmative" ? "Affirmative" : "Negative"}
          </span>
        </div>
      </div>
      <div className="space-y-6">
        {renderDebateStatus()}
        {renderDebateContent()}
      </div>
      {/* Forfeit confirmation modal */}
      <Modal
        isOpen={showForfeitModal}
        onClose={() => setShowForfeitModal(false)}
        title="Forfeit Debate"
      >
        <div className="p-4">
          <div className="text-center mb-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg
                className="h-6 w-6 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Are you sure you want to forfeit?
            </h3>
            <p className="text-sm text-gray-500">
              Forfeiting will end the debate immediately and count as a loss for
              you. This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowForfeitModal(false)}
              disabled={isForfeiting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleForfeit}
              disabled={isForfeiting}
              isLoading={isForfeiting}
            >
              {isForfeiting ? "Processing..." : "Forfeit Debate"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
