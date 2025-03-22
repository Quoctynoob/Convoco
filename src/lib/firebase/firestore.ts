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
    console.log("Creating debate with data:", JSON.stringify(debate, null, 2));
    
    // Make sure required fields are present
    if (!debate.creatorId) {
      console.error("Missing creatorId in debate data");
      throw new Error("Creator ID is required");
    }
    
    // Make sure the debate object has the creatorSide field
    if (!debate.creatorSide) {
      debate.creatorSide = "affirmative"; // Default to affirmative if not specified
    }
    
    // Make sure status is set correctly
    if (!debate.status) {
      debate.status = DebateStatus.PENDING;
    }
    
    // Ensure arrays are initialized
    if (!debate.arguments) {
      debate.arguments = [];
    }
    
    if (!debate.aiAnalysis) {
      debate.aiAnalysis = [];
    }
    
    // Create the debate document
    const debateRef = await addDoc(collection(db, "debates"), {
      ...debate,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    console.log("Debate created successfully with ID:", debateRef.id);
    
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

export const getOpenDebates = async () => {
  try {
    console.log("Getting open debates with status: PENDING");
    
    // Simplify the query to ensure it works
    const simpleQuery = query(
      collection(db, "debates"),
      where("status", "==", DebateStatus.PENDING)
    );
    
    const querySnapshot = await getDocs(simpleQuery);
    
    console.log(`Found ${querySnapshot.size} open debates with pending status`);
    
    const debates = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Log each debate for debugging
      console.log(`Debate ${doc.id}:`, { id: doc.id, ...data });
      return { id: doc.id, ...data } as Debate;
    });
    
    // If no debates are found with the query, try getting all debates as a fallback
    if (debates.length === 0) {
      console.log("No debates found with query, will log all debates in database:");
      await getAllDebates();
    }
    
    return debates;
  } catch (error) {
    console.error("Error getting open debates:", error);
    
    // Instead of returning an empty array immediately, try getting all debates as a fallback
    console.log("Trying fallback approach to get ALL debates:");
    try {
      const allDebates = await getAllDebates();
      // Filter client-side instead
      return allDebates.filter(debate => debate.status === DebateStatus.PENDING);
    } catch (fallbackError) {
      console.error("Fallback approach also failed:", fallbackError);
      return [];
    }
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
      const data = doc.data();
      
      // Create a proper AIAnalysis object with all required fields
      const analysis: AIAnalysis = {
        id: doc.id,
        argumentId: data.argumentId || '',
        userId: data.userId || '',
        round: data.round || 0,
        content: data.content || '',
        factCheck: data.factCheck || [],
        score: data.score || 0,
        suggestedCounterpoints: data.suggestedCounterpoints || [],
        createdAt: data.createdAt || Date.now()
      };
      
      return analysis;
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

export const leaveDebate = async (debateId: string, userId: string) => {
  try {
    const debateRef = doc(db, "debates", debateId);
    const debateDoc = await getDoc(debateRef);
    
    if (!debateDoc.exists()) {
      throw new Error("Debate not found");
    }
    
    const debate = { id: debateDoc.id, ...debateDoc.data() } as Debate;
    
    // Check if the user is the creator or opponent
    if (debate.creatorId === userId) {
      // If the creator leaves and there's no opponent, mark as abandoned
      if (!debate.opponentId) {
        await updateDoc(debateRef, {
          status: DebateStatus.ABANDONED,
          updatedAt: Date.now(),
        });
      } 
      // If there is an opponent, transfer ownership if debate is still pending
      else if (debate.status === DebateStatus.PENDING) {
        await updateDoc(debateRef, {
          creatorId: debate.opponentId,
          opponentId: null,
          updatedAt: Date.now(),
        });
      }
      // If debate is active or completed, it stays as is - historical record
    } 
    // If opponent leaves
    else if (debate.opponentId === userId) {
      // Remove opponent from the debate
      await updateDoc(debateRef, {
        opponentId: null,
        status: DebateStatus.PENDING, // Reset to pending to allow new opponents
        updatedAt: Date.now(),
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error leaving debate:", error);
    throw error;
  }
};

// Function to check if a debate room should be deleted
// This would be called by a Cloud Function or scheduled task
export const cleanupAbandonedDebates = async () => {
  try {
    // Get debates that have been abandoned for more than 24 hours
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    
    const q = query(
      collection(db, "debates"),
      where("status", "==", DebateStatus.ABANDONED),
      where("updatedAt", "<", oneDayAgo)
    );
    
    const querySnapshot = await getDocs(q);
    
    // Delete each abandoned debate
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    return querySnapshot.docs.length; // Return number of deleted debates
  } catch (error) {
    console.error("Error cleaning up abandoned debates:", error);
    throw error;
  }
};

export const getUserActiveDebates = async (userId: string): Promise<Debate[]> => {
  try {
    console.log("Fetching active debates for userId:", userId);
    
    if (!userId) {
      console.error("getUserActiveDebates called with empty userId");
      return [];
    }
    
    // Get debates where user is creator
    const creatorQuery = query(
      collection(db, "debates"),
      where("creatorId", "==", userId),
      where("status", "in", [DebateStatus.PENDING, DebateStatus.ACTIVE])
    );
    
    // Get debates where user is opponent
    const opponentQuery = query(
      collection(db, "debates"),
      where("opponentId", "==", userId),
      where("status", "in", [DebateStatus.PENDING, DebateStatus.ACTIVE])
    );
    
    // Execute both queries
    const [creatorSnapshot, opponentSnapshot] = await Promise.all([
      getDocs(creatorQuery),
      getDocs(opponentQuery)
    ]);
    
    console.log("Creator debates found:", creatorSnapshot.size);
    console.log("Opponent debates found:", opponentSnapshot.size);
    
    // Combine results
    const creatorDebates = creatorSnapshot.docs.map(doc => {
      console.log("Creator debate data:", doc.id, doc.data());
      return { id: doc.id, ...doc.data() } as Debate;
    });
    
    const opponentDebates = opponentSnapshot.docs.map(doc => {
      console.log("Opponent debate data:", doc.id, doc.data());
      return { id: doc.id, ...doc.data() } as Debate;
    });
    
    // Combine and sort by most recently updated
    const allDebates = [...creatorDebates, ...opponentDebates].sort(
      (a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)
    );
    
    console.log("Total active debates found:", allDebates.length);
    return allDebates;
  } catch (error) {
    console.error("Error getting user's active debates:", error);
    return [];
  }
};

export const getAllDebates = async () => {
  try {
    console.log("Getting ALL debates (for debugging)");
    
    const querySnapshot = await getDocs(collection(db, "debates"));
    
    console.log(`Found ${querySnapshot.size} total debates in the database`);
    
    return querySnapshot.docs.map(doc => {
      console.log(`Debate ${doc.id}:`, doc.data());
      return { id: doc.id, ...doc.data() } as Debate;
    });
  } catch (error) {
    console.error("Error getting all debates:", error);
    return [];
  }
};