// src/app/debates/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { DebateList } from '@/components/debate/DebateList';
import { getOpenDebates } from '@/lib/firebase/firestore';
import { Debate } from '@/types/Debate';
import { useAuth } from '@/hooks/useAuth';

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
        setError('Failed to load debates. Please try again later.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchDebates();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Open Debates</h1>
        {isAuthenticated && (
          <Link href="/debates/new">
            <Button>Create Debate</Button>
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      ) : (
        <DebateList 
          debates={openDebates} 
          emptyMessage="No open debates found. Be the first to create one!" 
        />
      )}
    </div>
  );
}