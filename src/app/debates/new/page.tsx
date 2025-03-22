// src/app/debates/new/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { DebateForm } from "@/components/debate/DebateForm";
import { useAuth } from "@/hooks/useAuth";

export default function CreateDebatePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-900">
        Create a New Debate
      </h1>
      <p className="text-center text-gray-500 max-w-2xl mx-auto">
        Define your debate topic, provide context, and set the number of rounds.
        Other users will be able to join your debate.
      </p>

      <DebateForm />
    </div>
  );
}
