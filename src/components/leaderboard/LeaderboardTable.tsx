// src/components/leaderboard/LeaderboardTable.tsx
"use client";

import React from 'react';
import { User } from '@/types/User';
import Link from 'next/link';
import { SortCriteria } from '@/hooks/useLeaderboard';

interface LeaderboardTableProps {
  users: User[];
  currentUserId?: string;
  sortBy: SortCriteria;
  calculateWinRate: (user: User) => number;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ 
  users, 
  currentUserId,
  sortBy,
  calculateWinRate
}) => {
  // Map header labels based on sort criteria
  const getSortLabel = (): string => {
    switch (sortBy) {
      case 'points': return 'Points';
      case 'wins': return 'Wins';
      case 'winRate': return 'Win Rate';
      case 'debates': return 'Debates';
      default: return 'Points';
    }
  };

  // Get value to display based on sort criteria
  const getSortValue = (user: User): string | number => {
    switch (sortBy) {
      case 'points': return user.stats?.points || 0;
      case 'wins': return user.stats?.wins || 0;
      case 'winRate': return `${calculateWinRate(user).toFixed(1)}%`;
      case 'debates': return user.stats?.totalDebates || 0;
      default: return user.stats?.points || 0;
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rank
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Debates
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              W - L
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {getSortLabel()}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user, index) => (
            <tr 
              key={user.id} 
              className={`${currentUserId === user.id ? 'bg-purple-50' : (index % 2 === 0 ? 'bg-white' : 'bg-gray-50')}`}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className={`
                    flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-white font-bold
                    ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-700' : 'bg-gray-300 text-gray-700'}
                  `}>
                    {index + 1}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {user.photoURL ? (
                      <img className="h-10 w-10 rounded-full" src={user.photoURL} alt={user.username} />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <Link href={`/profile/${user.id}`} className="text-sm font-medium text-gray-900 hover:text-purple-600">
                      {user.username}
                    </Link>
                    {currentUserId === user.id && (
                      <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        You
                      </span>
                    )}
                    {user.location && (
                      <div className="text-xs text-gray-500">
                        {user.location}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.stats?.totalDebates || 0}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-900">
                  {user.stats?.wins || 0} - {user.stats?.losses || 0}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full 
                  ${sortBy === 'points' 
                    ? 'bg-blue-100 text-blue-800' 
                    : sortBy === 'wins'
                    ? 'bg-green-100 text-green-800'
                    : sortBy === 'winRate'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-100 text-gray-800'
                  }`}>
                  {getSortValue(user)}
                </span>
              </td>
            </tr>
          ))}
          
          {users.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                No users found. Be the first to join the leaderboard!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;