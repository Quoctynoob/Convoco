// src/lib/firebase/auth.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { User, UserStats } from "@/types/User";

export const registerUser = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Initialize stats for the leaderboard
    const defaultStats: UserStats = {
      wins: 0,
      losses: 0,
      totalDebates: 0,
      points: 0
    };

    // Create a user record in Firestore
    await setDoc(doc(db, "users", user.uid), {
      username,
      email,
      photoURL: user.photoURL,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      gender: "",
      location: "",
      bio: "",
      debateTopics: [],
      stats: defaultStats
    });

    return user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out user:", error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Check if user document exists
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    // If user doesn't exist in Firestore, create a new document
    if (!userDoc.exists()) {
      // Extract username from email or use display name
      const username = user.displayName || user.email?.split("@")[0] || "User";
      
      // Initialize stats for the leaderboard
      const defaultStats: UserStats = {
        wins: 0,
        losses: 0,
        totalDebates: 0,
        points: 0
      };

      await setDoc(userRef, {
        username,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        gender: "",
        location: "",
        bio: "",
        debateTopics: [],
        stats: defaultStats
      });
    }

    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return null;
    }

    const userData = userDoc.data();
    
    // Ensure stats exist with default values
    const stats = userData.stats || {
      wins: 0,
      losses: 0,
      totalDebates: 0,
      points: 0
    };

    return {
      id: userDoc.id,
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
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};