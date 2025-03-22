// src/lib/firebase/firestore.ts
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import { Debate, DebateStatus } from "@/types/Debate";
import { Argument, AIAnalysis } from "@/types/Argument";
import { User } from "@/types/User";

// Debates
export const createDebate = async (
  debate: Omit<Debate, "id" | "createdAt" | "updatedAt">
) => {
  try {
    const debateRef = await addDoc(collection(db, "debates"), {
      ...debate,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return debateRef.id;
  } catch (error) {
    console.error("Error creating debate:", error);
    throw error;
  }
};

export const getDebateById = async (
  debateId: string
): Promise<Debate | null> => {
  try {
    const debateDoc = await getDoc(doc(db, "debates", debateId));

    if (debateDoc.exists()) {
      return { id: debateDoc.id, ...debateDoc.data() } as Debate;
    }

    return null;
  } catch (error) {
    console.error("Error getting debate:", error);
    throw error;
  }
};

export const getOpenDebates = async (
  lastDebate?: DocumentSnapshot,
  pageSize: number = 10
) => {
  try {
    let q = query(
      collection(db, "debates"),
      where("status", "==", DebateStatus.PENDING),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );

    if (lastDebate) {
      q = query(q, startAfter(lastDebate));
    }

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Debate)
    );
  } catch (error) {
    console.error("Error getting open debates:", error);
    throw error;
  }
};

export const getUserDebates = async (
  userId: string,
  lastDebate?: DocumentSnapshot,
  pageSize: number = 10
) => {
  try {
    let q = query(
      collection(db, "debates"),
      where("creatorId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );

    if (lastDebate) {
      q = query(q, startAfter(lastDebate));
    }

    const querySnapshot = await getDocs(q);
    const createdDebates = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Debate)
    );

    // Get debates where user is an opponent
    q = query(
      collection(db, "debates"),
      where("opponentId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );

    if (lastDebate) {
      q = query(q, startAfter(lastDebate));
    }

    const opponentSnapshot = await getDocs(q);
    const participatedDebates = opponentSnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Debate)
    );

    return [...createdDebates, ...participatedDebates].sort(
      (a, b) => b.updatedAt - a.updatedAt
    );
  } catch (error) {
    console.error("Error getting user debates:", error);
    throw error;
  }
};

export const updateDebate = async (debateId: string, data: Partial<Debate>) => {
  try {
    const debateRef = doc(db, "debates", debateId);
    await updateDoc(debateRef, {
      ...data,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error("Error updating debate:", error);
    throw error;
  }
};

// Arguments
export const addArgument = async (
  argument: Omit<Argument, "id" | "createdAt">
) => {
  try {
    const argumentRef = await addDoc(collection(db, "arguments"), {
      ...argument,
      createdAt: Date.now(),
    });

    return argumentRef.id;
  } catch (error) {
    console.error("Error adding argument:", error);
    throw error;
  }
};

export const getDebateArguments = async (
  debateId: string
): Promise<Argument[]> => {
  try {
    const q = query(
      collection(db, "arguments"),
      where("debateId", "==", debateId),
      orderBy("round"),
      orderBy("createdAt")
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Argument)
    );
  } catch (error) {
    console.error("Error getting debate arguments:", error);
    throw error;
  }
};

// AI Analysis
export const addAIAnalysis = async (
  analysis: Omit<AIAnalysis, "id" | "createdAt">
) => {
  try {
    const analysisRef = await addDoc(collection(db, "analyses"), {
      ...analysis,
      createdAt: Date.now(),
    });

    return analysisRef.id;
  } catch (error) {
    console.error("Error adding AI analysis:", error);
    throw error;
  }
};

export const getArgumentAnalysis = async (
  argumentId: string
): Promise<AIAnalysis | null> => {
  try {
    const q = query(
      collection(db, "analyses"),
      where("argumentId", "==", argumentId),
      limit(1)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as AIAnalysis;
    }

    return null;
  } catch (error) {
    console.error("Error getting argument analysis:", error);
    throw error;
  }
};

// Update user stats
export const updateUserStats = async (userId: string, won: boolean) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data() as User;
      const stats = userData.stats || { wins: 0, losses: 0, totalDebates: 0 };

      await updateDoc(userRef, {
        stats: {
          wins: won ? stats.wins + 1 : stats.wins,
          losses: won ? stats.losses : stats.losses + 1,
          totalDebates: stats.totalDebates + 1,
        },
        updatedAt: Date.now(),
      });
    }
  } catch (error) {
    console.error("Error updating user stats:", error);
    throw error;
  }
};
