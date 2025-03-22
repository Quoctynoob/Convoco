// src/app/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/debates');
  }, [router]);
  
  // Adding a minimal loading state in case the redirect takes a moment
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cobalt"></div>
    </div>
  );
}