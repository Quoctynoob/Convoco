// src/lib/firebase/firestore.ts
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  DocumentReference,
  DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";
import { Debate, DebateStatus } from "@/types/Debate";
import { Argument, AIAnalysis } from "@/types/Argument";

// DEBATES

export const getDebateById = async (
  debateId: string
): Promise<Debate | null> => {
  try {
    const docRef = doc(db, "debates", debateId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Debate;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting debate:", error);
    throw error;
  }
};

export const getOpenDebates = async (): Promise<Debate[]> => {
  try {
    const q = query(
      collection(db, "debates"),
      where("status", "==", DebateStatus.PENDING),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const debates: Debate[] = [];

    querySnapshot.forEach((doc) => {
      debates.push({ id: doc.id, ...doc.data() } as Debate);
    });

    return debates;
  } catch (error) {
    console.error("Error getting open debates:", error);
    throw error;
  }
};

export const getUserActiveDebates = async (
  userId: string
): Promise<Debate[]> => {
  try {
    // Query debates where user is creator OR opponent AND status is not COMPLETED
    const creatorQuery = query(
      collection(db, "debates"),
      where("creatorId", "==", userId),
      where("status", "in", [DebateStatus.PENDING, DebateStatus.ACTIVE])
    );

    const opponentQuery = query(
      collection(db, "debates"),
      where("opponentId", "==", userId),
      where("status", "in", [DebateStatus.PENDING, DebateStatus.ACTIVE])
    );

    const [creatorSnapshot, opponentSnapshot] = await Promise.all([
      getDocs(creatorQuery),
      getDocs(opponentQuery),
    ]);

    const debates: Debate[] = [];

    creatorSnapshot.forEach((doc) => {
      debates.push({ id: doc.id, ...doc.data() } as Debate);
    });

    opponentSnapshot.forEach((doc) => {
      // Check for duplicates in case user is both creator and opponent somehow
      if (!debates.some((debate) => debate.id === doc.id)) {
        debates.push({ id: doc.id, ...doc.data() } as Debate);
      }
    });

    // Sort by updatedAt (most recent first)
    return debates.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch (error) {
    console.error("Error getting user active debates:", error);
    throw error;
  }
};

export const getUserDebates = async (userId: string): Promise<Debate[]> => {
  try {
    const creatorQuery = query(
      collection(db, "debates"),
      where("creatorId", "==", userId)
    );

    const opponentQuery = query(
      collection(db, "debates"),
      where("opponentId", "==", userId)
    );

    const [creatorSnapshot, opponentSnapshot] = await Promise.all([
      getDocs(creatorQuery),
      getDocs(opponentQuery),
    ]);

    const debates: Debate[] = [];

    creatorSnapshot.forEach((doc) => {
      debates.push({ id: doc.id, ...doc.data() } as Debate);
    });

    opponentSnapshot.forEach((doc) => {
      if (!debates.some((debate) => debate.id === doc.id)) {
        debates.push({ id: doc.id, ...doc.data() } as Debate);
      }
    });

    return debates.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error("Error getting user debates:", error);
    throw error;
  }
};

export const createDebate = async (
  debate: Omit<Debate, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  try {
    const now = Date.now();
    const debateWithTimestamps = {
      ...debate,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(
      collection(db, "debates"),
      debateWithTimestamps
    );
    return docRef.id;
  } catch (error) {
    console.error("Error creating debate:", error);
    throw error;
  }
};

export const updateDebate = async (
  debateId: string,
  updates: Partial<Debate>
): Promise<void> => {
  try {
    const debateRef = doc(db, "debates", debateId);

    // Add updatedAt timestamp to updates
    const updatesWithTimestamp = {
      ...updates,
      updatedAt: Date.now(),
    };

    await updateDoc(debateRef, updatesWithTimestamp);
  } catch (error) {
    console.error("Error updating debate:", error);
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

    const debateData = debateSnap.data() as Debate;

    // Check if the user is the creator or opponent
    const isCreator = userId === debateData.creatorId;
    const isOpponent = userId === debateData.opponentId;

    if (!isCreator && !isOpponent) {
      throw new Error("User is not a participant in this debate");
    }

    let updates: Partial<Debate> = { updatedAt: Date.now() };

    if (debateData.status === DebateStatus.PENDING) {
      // If the debate is pending and the creator leaves, delete or mark as cancelled
      if (isCreator) {
        updates = {
          ...updates,
          status: DebateStatus.COMPLETED, // Or create a CANCELLED status
          forfeitedBy: userId,
        };
      }
    } else if (debateData.status === DebateStatus.ACTIVE) {
      // If debate is active, handle as a forfeit
      const winnerId = isCreator ? debateData.opponentId : debateData.creatorId;

      updates = {
        ...updates,
        status: DebateStatus.COMPLETED,
        winner: winnerId,
        forfeitedBy: userId,
      };
    }

    await updateDoc(debateRef, updates);
  } catch (error) {
    console.error("Error leaving debate:", error);
    throw error;
  }
};

export const forfeitDebate = async (debateId: string, userId: string) => {
  try {
    const debateRef = doc(db, "debates", debateId);

    // Get the current debate data
    const debateSnap = await getDoc(debateRef);
    if (!debateSnap.exists()) {
      throw new Error("Debate not found");
    }

    const debateData = debateSnap.data();

    // Verify the user is a participant
    const isCreator = userId === debateData.creatorId;
    const isOpponent = userId === debateData.opponentId;

    if (!isCreator && !isOpponent) {
      throw new Error("User is not a participant in this debate");
    }

    // Determine the winner (opposite of who forfeited)
    const winnerId = isCreator ? debateData.opponentId : debateData.creatorId;

    // Update the debate
    await updateDoc(debateRef, {
      status: DebateStatus.COMPLETED,
      winner: winnerId,
      forfeitedBy: userId,
      updatedAt: Date.now(),
    });

    return true;
  } catch (error) {
    console.error("Error forfeiting debate:", error);
    throw error;
  }
};

// ARGUMENTS

export const getDebateArguments = async (
  debateId: string
): Promise<Argument[]> => {
  try {
    const q = query(
      collection(db, "arguments"),
      where("debateId", "==", debateId)
    );

    const querySnapshot = await getDocs(q);
    const arguments: Argument[] = [];

    querySnapshot.forEach((doc) => {
      arguments.push({ id: doc.id, ...doc.data() } as Argument);
    });

    // Sort by round and then by createdAt
    return arguments.sort((a, b) => {
      if (a.round !== b.round) {
        return a.round - b.round;
      }
      return a.createdAt - b.createdAt;
    });
  } catch (error) {
    console.error("Error getting debate arguments:", error);
    throw error;
  }
};

export const addArgument = async (
  argument: Omit<Argument, "id" | "createdAt">
): Promise<string> => {
  try {
    const argumentWithTimestamp = {
      ...argument,
      createdAt: Date.now(),
    };

    const docRef = await addDoc(
      collection(db, "arguments"),
      argumentWithTimestamp
    );
    return docRef.id;
  } catch (error) {
    console.error("Error adding argument:", error);
    throw error;
  }
};

// AI ANALYSIS

export const saveArgumentAnalysis = async (
  analysis: Omit<AIAnalysis, "id">
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, "analysis"), analysis);
    return docRef.id;
  } catch (error) {
    console.error("Error saving analysis:", error);
    throw error;
  }
};

export const getArgumentAnalysis = async (
  argumentId: string
): Promise<AIAnalysis | null> => {
  try {
    const q = query(
      collection(db, "analysis"),
      where("argumentId", "==", argumentId)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0]; // Get the first analysis found
    return { id: doc.id, ...doc.data() } as AIAnalysis;
  } catch (error) {
    console.error("Error getting argument analysis:", error);
    throw error;
  }
};
