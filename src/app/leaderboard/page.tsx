// src/app/leaderboard/page.tsx
"use client";

import React from "react";
import { useLeaderboard, SortCriteria } from "@/hooks/useLeaderboard";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import LeaderboardStats from "@/components/leaderboard/LeaderboardStats";

export default function LeaderboardPage() {
  const { users, loading, error, sortBy, setSortBy, calculateWinRate } = useLeaderboard();
  const { user } = useAuth();

  const handleTabChange = (value: string) => {
    setSortBy(value as SortCriteria);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Error Loading Leaderboard</h3>
            <p className="mt-2 text-gray-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Debate Leaderboard</h1>
        <p className="mt-2 text-gray-600">See how debaters rank against each other based on different metrics.</p>
      </div>

      {/* Stats Cards */}
      <LeaderboardStats users={users} />

      {/* Tabs and Table */}
      <Tabs defaultValue="points" className="w-full">
        <div className="bg-white p-4 rounded-t-lg border border-gray-200 border-b-0">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Rankings</h2>
          <TabsList className="grid grid-cols-4 gap-4">
            <TabsTrigger value="points" onClick={() => setSortBy('points')}>
              <div className="flex flex-col items-center">
                <span className="text-sm font-medium">Points</span>
                <span className="text-xs text-gray-500">Overall Score</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="wins" onClick={() => setSortBy('wins')}>
              <div className="flex flex-col items-center">
                <span className="text-sm font-medium">Wins</span>
                <span className="text-xs text-gray-500">Total Victories</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="winRate" onClick={() => setSortBy('winRate')}>
              <div className="flex flex-col items-center">
                <span className="text-sm font-medium">Win Rate</span>
                <span className="text-xs text-gray-500">Win Percentage</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="debates" onClick={() => setSortBy('debates')}>
              <div className="flex flex-col items-center">
                <span className="text-sm font-medium">Activity</span>
                <span className="text-xs text-gray-500">Total Debates</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="points">
          <LeaderboardTable 
            users={users} 
            currentUserId={user?.id} 
            sortBy="points"
            calculateWinRate={calculateWinRate}
          />
        </TabsContent>
        
        <TabsContent value="wins">
          <LeaderboardTable 
            users={users} 
            currentUserId={user?.id}
            sortBy="wins"
            calculateWinRate={calculateWinRate}
          />
        </TabsContent>
        
        <TabsContent value="winRate">
          <LeaderboardTable 
            users={users.filter(u => (u.stats?.totalDebates || 0) > 0)} 
            currentUserId={user?.id}
            sortBy="winRate"
            calculateWinRate={calculateWinRate}
          />
          <div className="mt-2 text-sm text-gray-500 bg-gray-50 p-2 rounded-b-lg border border-t-0 border-gray-200">
            Note: Only users who have participated in at least one debate are included in the Win Rate ranking.
          </div>
        </TabsContent>
        
        <TabsContent value="debates">
          <LeaderboardTable 
            users={users} 
            currentUserId={user?.id}
            sortBy="debates"
            calculateWinRate={calculateWinRate}
          />
        </TabsContent>
      </Tabs>
      
      {/* Description */}
      <div className="mt-8 bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">How Points Are Calculated</h3>
        <p className="text-gray-600 mb-4">
          Points are calculated based on your debate performance to determine your ranking on the leaderboard.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <div className="text-green-700 font-semibold mb-2">Win: +3 Points</div>
            <p className="text-green-600 text-sm">
              Winning a debate earns you 3 points, rewarding successful arguments and persuasive skills.
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <div className="text-red-700 font-semibold mb-2">Loss: -1 Point</div>
            <p className="text-red-600 text-sm">
              Losing a debate deducts 1 point, encouraging participation while maintaining competitive integrity.
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="text-blue-700 font-semibold mb-2">Activity Matters</div>
            <p className="text-blue-600 text-sm">
              The more debates you participate in, the more opportunities you have to earn points and improve your ranking.
            </p>
          </div>
        </div>
      </div>
      
      {/* Tips for Climbing the Ranks */}
      <div className="mt-8 bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Tips for Climbing the Ranks</h3>
        
        <div className="space-y-4">
          <div className="flex">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center mr-3">
              <span className="text-purple-800 text-sm font-bold">1</span>
            </div>
            <div>
              <h4 className="text-md font-medium text-gray-900">Participate Regularly</h4>
              <p className="text-sm text-gray-600">The more debates you join, the more opportunities you have to earn points.</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center mr-3">
              <span className="text-purple-800 text-sm font-bold">2</span>
            </div>
            <div>
              <h4 className="text-md font-medium text-gray-900">Use Evidence and Logic</h4>
              <p className="text-sm text-gray-600">Support your arguments with facts and clear reasoning to increase your chances of winning.</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center mr-3">
              <span className="text-purple-800 text-sm font-bold">3</span>
            </div>
            <div>
              <h4 className="text-md font-medium text-gray-900">Address Counterarguments</h4>
              <p className="text-sm text-gray-600">Directly responding to your opponent's points shows critical thinking and strengthens your position.</p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center mr-3">
              <span className="text-purple-800 text-sm font-bold">4</span>
            </div>
            <div>
              <h4 className="text-md font-medium text-gray-900">Learn from Feedback</h4>
              <p className="text-sm text-gray-600">Review the AI analysis after each debate to identify areas for improvement in your argumentation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}