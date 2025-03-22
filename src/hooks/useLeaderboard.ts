// src/hooks/useLeaderboard.ts
"use client";

import { useEffect, useState } from 'react';
import { User } from '@/types/User';
import { getAllUsers } from '@/lib/firebase/users';

// Different sorting criteria for the leaderboard
export type SortCriteria = 'points' | 'wins' | 'winRate' | 'debates';

export const useLeaderboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortedUsers, setSortedUsers] = useState<User[]>([]);
  const [sortBy, setSortBy] = useState<SortCriteria>('points');

  // Calculate points for each user
  const calculatePoints = (user: User): number => {
    // Simple point calculation: 3 points per win, -1 per loss
    const wins = user.stats?.wins || 0;
    const losses = user.stats?.losses || 0;
    return (wins * 3) - losses;
  };

  // Calculate win rate percentage
  const calculateWinRate = (user: User): number => {
    const wins = user.stats?.wins || 0;
    const total = user.stats?.totalDebates || 0;
    if (total === 0) return 0;
    return (wins / total) * 100;
  };

  // Load all users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const allUsers = await getAllUsers();
        
        // Calculate and add points to each user
        const usersWithPoints = allUsers.map(user => ({
          ...user,
          stats: {
            ...user.stats,
            points: calculatePoints(user)
          }
        }));
        
        setUsers(usersWithPoints);
      } catch (e) {
        console.error('Error fetching users for leaderboard:', e);
        setError('Failed to load leaderboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Sort users based on the selected criteria
  useEffect(() => {
    if (users.length === 0) return;

    const sorted = [...users].sort((a, b) => {
      switch (sortBy) {
        case 'points':
          return (b.stats?.points || 0) - (a.stats?.points || 0);
        case 'wins':
          return (b.stats?.wins || 0) - (a.stats?.wins || 0);
        case 'winRate':
          return calculateWinRate(b) - calculateWinRate(a);
        case 'debates':
          return (b.stats?.totalDebates || 0) - (a.stats?.totalDebates || 0);
        default:
          return (b.stats?.points || 0) - (a.stats?.points || 0);
      }
    });

    setSortedUsers(sorted);
  }, [users, sortBy]);

  return {
    users: sortedUsers,
    loading,
    error,
    sortBy,
    setSortBy,
    calculateWinRate
  };
};