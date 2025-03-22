// src/components/debate/ArgumentInput.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface ArgumentInputProps {
  onSubmit: (content: string) => void;
  loading: boolean;
  round: number;
  maxLength: number;
}

export const ArgumentInput: React.FC<ArgumentInputProps> = ({
  onSubmit,
  loading,
  round,
  maxLength,
}) => {
  const [content, setContent] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !loading) {
      onSubmit(content.trim());
      setContent('');
    }
  };
  
  const remainingChars = maxLength - content.length;
  const isOverLimit = remainingChars < 0;
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-medium">Your Argument - Round {round}</h3>
      
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Present your argument here. Make your case with compelling evidence and clear reasoning."
          rows={8}
          className={`w-full p-2 border rounded-md ${isOverLimit ? 'border-red-500' : ''}`}
          disabled={loading}
        />
        <div className={`text-sm mt-1 text-right ${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
          {remainingChars} characters remaining
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          type="submit"
          disabled={loading || !content.trim() || isOverLimit}
        >
          {loading ? 'Submitting...' : 'Submit Argument'}
        </Button>
      </div>
    </form>
  );
};