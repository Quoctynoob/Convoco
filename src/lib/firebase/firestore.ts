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

/**
 * Fetch all open debates that are available for joining
 * @returns Promise<Debate[]> Array of open debates
 */
export const getOpenDebates = async (): Promise<Debate[]> => {
  try {
    console.log("Fetching open debates...");
    const debatesRef = collection(db, "debates");
    
    // Create a query specifically for PENDING debates
    const q = query(
      debatesRef,
      where("status", "==", DebateStatus.PENDING),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    console.log(`Found ${querySnapshot.size} pending debates`);
    
    const debates: Debate[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      debates.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt || Date.now(),
        updatedAt: data.updatedAt || Date.now(),
        // Ensure required fields are present even if null
        opponentId: data.opponentId || null,
        winner: data.winner || null,
        forfeitedBy: data.forfeitedBy || null,
        arguments: data.arguments || [],
        aiAnalysis: data.aiAnalysis || [],
      } as Debate);
    });
    
    return debates;
  } catch (error) {
    console.error("Error fetching open debates:", error);
    return [];
  }
};

/**
 * Get active debates for a specific user
 * @param userId User ID to fetch debates for
 * @returns Promise<Debate[]> Array of user's active debates
 */
export const getUserActiveDebates = async (userId: string): Promise<Debate[]> => {
  try {
    console.log(`Fetching active debates for user: ${userId}`);
    const debatesRef = collection(db, "debates");
    
    // Get debates where user is either creator or opponent
    // and status is either PENDING or ACTIVE
    const q = query(
      debatesRef,
      where("status", "in", [DebateStatus.PENDING, DebateStatus.ACTIVE]),
      where("creatorId", "==", userId)
    );
    
    const q2 = query(
      debatesRef,
      where("status", "in", [DebateStatus.ACTIVE]),
      where("opponentId", "==", userId)
    );
    
    // Execute both queries
    const [creatorDebatesSnapshot, opponentDebatesSnapshot] = await Promise.all([
      getDocs(q),
      getDocs(q2)
    ]);
    
    // Process results from both queries
    const debates: Debate[] = [];
    
    creatorDebatesSnapshot.forEach((doc) => {
      const data = doc.data();
      debates.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt || Date.now(),
        updatedAt: data.updatedAt || Date.now(),
      } as Debate);
    });
    
    opponentDebatesSnapshot.forEach((doc) => {
      // Avoid adding duplicates if a user is somehow both creator and opponent
      if (!debates.some(d => d.id === doc.id)) {
        const data = doc.data();
        debates.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt || Date.now(),
          updatedAt: data.updatedAt || Date.now(),
        } as Debate);
      }
    });
    
    // Sort by most recently created
    debates.sort((a, b) => b.createdAt - a.createdAt);
    
    return debates;
  } catch (error) {
    console.error(`Error fetching active debates for user ${userId}:`, error);
    return [];
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
    const debateArguments: Argument[] = []; // Changed from 'arguments' to 'debateArguments'

    querySnapshot.forEach((doc) => {
      debateArguments.push({ id: doc.id, ...doc.data() } as Argument);
    });

    // Sort by round and then by createdAt
    return debateArguments.sort((a, b) => {
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
