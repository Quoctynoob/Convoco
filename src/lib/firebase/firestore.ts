// src/lib/firebase/firestore.ts
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { Debate, DebateStatus } from "@/types/Debate";
import { Argument, AIAnalysis } from "@/types/Argument";

// Debate Operations
export const createDebate = async (
  debate: Omit<Debate, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  try {
    const debateRef = collection(db, "debates");
    const newDebate = {
      ...debate,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const docRef = await addDoc(debateRef, newDebate);
    return docRef.id;
  } catch (error) {
    console.error("Error creating debate:", error);
    throw error;
  }
};

export const getDebateById = async (id: string): Promise<Debate | null> => {
  try {
    const debateRef = doc(db, "debates", id);
    const debateSnap = await getDoc(debateRef);

    if (debateSnap.exists()) {
      return { id: debateSnap.id, ...debateSnap.data() } as Debate;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting debate:", error);
    throw error;
  }
};

export const updateDebate = async (
  id: string,
  updates: Partial<Debate>
): Promise<void> => {
  try {
    const debateRef = doc(db, "debates", id);
    await updateDoc(debateRef, {
      ...updates,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error("Error updating debate:", error);
    throw error;
  }
};

export const getOpenDebates = async (): Promise<Debate[]> => {
  try {
    const debatesRef = collection(db, "debates");
    const q = query(
      debatesRef,
      where("status", "==", "pending"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    const debates: Debate[] = [];
    snapshot.forEach((doc) => {
      debates.push({ id: doc.id, ...doc.data() } as Debate);
    });
    return debates;
  } catch (error) {
    console.error("Error getting open debates:", error);
    throw error;
  }
};

export const getUserDebates = async (userId: string): Promise<Debate[]> => {
  try {
    const debatesRef = collection(db, "debates");

    // Get debates where user is creator
    const creatorQuery = query(debatesRef, where("creatorId", "==", userId));
    const creatorSnapshot = await getDocs(creatorQuery);

    // Get debates where user is opponent
    const opponentQuery = query(debatesRef, where("opponentId", "==", userId));
    const opponentSnapshot = await getDocs(opponentQuery);

    const debates: Debate[] = [];

    // Add creator debates
    creatorSnapshot.forEach((doc) => {
      debates.push({ id: doc.id, ...doc.data() } as Debate);
    });

    // Add opponent debates (checking for duplicates)
    opponentSnapshot.forEach((doc) => {
      if (!debates.some((debate) => debate.id === doc.id)) {
        debates.push({ id: doc.id, ...doc.data() } as Debate);
      }
    });

    // Sort debates by createdAt date (newest first)
    debates.sort((a, b) => b.createdAt - a.createdAt);

    return debates;
  } catch (error) {
    console.error("Error getting user debates:", error);
    throw error;
  }
};

export const getUserActiveDebates = async (
  userId: string
): Promise<Debate[]> => {
  try {
    const debatesRef = collection(db, "debates");

    // Get active debates where user is creator
    const creatorQuery = query(
      debatesRef,
      where("creatorId", "==", userId),
      where("status", "in", [DebateStatus.ACTIVE, DebateStatus.PENDING])
    );
    const creatorSnapshot = await getDocs(creatorQuery);

    // Get active debates where user is opponent
    const opponentQuery = query(
      debatesRef,
      where("opponentId", "==", userId),
      where("status", "in", [DebateStatus.ACTIVE, DebateStatus.PENDING])
    );
    const opponentSnapshot = await getDocs(opponentQuery);

    const debates: Debate[] = [];

    // Add creator debates
    creatorSnapshot.forEach((doc) => {
      debates.push({ id: doc.id, ...doc.data() } as Debate);
    });

    // Add opponent debates (checking for duplicates)
    opponentSnapshot.forEach((doc) => {
      if (!debates.some((debate) => debate.id === doc.id)) {
        debates.push({ id: doc.id, ...doc.data() } as Debate);
      }
    });

    // Sort debates by updatedAt date (most recently active first)
    debates.sort((a, b) => b.updatedAt - a.updatedAt);

    return debates;
  } catch (error) {
    console.error("Error getting user active debates:", error);
    throw error;
  }
};

export const leaveDebate = async (
  debateId: string,
  userId: string
): Promise<void> => {
  try {
    const debateRef = doc(db, "debates", debateId);
    const debateSnap = await getDoc(debateRef);

    if (!debateSnap.exists()) {
      throw new Error("Debate not found");
    }

    const debate = { id: debateSnap.id, ...debateSnap.data() } as Debate;

    // Check if user is creator or opponent
    const isCreator = debate.creatorId === userId;
    const isOpponent = debate.opponentId === userId;

    if (!isCreator && !isOpponent) {
      throw new Error("User is not a participant in this debate");
    }

    // If debate is active, mark it as forfeited
    if (debate.status === DebateStatus.ACTIVE) {
      // Set the winner as the other participant
      const winner = isCreator ? debate.opponentId : debate.creatorId;

      await updateDoc(debateRef, {
        status: DebateStatus.COMPLETED,
        winner,
        forfeitedBy: userId,
        updatedAt: Date.now(),
      });
    }
    // If debate is pending and user is creator, delete or mark as cancelled
    else if (debate.status === DebateStatus.PENDING && isCreator) {
      // For now, just mark it as cancelled rather than deleting
      await updateDoc(debateRef, {
        status: DebateStatus.CANCELLED,
        updatedAt: Date.now(),
      });
    }
    // If pending and user is opponent (rare case), just remove them
    else if (debate.status === DebateStatus.PENDING && isOpponent) {
      await updateDoc(debateRef, {
        opponentId: null,
        updatedAt: Date.now(),
      });
    }
  } catch (error) {
    console.error("Error leaving debate:", error);
    throw error;
  }
};

// Argument Operations
export const addArgument = async (
  argument: Omit<Argument, "id" | "createdAt">
): Promise<string> => {
  try {
    const argumentsRef = collection(db, "arguments");
    const newArgument = {
      ...argument,
      createdAt: Date.now(),
    };
    const docRef = await addDoc(argumentsRef, newArgument);
    return docRef.id;
  } catch (error) {
    console.error("Error adding argument:", error);
    throw error;
  }
};

export const getDebateArguments = async (
  debateId: string,
  useOrdering = false
) => {
  try {
    const argumentsRef = collection(db, "arguments");
    let q;

    if (useOrdering) {
      // Original query with ordering (requires composite index)
      q = query(
        argumentsRef,
        where("debateId", "==", debateId),
        orderBy("createdAt", "asc")
      );
    } else {
      // Simplified query (no composite index needed)
      q = query(argumentsRef, where("debateId", "==", debateId));
    }

    const snapshot = await getDocs(q);
    const argumentList: Argument[] = [];
    snapshot.forEach((doc) => {
      argumentList.push({
        id: doc.id,
        ...doc.data(),
      } as Argument);
    });

    // If not using ordering in the query, sort the results client-side
    if (!useOrdering) {
      argumentList.sort((a, b) => a.createdAt - b.createdAt);
    }

    return argumentList;
  } catch (error) {
    console.error("Error getting debate arguments:", error);
    throw error;
  }
};

// AI Analysis Operations
export const addAnalysis = async (
  analysis: Omit<AIAnalysis, "id" | "createdAt">
): Promise<string> => {
  try {
    const analysisRef = collection(db, "analysis");
    const newAnalysis = {
      ...analysis,
      createdAt: Date.now(),
    };
    const docRef = await addDoc(analysisRef, newAnalysis);
    return docRef.id;
  } catch (error) {
    console.error("Error adding analysis:", error);
    throw error;
  }
};

export const getArgumentAnalysis = async (
  argumentId: string
): Promise<AIAnalysis | null> => {
  try {
    const analysisRef = collection(db, "analysis");
    const q = query(
      analysisRef,
      where("argumentId", "==", argumentId),
      limit(1)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    return {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data(),
    } as AIAnalysis;
  } catch (error) {
    console.error("Error getting argument analysis:", error);
    throw error;
  }
};
