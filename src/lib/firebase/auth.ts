// src/lib/firebase/auth.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";
import { User } from "@/types/User";

// Google provider
const googleProvider = new GoogleAuthProvider();

export const registerUser = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Update profile with username
    await updateProfile(user, { displayName: username });

    // Create user document in Firestore
    const newUser: Omit<User, "id"> = {
      username,
      email,
      photoURL: user.photoURL || "",
      bio: "",
      debateTopics: [],
      stats: {
        wins: 0,
        losses: 0,
        totalDebates: 0,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await setDoc(doc(db, "users", user.uid), newUser);
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
    console.error("Error logging in:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out:", error);
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

export const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    console.log("Getting user profile for userId:", userId);
    
    if (!userId) {
      console.error("getUserProfile called with empty userId");
      return null;
    }
    
    const userDoc = await getDoc(doc(db, "users", userId));

    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log("User data found in Firestore");
      
      // Ensure stats exists to prevent errors
      if (!userData.stats) {
        userData.stats = {
          wins: 0,
          losses: 0,
          totalDebates: 0
        };
      }
      
      // Make sure all required fields have defaults
      const userWithDefaults = {
        id: userDoc.id,
        username: userData.username || 'User',
        email: userData.email || '',
        photoURL: userData.photoURL || '',
        bio: userData.bio || '',
        gender: userData.gender || '',
        location: userData.location || '',
        debateTopics: userData.debateTopics || [],
        stats: userData.stats,
        createdAt: userData.createdAt || Date.now(),
        updatedAt: userData.updatedAt || Date.now()
      };
      
      return userWithDefaults as User;
    }

    console.error("No user document found for userId:", userId);
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

// Google authentication
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if the user already exists in Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (!userDoc.exists()) {
      // Create new user document if they don't exist
      const newUser: Omit<User, "id"> = {
        username: user.displayName || user.email?.split("@")[0] || "User",
        email: user.email || "",
        photoURL: user.photoURL || "",
        bio: "",
        debateTopics: [],
        stats: {
          wins: 0,
          losses: 0,
          totalDebates: 0,
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await setDoc(doc(db, "users", user.uid), newUser);
    }

    return user;
  } catch (error) {
    console.error("Error with Google sign in:", error);
    throw error;
  }
};
