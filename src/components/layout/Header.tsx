// src/components/layout/Header.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-purple-600">
                DebateAI
              </Link>
            </div>
            <nav className="ml-6 flex space-x-4 sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === "/"
                    ? "border-purple-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Home
              </Link>
              <Link
                href="/debates"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === "/debates" || pathname.startsWith("/debates/")
                    ? "border-purple-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Debates
              </Link>
              {isAuthenticated && (
                <Link
                  href={`/profile/${user?.id}`}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === `/profile/${user?.id}` ||
                    pathname.startsWith("/profile/")
                      ? "border-purple-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  My Profile
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link href="/debates/new">
                  <Button variant="default" size="sm">
                    New Debate
                  </Button>
                </Link>
                <div className="relative group">
                  <button className="flex items-center text-sm focus:outline-none">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.username}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
                        {user?.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="ml-2 hidden md:block">
                      {user?.username}
                    </span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
                    <Link
                      href={`/profile/${user?.id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/profile/edit"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => logout()}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="default" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
