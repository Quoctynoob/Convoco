// src/hooks/useDebate.ts
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getDebateArguments,
  getUserDebates,
  getOpenDebates,
  createDebate,
  updateDebate,
  addArgument,
  markUserReady,
  getDebateAnalyses,
} from "@/lib/firebase/firestore";
import {
  analyzeArgument,
  determineDebateWinner,
} from "@/lib/gemini/api";
import { Debate, DebateStatus } from "@/types/Debate";
import { Argument, AIAnalysis } from "@/types/Argument";
import { User } from "@/types/User";
import { doc, onSnapshot, collection, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

export const useDebateCreation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const createNewDebate = async (
    topic: string,
    description: string,
    rounds: number,
    creatorId: string,
    side: "affirmative" | "negative" = "affirmative"
  ) => {
    setLoading(true);
    setError(null);
    console.log("Creating new debate with:", {
      topic,
      description,
      rounds,
      creatorId,
      side,
    });
    try {
      if (!creatorId) {
        throw new Error("User ID is required to create a debate");
      }
      const newDebate: Omit<Debate, "id" | "createdAt" | "updatedAt"> = {
        topic,
        description,
        creatorId,
        creatorSide: side,
        status: DebateStatus.PENDING,  // Make sure it's set to PENDING
        rounds,
        currentRound: 0,
        arguments: [],
        aiAnalysis: [],
      };
      const debateId = await createDebate(newDebate);
      console.log("Debate created with ID:", debateId);
      
      // Slight delay to ensure Firestore is updated
      setTimeout(() => {
        // Add created=true parameter to refresh debates when redirected back
        router.push(`/debates/${debateId}?created=true`);
      }, 500);
      
      return debateId;
    } catch (e) {
      console.error("Error in createNewDebate:", e);
      const errorMessage =
        e instanceof Error ? e.message : "Unknown error creating debate";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createNewDebate,
    loading,
    error,
  };
};

export const useDebate = (debateId: string) => {
  const [debate, setDebate] = useState<Debate | null>(null);
  const [debateArguments, setDebateArguments] = useState<Argument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!debateId) return;
    setLoading(true);
    const debateRef = doc(db, "debates", debateId);
    // Real-time listener for debate updates
    const unsubscribe = onSnapshot(
      debateRef,
      (doc) => {
        if (doc.exists()) {
          setDebate({ id: doc.id, ...doc.data() } as Debate);
        } else {
          setError("Debate not found");
          setDebate(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching debate:", err);
        setError("Error loading debate");
        setLoading(false);
      }
    );

    // Load debate arguments
    const loadArguments = async () => {
      try {
        // Get all arguments for the debate without complex ordering
        const args = await getDebateArguments(debateId);
        // The sorting is now handled inside getDebateArguments
        setDebateArguments(args);
      } catch (e) {
        console.error("Error loading arguments:", e);
      }
    };

    loadArguments();
    return () => unsubscribe();
  }, [debateId]);

  // Real-time listener for debate arguments
  useEffect(() => {
    if (!debateId) return;

    // Create a simpler query to listen for debate arguments
    const argumentsRef = collection(db, "arguments");
    const q = query(
      argumentsRef,
      where("debateId", "==", debateId)
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
      },
      (err) => {
        console.error("Error in arguments listener:", err);
        setError("Failed to get real-time updates for debate arguments.");
      }
    );

    return () => unsubscribe();
  }, [debateId]);

  const joinDebate = async (userId: string) => {
    if (!debate) return false;
    try {
      if (debate.status !== DebateStatus.PENDING) {
        setError("This debate is no longer open for joining");
        return false;
      }
      if (debate.creatorId === userId) {
        setError("You cannot join your own debate");
        return false;
      }
      
      // Update to set status to LOBBY instead of ACTIVE
      await updateDebate(debateId, {
        opponentId: userId,
        status: DebateStatus.LOBBY, // Change to LOBBY instead of ACTIVE
        creatorReady: false,        // Initialize ready state
        opponentReady: false,       // Initialize ready state
        updatedAt: Date.now()
      });
      
      // Return true to indicate successful join
      return true;
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Unknown error joining debate";
      setError(errorMessage);
      return false;
    }
  };

  // New function to mark a user as ready in the lobby
  const markReady = async (userId: string, isCreator: boolean) => {
    if (!debate) return false;
    try {
      await markUserReady(debateId, userId, isCreator);
      return true;
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Unknown error marking as ready";
      setError(errorMessage);
      return false;
    }
  };

  // Replace the submitArgument function in useDebate.ts

const submitArgument = async (
  content: string,
  userId: string,
  side: "creator" | "opponent",
  creator: User,
  opponent: User | null
) => {
  if (!debate || !opponent) return false;
  try {
    if (debate.status !== DebateStatus.ACTIVE) {
      setError("This debate is not active");
      return false;
    }
    if (debate.currentTurn !== userId) {
      setError("It is not your turn");
      return false;
    }
    const currentRound = debate.currentRound;
    
    console.log(`Submitting argument for ${side} in round ${currentRound}`);
    
    // Step 1: Add the argument
    const newArgument: Omit<Argument, "id" | "createdAt"> = {
      debateId,
      userId,
      content,
      round: currentRound,
      side,
    };
    
    const argumentId = await addArgument(newArgument);
    console.log(`Argument added with ID: ${argumentId}`);
    
    const argument = {
      id: argumentId,
      ...newArgument,
      createdAt: Date.now(),
    };
    
    // Step 2: Get AI analysis
    try {
      console.log(`Getting AI analysis for argument: ${argumentId}`);
      const previousArgs = debateArguments.filter(
        (arg) =>
          arg.round < currentRound ||
          (arg.round === currentRound && arg.userId !== userId)
      );
      
      const analysis = await analyzeArgument(
        debate,
        argument,
        previousArgs,
        creator,
        opponent
      );
      console.log(`Analysis created with score: ${analysis.score}`);
    } catch (analysisError) {
      console.error("Error during analysis:", analysisError);
      // Continue even if analysis fails
    }
    
    // Step 3: Check if this is the final argument
    let updates: Partial<Debate> = {};
    
    if (side === "opponent" && currentRound >= debate.rounds) {
      console.log("Final argument submitted - completing debate");
      
      try {
        // First update status
        await updateDebate(debateId, {
          status: DebateStatus.COMPLETED
        });
        console.log("Debate status updated to COMPLETED");
        
        // Then fetch all arguments and analyses for winner determination
        const allArguments = await getDebateArguments(debateId);
        const analyses = await getDebateAnalyses(debateId);
        
        try {
          // Determine winner
          const result = await determineDebateWinner(
            debate,
            allArguments,
            analyses,
            creator,
            opponent
          );
          console.log(`Winner determined: ${result.winnerId}`);
          
          // Update with winner
          await updateDebate(debateId, {
            winner: result.winnerId
          });
          console.log("Winner updated in debate");
        } catch (winnerError) {
          console.error("Error determining winner:", winnerError);
          // If we can't determine winner, default to creator
          await updateDebate(debateId, {
            winner: creator.id
          });
        }
      } catch (completionError) {
        console.error("Error completing debate:", completionError);
        throw completionError;
      }
    } else if (side === "creator") {
      // Switch to opponent's turn
      updates = {
        currentTurn: debate.opponentId,
      };
      await updateDebate(debateId, updates);
      console.log(`Debate turn updated to opponent: ${debate.opponentId}`);
    } else {
      // Switch back to creator's turn and increment round
      updates = {
        currentRound: currentRound + 1,
        currentTurn: debate.creatorId,
      };
      await updateDebate(debateId, updates);
      console.log(`Round incremented to ${currentRound + 1} and turn set to creator`);
    }
    
    return true;
  } catch (e) {
    console.error("Error in submitArgument:", e);
    const errorMessage =
      e instanceof Error ? e.message : "Unknown error submitting argument";
    setError(errorMessage);
    return false;
  }
};

  return {
    debate,
    debateArguments,
    loading,
    error,
    joinDebate,
    submitArgument,
    markReady,
  };
};

export const useDebateList = (userId?: string) => {
  const [debates, setDebates] = useState<Debate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDebates = async () => {
      setLoading(true);
      try {
        if (userId) {
          // Load user's debates
          const userDebates = await getUserDebates(userId);
          setDebates(userDebates);
        } else {
          // Load open debates
          const openDebates = await getOpenDebates();
          setDebates(openDebates);
        }
      } catch (e) {
        const errorMessage =
          e instanceof Error ? e.message : "Unknown error loading debates";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    loadDebates();
  }, [userId]);

  return {
    debates,
    loading,
    error,
  };
};