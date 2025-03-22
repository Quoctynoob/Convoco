// src/hooks/useAuth.ts
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  registerUser,
  loginUser,
  logoutUser,
  resetPassword,
} from "@/lib/firebase/auth";
import { useAuth as useAuthContext } from "@/context/AuthContext";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuthContext();
  const router = useRouter();

  const signup = async (email: string, password: string, username: string) => {
    setLoading(true);
    setError(null);
    try {
      await registerUser(email, password, username);
      router.push("/");
      return true;
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Unknown error during signup";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await loginUser(email, password);
      router.push("/");
      return true;
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Unknown error during login";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      router.push("/");
      return true;
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Unknown error during logout";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await resetPassword(email);
      return true;
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Unknown error resetting password";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    user: auth.user,
    firebaseUser: auth.firebaseUser,
    loading: loading || auth.loading,
    error,
    signup,
    login,
    logout,
    forgotPassword,
    isAuthenticated: !!auth.user,
  };
};
