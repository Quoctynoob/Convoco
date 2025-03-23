// src/app/profile/[userId]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { getUserProfile } from '@/lib/firebase/auth';
import { getUserDebates } from '@/lib/firebase/firestore';
import { User } from '@/types/User';
import { Debate } from '@/types/Debate';
import { useAuth } from '@/hooks/useAuth';

export default function UserProfilePage() {
  const params = useParams();
  const userIdParam = params.userId;
  const userId = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam;
  const { user: currentUser, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [user, setUser] = useState<User | null>(null);
  const [debates, setDebates] = useState<Debate[]>([]);
  const [filteredDebates, setFilteredDebates] = useState<Debate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [opponents, setOpponents] = useState<{ [key: string]: User | null }>({}); // Store opponent profiles
  
  const isCurrentUser = currentUser?.id === userId;

  // Load user data and debates
  useEffect(() => {
    if (authLoading) {
      console.log("Auth still loading, waiting...");
      return;
    }
    
    if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to login");
      router.push('/auth/login');
      return;
    }
    
    if (userId === 'me' && currentUser) {
      console.log("Redirecting 'me' to actual user ID:", currentUser.id);
      router.push(`/profile/${currentUser.id}`);
      return;
    }

    const loadUserAndDebates = async () => {
      console.log("Loading profile data for userId:", userId);
      setLoading(true);
      setError(null);
      
      try {
        if (isCurrentUser && currentUser) {
          console.log("Using current user data from context");
          setUser(currentUser);
        } else if (userId) {
          console.log("Fetching user profile from database");
          const profile = await getUserProfile(userId);
          if (!profile) {
            console.error("No profile found for userId:", userId);
            setError("User profile not found");
          } else {
            console.log("Profile loaded successfully");
            setUser(profile);
          }
        } else {
          console.error("No userId available");
          setError("User ID is missing");
        }
        
        if (userId) {
          console.log("Loading user debates");
          const userDebates = await getUserDebates(userId);
          setDebates(userDebates);
          setFilteredDebates(userDebates);

          // Fetch opponent profiles for each debate
          const opponentPromises = userDebates.map(async (debate) => {
            const opponentId = debate.creatorId === userId ? debate.opponentId : debate.creatorId;
            if (opponentId) {
              const opponentProfile = await getUserProfile(opponentId);
              return { debateId: debate.id, opponent: opponentProfile };
            }
            return { debateId: debate.id, opponent: null };
          });

          const opponentResults = await Promise.all(opponentPromises);
          const opponentsMap = opponentResults.reduce((acc, { debateId, opponent }) => {
            acc[debateId] = opponent;
            return acc;
          }, {} as { [key: string]: User | null });
          setOpponents(opponentsMap);
        }
      } catch (e) {
        console.error("Error loading profile:", e);
        setError("Failed to load user profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    loadUserAndDebates();
  }, [userId, isCurrentUser, currentUser, authLoading, isAuthenticated, router]);

  // Filter debates based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredDebates(debates);
    } else {
      const filtered = debates.filter((debate) =>
        debate.topic.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDebates(filtered);
    }
  }, [searchTerm, debates]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isCurrentUser && currentUser && !user) {
    console.log("Fallback to current user data");
    setUser(currentUser);
  }

  if (error && !user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Profile</h1>
        <p className="text-gray-500 mb-6">{error}</p>
        <div className="space-y-4">
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
          {isAuthenticated && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Debug Info:</p>
              <p className="text-xs text-gray-400">User ID: {userId}</p>
              <p className="text-xs text-gray-400">Current User ID: {currentUser?.id}</p>
              <p className="text-xs text-gray-400">Is Current User: {isCurrentUser ? "Yes" : "No"}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h1>
        <p className="text-gray-500 mb-6">The user profile you're looking for doesn't exist or has been removed.</p>
        <Link href="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    );
  }

  const winPercentage = Math.round((user.stats.wins / user.stats.totalDebates) * 100);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (winPercentage / 100) * circumference;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Top Section: Debater Image, Statistics, and Profile */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        {/* Left Section: Debater Image and Buttons */}
        <div className="lg:w-1/4 flex flex-col items-center">
          <div className="mb-6">
            <Image
              src="/debater.jpg"
              alt="Debater"
              width={200}
              height={200}
              className="rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-4 w-full">
            {isCurrentUser && (
              <Button
                variant="gradient"
                size="lg"
                className="w-full"
                onClick={() => router.push("/debates/new")}
                disabled={!isCurrentUser}
              >
                Debate!
              </Button>
            )}
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => router.push("/debates")}
            >
              Dashboard
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => router.push("/leaderboard")}
            >
              Leaderboard
            </Button>
          </div>
        </div>

        {/* Middle Section: Debate Statistics */}
        <div className="lg:w-2/5 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Debate Statistics</h2>
          <div className="flex items-center">
            <div className="relative">
              <svg width="150" height="150" viewBox="0 0 150 150">
                <circle 
                  cx="75" 
                  cy="75" 
                  r={radius} 
                  stroke="#a6a6a6" 
                  strokeWidth="12" 
                  fill="none" 
                />
                <circle 
                  cx="75" 
                  cy="75" 
                  r={radius} 
                  stroke="#0F0F0F" 
                  strokeWidth="12" 
                  fill="none" 
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  transform="rotate(-90 75 75)"
                />
                <text 
                  x="75" 
                  y="70" 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  fontSize="24" 
                  fontWeight="bold"
                >
                  {user.stats?.totalDebates || 0}
                </text>
                <text
                  x="75"
                  y="100"
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  fontSize="16" 
                  fontWeight="bold"
                >
                  Total
                </text>
              </svg>
            </div>
            <div className="ml-6">
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 rounded-full bg-black mr-2"></div>
                <p>Wins: {user.stats?.wins || 0}</p>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-[#a6a6a6] mr-2"></div>
                <p>Losses: {user.stats?.losses || 0}</p>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Win Rate: {user.stats && user.stats.totalDebates > 0 
                  ? winPercentage : 0}%
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: User Profile */}
        <div className="lg:w-2/5 bg-white p-6 rounded-lg shadow">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <h1 className="text-xl font-bold mb-4">{user.username}</h1>
            {isCurrentUser && (
              <Link href="/profile/edit">
                <Button variant="outline" className="mt-2 md:mt-0">Edit Profile</Button>
              </Link>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {user.gender && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {user.gender}
              </span>
            )}
            {user.location && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {user.location}
              </span>
            )}
          </div>
          {user.bio ? (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 mb-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">Bio</h2>
              <p className="text-gray-600">{user.bio}</p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 mb-4 text-center italic text-gray-500">
              {isCurrentUser ? 'Add a bio to tell others about yourself' : 'This user has not added a bio yet'}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {user.debateTopics.map((topic, index) => (
              <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Past Debates Section */}
      <div className="w-full bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Past Debate Records</h2>
          <div className="relative mt-4 md:mt-0">
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
              className="form-input pl-10 py-2 w-full md:w-64 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              placeholder="Search past debates..."
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Topic</th>
                <th className="p-3 text-left">Opponent</th>
                <th className="p-3 text-left">Score</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredDebates.length > 0 ? (
                filteredDebates.map((debate) => {
                  const isWinner = debate.winner === userId;
                  const score = isWinner ? 100 : 0;
                  const opponentId = debate.creatorId === userId ? debate.opponentId : debate.creatorId;
                  const opponent = opponentId ? opponents[debate.id] : null;
                  const debateDate = debate.createdAt ? new Date(debate.createdAt).toLocaleDateString() : 'N/A';

                  return (
                    <tr
                      key={debate.id}
                      className={`${
                        isWinner ? 'bg-green-50' : 'bg-red-50'
                      } hover:bg-gray-100 transition-colors duration-200`} // Added hover effect
                    >
                      <td className="p-3">
                        <div>
                          <Link href={`/debates/${debate.id}`} className="text-purple-600 hover:underline">
                            {debate.topic}
                          </Link>
                          <p className="text-xs text-gray-500">
                            {debate.rounds} rounds • {debate.status === 'completed' ? 'Completed' : 'In Progress'}
                          </p>
                        </div>
                      </td>
                      <td className="p-3">
                        {opponent ? (
                          <Link href={`/profile/${opponentId}`} className="text-blue-600 hover:underline">
                            {opponent.username}
                          </Link>
                        ) : (
                          'No Opponent'
                        )}
                      </td>
                      <td className="p-3">{score}%</td>
                      <td className="p-3">{debateDate}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="p-3 text-center text-gray-500">
                    No past debates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}