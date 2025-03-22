// src/components/layout/Footer.tsx - Convoco Footer
import React from "react";
import Link from "next/link";
export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-lg bg-black flex items-center justify-center text-white font-bold text-xl">
                C
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent  bg-black">
                Convoco
              </span>
            </Link>
            <p className="mt-4 text-gray-500">
              Practice structured debates with AI-powered feedback and
              moderation on Convoco.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Navigation</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/debates"
                  className="text-gray-500 hover:text-purple-600"
                >
                  Debates
                </Link>
              </li>
              <li>
                <Link
                  href="/debates/new"
                  className="text-gray-500 hover:text-purple-600"
                >
                  Create Debate
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-500 hover:text-purple-600"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/terms"
                  className="text-gray-500 hover:text-purple-600"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-500 hover:text-purple-600"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-500 hover:text-purple-600"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-center text-gray-500">
            &copy; {new Date().getFullYear()} Convoco. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
