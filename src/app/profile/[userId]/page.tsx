// src/app/profile/[userId]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
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
  // Convert to string if it's an array, or use as is if it's already a string
  const userId = Array.isArray(userIdParam) ? userIdParam[0] : userIdParam;
  
  const { user: currentUser, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [user, setUser] = useState<User | null>(null);
  const [debates, setDebates] = useState<Debate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check if viewing own profile
  const isCurrentUser = currentUser?.id === userId;

  // Load user data
  useEffect(() => {
    // If auth is still loading, wait
    if (authLoading) {
      console.log("Auth still loading, waiting...");
      return;
    }
    
    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to login");
      router.push('/auth/login');
      return;
    }
    
    // Handle the case when URL is /profile/me or similar shortcut
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
        // For current user, we can use the data we already have from context
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
        
        // Load debates if we have a valid userId
        if (userId) {
          console.log("Loading user debates");
          const userDebates = await getUserDebates(userId);
          setDebates(userDebates);
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

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Direct use of current user if it's the user's own profile
  // This ensures we always show something even if profile loading fails
  if (isCurrentUser && currentUser && !user) {
    console.log("Fallback to current user data");
    setUser(currentUser);
  }

  // Show error state - but only if we don't have user data
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

  // Show user not found state - should be rare with the fallback above
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Section 1: Debate Statistics with Circle Chart */}
        <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Debate Statistics</h2>
          <div className="flex items-center ">
          {/* Circle chart */}
            <div className="relative">
              <svg width="150" height="150" viewBox="0 0 150 150">
                {/* Background circle */}
                <circle 
                  cx="75" 
                  cy="75" 
                  r={radius} 
                  stroke="#a6a6a6" 
                  strokeWidth="12" 
                  fill="none" 
                />
                
                {/* Progress circle */}
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

              {/* Percentage text */}
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
            {/* Legend */}
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
                  ? winPercentage: 0}%
              </div>
          </div>
        </div>
      </div>
      {/* Section 2: User Profile */}
    <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow">
    <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h1 className="text-xl font-bold mb-4">{user.username}</h1>
        {isCurrentUser && (
              <Link href="/profile/edit">
                <Button variant="outline" className="mt-2 md:mt-0">Edit Profile</Button>
              </Link>
            )}
      </div>
        <div className="flex flex-wrap gap-2 mb-4">
            {/* Display user metadata like gender and location if available */}
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


    {/* Section 3: Past Debates Record */}
    <div className="w-full bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Past Debates</h2>
        {isCurrentUser && (
            <Link href="/debates/new">
              <Button variant="gradient" size="sm">
                Create New Debate
              </Button>
            </Link>
          )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Topic</th>
                <th className="p-3 text-left">Opponent</th>
                <th className="p-3 text-left">Result</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Recent Debates Section */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Debates</h2>
          
          {isCurrentUser && (
            <Link href="/debates/new">
              <Button variant="gradient" size="sm">
                Create New Debate
              </Button>
            </Link>
          )}
        </div>
        
        {debates.length > 0 ? (
          <div className="space-y-4">
            {debates.slice(0, 5).map((debate) => (
              <Link key={debate.id} href={`/debates/${debate.id}`} className="block">
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                  <h3 className="font-semibold text-lg text-gray-900">{debate.topic}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">{debate.description}</p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <span className="font-medium">Format:</span>
                    <span className="ml-1">{debate.rounds} rounds</span>
                    <span className="mx-2">•</span>
                    <span>
                      {debate.status === 'completed' 
                        ? 'Completed' 
                        : debate.status === 'active' 
                        ? 'In Progress' 
                        : 'Pending'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              {isCurrentUser 
                ? "You haven't participated in any debates yet." 
                : "This user hasn't participated in any debates yet."}
            </p>
            {isCurrentUser && (
              <Link href="/debates/new" className="block mt-4">
                <Button variant="outline">Start Your First Debate</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}