// src/app/debates/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getOpenDebates } from "@/lib/firebase/firestore";
import { Debate } from "@/types/Debate";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import { SimpleDebateList } from "@/components/debate/SimpleDebateList";

export default function DebatesPage() {
  const [debates, setDebates] = useState<Debate[]>([]);
  const [filteredDebates, setFilteredDebates] = useState<Debate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchDebates = async () => {
      try {
        const debates = await getOpenDebates();
        setDebates(debates);
        setFilteredDebates(debates);
      } catch (e) {
        setError("Failed to load debates. Please try again later.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDebates();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredDebates(debates);
    } else {
      const filtered = debates.filter(debate => 
        debate.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        debate.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDebates(filtered);
    }
  }, [searchTerm, debates]);

  const handleJoinDebate = (debateId: string) => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    router.push(`/debates/${debateId}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Dashboard Header with Create Button */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Debate Dashboard</h1>
          <p className="mt-2 text-gray-600 max-w-2xl">
            Join an existing debate or create your own to improve your debating skills
          </p>
        </div>
        
        {isAuthenticated && (
          <Link href="/debates/new">
            <Button 
              variant="gradient" 
              size="lg" 
              className="whitespace-nowrap shadow-sm font-semibold"
            >
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
              Create New Debate
            </Button>
          </Link>
        )}
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg 
              className="h-5 w-5 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10 py-3 w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            placeholder="Search for debate topics..."
          />
        </div>
      </Card>

      {/* Debates List */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-4">Available Debate Rooms</h2>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
              <p className="mt-4 text-gray-600">Loading debates...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center py-12">
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
            </div>
          ) : (
            <SimpleDebateList 
              debates={filteredDebates} 
              onJoinDebate={handleJoinDebate}
              emptyMessage={
                searchTerm 
                  ? "No debates found matching your search criteria." 
                  : "No debates available. Be the first to create one!"
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}