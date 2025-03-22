// src/app/debates/page.tsx - Updated with refresh dependency
"use client";
import React, { useEffect, useState, Suspense, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getOpenDebates, getUserActiveDebates } from "@/lib/firebase/firestore";
import { Debate, DebateStatus } from "@/types/Debate";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

// Create a separate component that uses useSearchParams
function DebatesContent() {
  const [openDebates, setOpenDebates] = useState<Debate[]>([]);
  const [myDebates, setMyDebates] = useState<Debate[]>([]);
  const [filteredDebates, setFilteredDebates] = useState<Debate[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMyDebates, setLoadingMyDebates] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  
  // Import useSearchParams inside this component
  const { useSearchParams } = require("next/navigation");
  const searchParams = useSearchParams();
  const refreshParam = searchParams ? searchParams.get('refresh') : null;

  // Create a state to trigger refreshes when needed
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch open debates
  const fetchOpenDebates = useCallback(async () => {
    try {
      console.log("Fetching open debates...");
      setLoading(true);
      // Get debates with PENDING status
      const debates = await getOpenDebates();
      console.log("Fetched open debates:", debates.length);
      
      // Log debate details for debugging
      if (debates.length > 0) {
        console.log("Debate topics:", debates.map(d => d.topic));
        console.log("Debate statuses:", debates.map(d => d.status));
      }
      
      setOpenDebates(debates);
      setFilteredDebates(searchTerm ? 
        debates.filter(debate => 
          debate.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
          debate.description.toLowerCase().includes(searchTerm.toLowerCase())
        ) : 
        debates
      );
    } catch (e) {
      console.error("Error fetching debates:", e);
      // Even on error, we should set empty arrays to prevent infinite loading
      setOpenDebates([]);
      setFilteredDebates([]);
    } finally {
      // Always set loading to false, even if there was an error
      setLoading(false);
    }
  }, [searchTerm]);
  
  useEffect(() => {
    fetchOpenDebates();
    
    // Shorter interval for better user experience but not too frequent
    const intervalId = setInterval(fetchOpenDebates, 15000);
    return () => clearInterval(intervalId);
  }, [fetchOpenDebates, refreshTrigger, refreshParam]); // Add refreshTrigger as dependency

  // Fetch user's ongoing debates
  const fetchMyDebates = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setMyDebates([]);
      setLoadingMyDebates(false);
      return;
    }
    
    try {
      setLoadingMyDebates(true);
      console.log("Fetching debates for user:", user.id);
      const debates = await getUserActiveDebates(user.id);
      console.log("Fetched user debates:", debates.length);
      setMyDebates(debates);
    } catch (e) {
      console.error("Error fetching user debates:", e);
      setMyDebates([]);
    } finally {
      setLoadingMyDebates(false);
    }
  }, [isAuthenticated, user]);
  
  useEffect(() => {
    fetchMyDebates();
    
    // Refresh user debates periodically
    const intervalId = setInterval(fetchMyDebates, 15000);
    return () => clearInterval(intervalId);
  }, [fetchMyDebates, refreshTrigger, refreshParam]); // Add refreshTrigger as dependency

  // Filter debates based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredDebates(openDebates);
    } else {
      const filtered = openDebates.filter(debate => 
        debate.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        debate.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDebates(filtered);
    }
  }, [searchTerm, openDebates]);

  const handleJoinDebate = (debateId: string) => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    router.push(`/debates/${debateId}`);
  };

  // Refresh all debates
  const refreshAllDebates = () => {
    setRefreshTrigger(prev => prev + 1); // Increment to trigger useEffect
    fetchOpenDebates();
    if (user) {
      fetchMyDebates();
    }
  };

  // After creating a debate, listen for changes
  useEffect(() => {
    // Check URL for a 'created' parameter indicating a new debate was created
    if (searchParams && searchParams.get('created')) {
      console.log("New debate created, refreshing debates...");
      refreshAllDebates();
    }
  }, [searchParams]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 animate-fade-in">
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

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="browse">Browse Debates</TabsTrigger>
          <TabsTrigger value="ongoing" disabled={!isAuthenticated}>
            My Ongoing Debates
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse" className="space-y-6">
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

          {/* Open Debates List */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Available Debate Rooms</h2>
                
                {/* Refresh button */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refreshAllDebates} 
                  disabled={loading}
                >
                  {loading ? 'Refreshing...' : 'Refresh Debates'}
                </Button>
              </div>
              
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
                  <p className="mt-4 text-gray-600">Loading debates...</p>
                </div>
              ) : filteredDebates.length === 0 ? (
                <div className="bg-gray-50 rounded-lg py-12 px-4 text-center">
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
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No debate rooms available
                  </h3>
                  <p className="mt-1 text-gray-500">
                    {searchTerm ? 
                      "No debates match your search criteria. Try a different search term or create a new debate." : 
                      "There are currently no open debate rooms. Be the first to create one!"}
                  </p>
                  {isAuthenticated && (
                    <Link href="/debates/new" className="mt-6 inline-block">
                      <Button variant="gradient">
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
              ) : (
                <div className="space-y-4">
                  {filteredDebates.map((debate) => (
                    <div key={debate.id} className="border border-gray-200 rounded-lg hover:shadow-md transition-all p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{debate.topic}</h3>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {debate.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mt-2">
                            {/* Side indicators */}
                            {debate.creatorSide === "affirmative" ? (
                              <>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                  Affirmative Available
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                  Negative Needed
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                  Affirmative Needed
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                  Negative Available
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => handleJoinDebate(debate.id)}
                          className="whitespace-nowrap ml-4"
                        >
                          Join Debate
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ongoing" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">My Ongoing Debates</h2>
                
                {/* Refresh button */}
                {isAuthenticated && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchMyDebates}
                    disabled={loadingMyDebates}
                  >
                    {loadingMyDebates ? 'Refreshing...' : 'Refresh'}
                  </Button>
                )}
              </div>
              
              {loadingMyDebates ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
                  <p className="mt-4 text-gray-600">Loading your debates...</p>
                </div>
              ) : myDebates.length === 0 ? (
                <div className="bg-gray-50 rounded-lg py-12 px-4 text-center">
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
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No ongoing debates
                  </h3>
                  <p className="mt-1 text-gray-500">
                    You don't have any active debates at the moment.
                  </p>
                  <Link href="/debates/new" className="mt-6 inline-block">
                    <Button variant="gradient">
                      Start a New Debate
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {myDebates.map((debate) => (
                    <div key={debate.id} className="border border-gray-200 rounded-lg hover:shadow-md transition-all p-4 bg-purple-50">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{debate.topic}</h3>
                          <div className="flex items-center mt-1 text-sm">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                              ${debate.status === DebateStatus.ACTIVE 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"}`}>
                              {debate.status === DebateStatus.ACTIVE 
                                ? "Active" 
                                : "Pending Opponent"}
                            </span>
                            <span className="mx-2">•</span>
                            <span className="text-gray-600">
                              Your side: <span className="font-medium">
                                {user?.id === debate.creatorId 
                                  ? debate.creatorSide === "affirmative" ? "Affirmative" : "Negative"
                                  : debate.creatorSide === "affirmative" ? "Negative" : "Affirmative"}
                              </span>
                            </span>
                            {debate.status === DebateStatus.ACTIVE && (
                              <>
                                <span className="mx-2">•</span>
                                <span className="text-gray-600">
                                  Round: <span className="font-medium">{debate.currentRound}</span>
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <Link href={`/debates/${debate.id}`}>
                          <Button 
                            variant="gradient"
                            className="whitespace-nowrap ml-4"
                          >
                            Continue
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Main component with Suspense
export default function DebatesPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    }>
      <DebatesContent />
    </Suspense>
  );
}