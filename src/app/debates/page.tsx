// src/app/debates/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { DebateList } from "@/components/debate/DebateList";
import { getOpenDebates } from "@/lib/firebase/firestore";
import { Debate } from "@/types/Debate";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/Card";

export default function DebatesPage() {
  const [openDebates, setOpenDebates] = useState<Debate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchDebates = async () => {
      try {
        const debates = await getOpenDebates();
        setOpenDebates(debates);
      } catch (e) {
        setError("Failed to load debates. Please try again later.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDebates();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Explore Debates</h1>
          <p className="mt-2 text-gray-600 max-w-2xl">
            Browse through ongoing and open debates or create your own to
            improve your skills with real opponents and AI feedback.
          </p>
        </div>
        {isAuthenticated && (
          <Link href="/debates/new">
            <Button variant="gradient" className="whitespace-nowrap shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Create Debate
            </Button>
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
          <p className="mt-4 text-gray-600">Loading debates...</p>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <div className="p-4 rounded-full bg-red-100 text-red-600 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Error Loading Debates
            </h3>
            <p className="mt-2 text-gray-600">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100 transform transition-all hover:-translate-y-1 hover:shadow-md">
              <CardContent className="flex flex-col items-center text-center p-8">
                <div className="p-4 rounded-full bg-purple-100 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Open Debates
                </h3>
                <p className="mt-2 text-gray-600">
                  Join debates that are waiting for an opponent and practice
                  your skills
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100 transform transition-all hover:-translate-y-1 hover:shadow-md">
              <CardContent className="flex flex-col items-center text-center p-8">
                <div className="p-4 rounded-full bg-blue-100 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Active Debates
                </h3>
                <p className="mt-2 text-gray-600">
                  Watch ongoing debates and learn from others' arguments and
                  strategies
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100 transform transition-all hover:-translate-y-1 hover:shadow-md">
              <CardContent className="flex flex-col items-center text-center p-8">
                <div className="p-4 rounded-full bg-green-100 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Completed Debates
                </h3>
                <p className="mt-2 text-gray-600">
                  Review finished debates with AI analysis and judge decisions
                </p>
              </CardContent>
            </Card>
          </div>

          <DebateList
            debates={openDebates}
            emptyMessage="No open debates found. Be the first to create one!"
            showFilters={true}
          />
        </div>
      )}
    </div>
  );
}
