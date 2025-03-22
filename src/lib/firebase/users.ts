// src/lib/firebase/users.ts
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "./firebase";
import { User } from "@/types/User";

/**
 * Fetches all registered users from Firestore
 * @returns Promise<User[]> An array of user objects
 */
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);
    
    const users: User[] = [];
    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      
      // Ensure stats exist with default values if not present
      const stats = userData.stats || {
        wins: 0,
        losses: 0,
        totalDebates: 0,
        points: 0
      };
      
      users.push({
        id: doc.id,
        username: userData.username || "Anonymous",
        email: userData.email || "",
        photoURL: userData.photoURL || null,
        createdAt: userData.createdAt || Date.now(),
        updatedAt: userData.updatedAt || Date.now(),
        gender: userData.gender || "",
        location: userData.location || "",
        bio: userData.bio || "",
        debateTopics: userData.debateTopics || [],
        stats: stats
      });
    });
    
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
};

/**
 * Fetches top users ranked by wins
 * @param limit Number of users to fetch
 * @returns Promise<User[]> An array of top users
 */
export const getTopUsers = async (limitCount = 10): Promise<User[]> => {
  try {
    // Note: This assumes you have a "stats.wins" field to order by
    // You might need to adjust the query based on your actual data structure
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("stats.wins", "desc"), limit(limitCount));
    const usersSnapshot = await getDocs(q);
    
    const users: User[] = [];
    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      
      // Ensure stats exist with default values
      const stats = userData.stats || {
        wins: 0,
        losses: 0,
        totalDebates: 0,
        points: 0
      };
      
      users.push({
        id: doc.id,
        username: userData.username || "Anonymous",
        email: userData.email || "",
        photoURL: userData.photoURL || null,
        createdAt: userData.createdAt || Date.now(),
        updatedAt: userData.updatedAt || Date.now(),
        gender: userData.gender || "",
        location: userData.location || "",
        bio: userData.bio || "",
        debateTopics: userData.debateTopics || [],
        stats: stats
      });
    });
    
    return users;
  } catch (error) {
    console.error("Error fetching top users:", error);
    throw new Error("Failed to fetch top users");
  }
};