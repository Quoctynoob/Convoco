// src/lib/firebase/auth.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";
import { User } from "@/types/User";

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
    const userDoc = await getDoc(doc(db, "users", userId));

    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() } as User;
    }

    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};
