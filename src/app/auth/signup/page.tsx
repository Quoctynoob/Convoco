// src/app/auth/signup/page.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignupForm } from "@/components/auth/SignupForm";
import { useAuth } from "@/hooks/useAuth";

export default function SignupPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Join DebateAI</h1>
      <SignupForm />
    </div>
  );
}
