// src/components/debate/DebateList.tsx
"use client";
import React, { useState } from "react";
import { Debate } from "@/types/Debate";
import { DebateCard } from "./DebateCard";
import { useRouter } from "next/navigation";
import { useDebate } from "@/hooks/useDebate";
import { useAuth } from "@/hooks/useAuth";

interface DebateListProps {
  debates: Debate[];
  emptyMessage?: string;
  showFilters?: boolean;
}

export const DebateList: React.FC<DebateListProps> = ({
  debates,
  emptyMessage = "No debates found.",
  showFilters = false,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "popular">("newest");

  // Filter and sort debates
  const filteredDebates = debates
    .filter((debate) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        debate.topic.toLowerCase().includes(searchLower) ||
        debate.description.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return b.createdAt - a.createdAt;
      } else {
        // For "popular", we could use other metrics like participation
        // For now, just using the number of arguments as a proxy for popularity
        const aPopularity = a.arguments?.length || 0;
        const bPopularity = b.arguments?.length || 0;
        return bPopularity - aPopularity;
      }
    });

  const handleJoinDebate = async (debateId: string) => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    // Since we can't use the useDebate hook here with a dynamic ID,
    // we'll navigate to the debate page where the user can join
    router.push(`/debates/${debateId}`);
  };

  if (debates.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-100 shadow-sm">
        <svg
          className="mx-auto h-16 w-16 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          No debates found
        </h3>
        <p className="mt-1 text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showFilters && (
        <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex-grow">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10 w-full"
                placeholder="Search debates by topic or description..."
              />
            </div>
          </div>
          <div className="md:w-48">
            <select
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value as "newest" | "popular")
              }
              className="form-select w-full"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDebates.map((debate) => (
          <DebateCard
            key={debate.id}
            debate={debate}
            onJoin={handleJoinDebate}
          />
        ))}
      </div>
    </div>
  );
};
