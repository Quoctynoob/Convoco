// src/components/layout/Footer.tsx
import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-900"
            >
              Home
            </Link>
            <Link 
              href="/debates" 
              className="text-gray-600 hover:text-gray-900"
            >
              Debates
            </Link>
            <Link 
              href="/about" 
              className="text-gray-600 hover:text-gray-900"
            >
              About
            </Link>
            <Link 
              href="/terms" 
              className="text-gray-600 hover:text-gray-900"
            >
              Terms
            </Link>
            <Link 
              href="/privacy" 
              className="text-gray-600 hover:text-gray-900"
            >
              Privacy
            </Link>
          </div>
          <div className="mt-8 md:mt-0">
            <p className="text-center md:text-right text-sm text-gray-500">
              &copy; {new Date().getFullYear()} DebateAI. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
