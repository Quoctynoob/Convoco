"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Debate, DebateStatus } from "@/types/Debate";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

function DebatesContent() {
  const [openDebates, setOpenDebates] = useState<Debate[]>([]);
  const [myDebates, setMyDebates] = useState<Debate[]>([]);
  const [filteredDebates, setFilteredDebates] = useState<Debate[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMyDebates, setLoadingMyDebates] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Real-time listener for open debates
  useEffect(() => {
    const q = query(
      collection(db, "debates"),
      where("status", "==", DebateStatus.PENDING)
    );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const debates = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Debate)
        );
        setOpenDebates(debates);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching open debates:", error);
        setOpenDebates([]);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Real-time listener for user's ongoing debates
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setMyDebates([]);
      setLoadingMyDebates(false);
      return;
    }

    const q1 = query(
      collection(db, "debates"),
      where("creatorId", "==", user.id),
      where("status", "!=", DebateStatus.COMPLETED)
    );

    const q2 = query(
      collection(db, "debates"),
      where("opponentId", "==", user.id),
      where("status", "!=", DebateStatus.COMPLETED)
    );

    const unsubscribe1 = onSnapshot(
      q1,
      (querySnapshot) => {
        const debates = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Debate)
        );
        setMyDebates((prev) => {
          const otherDebates = prev.filter((d) => d.opponentId !== user.id);
          return [...otherDebates, ...debates];
        });
        setLoadingMyDebates(false);
      },
      (error) => {
        console.error("Error fetching creator debates:", error);
        setLoadingMyDebates(false);
      }
    );

    const unsubscribe2 = onSnapshot(
      q2,
      (querySnapshot) => {
        const debates = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Debate)
        );
        setMyDebates((prev) => {
          const otherDebates = prev.filter((d) => d.creatorId !== user.id);
          return [...otherDebates, ...debates];
        });
        setLoadingMyDebates(false);
      },
      (error) => {
        console.error("Error fetching opponent debates:", error);
        setLoadingMyDebates(false);
      }
    );

    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, [isAuthenticated, user]);

  // Filter open debates based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredDebates(openDebates);
    } else {
      const filtered = openDebates.filter(
        (debate) =>
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

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 animate-fade-in">
      {/* Dashboard Header with Create Button */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Debate Dashboard</h1>
          <p className="mt-2 text-gray-600 max-w-2xl">
            Join an existing debate or create your own to improve your debating
            skills
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
              <h2 className="text-xl font-semibold mb-4">
                Available Debate Rooms
              </h2>

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
                    {searchTerm
                      ? "No debates match your search criteria. Try a different search term or create a new debate."
                      : "There are currently no open debate rooms. Be the first to create one!"}
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
                    <div
                      key={debate.id}
                      className="border border-gray-200 rounded-lg hover:shadow-md transition-all p-4"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {debate.topic}
                          </h3>
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
                                  Negative Available
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                  Negative Available
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                  Affirmative Available
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <Button
                          onClick={() => handleJoinDebate(debate.id)}
                          variant="outline"
                          size="sm"
                          className="ml-4"
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

        <TabsContent value="ongoing" className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-4">My Ongoing Debates</h2>

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
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    No ongoing debates
                  </h3>
                  <p className="mt-1 text-gray-500">
                    You are not currently participating in any debates. Create a
                    new debate or join an existing one.
                  </p>
                  <Link href="/debates/new" className="mt-6 inline-block">
                    <Button variant="gradient">Create New Debate</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {myDebates.map((debate) => (
                    <div
                      key={debate.id}
                      className="border border-gray-200 rounded-lg hover:shadow-md transition-all p-4"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {debate.topic}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {debate.description}
                          </p>
                          <div className="flex items-center mt-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                debate.status === DebateStatus.PENDING
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {debate.status}
                            </span>
                          </div>
                        </div>
                        <Link href={`/debates/${debate.id}`}>
                          <Button variant="outline" size="sm" className="ml-4">
                            View Debate
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

export default DebatesContent;
