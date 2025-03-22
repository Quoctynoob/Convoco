// src/app/profile/[userId]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { DebateList } from '@/components/debate/DebateList';
import { getUserProfile } from '@/lib/firebase/auth';
import { getUserDebates } from '@/lib/firebase/firestore';
import { User } from '@/types/User';
import { Debate } from '@/types/Debate';
import { useAuth } from '@/hooks/useAuth';

export default function UserProfilePage() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  
  const [user, setUser] = useState<User | null>(null);
  const [debates, setDebates] = useState<Debate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isCurrentUser = currentUser?.id === userId;

  useEffect(() => {
    const loadUserAndDebates = async () => {
      setLoading(true);
      try {
        // Load user profile
        const profile = await getUserProfile(userId);
        setUser(profile);
        
        if (profile) {
          // Load user's debates
          const userDebates = await getUserDebates(userId);
          setDebates(userDebates);
        }
      } catch (e) {
        console.error('Error loading profile:', e);
        setError('Failed to load user profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadUserAndDebates();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !user) {
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="md:w-1/4">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.username}
              className="h-32 w-32 rounded-full mx-auto"
            />
          ) : (
            <div className="h-32 w-32 rounded-full bg-purple-500 flex items-center justify-center text-white text-4xl font-bold mx-auto">
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <div className="md:w-3/4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.username}</h1>
              {user.bio && (
                <p className="mt-2 text-gray-500">{user.bio}</p>
              )}
            </div>
            
            {isCurrentUser && (
              <Link href="/profile/edit">
                <Button variant="outline">Edit Profile</Button>
              </Link>
            )}
          </div>
          
          <div className="mt-6 grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-purple-600">{user.stats.totalDebates}</div>
                <div className="text-sm text-gray-500 mt-1">Total Debates</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-green-600">{user.stats.wins}</div>
                <div className="text-sm text-gray-500 mt-1">Wins</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-red-600">{user.stats.losses}</div>
                <div className="text-sm text-gray-500 mt-1">Losses</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {user.debateTopics && user.debateTopics.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Topics Interested In</h2>
          <div className="flex flex-wrap gap-2">
            {user.debateTopics.map((topic, index) => (
              <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">{isCurrentUser ? 'Your Debates' : 'User Debates'}</h2>
        <DebateList
          debates={debates}
          emptyMessage={isCurrentUser ? "You haven't participated in any debates yet." : "This user hasn't participated in any debates yet."}
        />
      </div>
    </div>
  );
}
