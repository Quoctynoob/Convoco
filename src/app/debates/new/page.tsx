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
    <div className="space-y-6 max-w-5xl mx-auto px-4 pt-12">
      <DebateForm />
    </div>
  );
}