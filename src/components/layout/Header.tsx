// src/components/layout/Header.tsx - Updated with Leaderboard Link
"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Menu, X } from "lucide-react";

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Remove event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br bg-black flex items-center justify-center text-white font-bold text-xl">
                  C
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-black">
                  Convoco
                </span>
              </Link>
            </div>
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              <Link
                  href="/debates"
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === "/debates"
                      ? "text-black bg-gray-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  Debates
                </Link>
              <Link
                  href="/leaderboard"
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === "/leaderboard"
                      ? "text-black bg-gray-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  Leaderboard
                </Link>
              {isAuthenticated && (
                <Link
                  href={`/profile/${user?.id}`}
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === `/profile/${user?.id}` ||
                    pathname.startsWith("/profile/")
                      ? "text-black bg-gray-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  My Profile
                </Link>
              )}
            </nav>
          </div>
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="relative" ref={dropdownRef}>
                  <button 
                    className="flex items-center space-x-2 focus:outline-none" 
                    onClick={toggleDropdown}
                  >
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.username}
                        className="h-10 w-10 rounded-full border-2 border-purple-200"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-medium text-lg">
                        {user?.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-gray-700 font-medium">
                      {user?.username}
                    </span>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-lg z-10 border border-gray-100">
                      <Link
                        href="/profile/edit"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-indigo-600"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-indigo-600"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-black hover:bg-gray-50 hover:text-black"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-gradient-to-r border-2 border-black"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-blue-800 hover:bg-purple-50 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 shadow-sm">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === "/"
                  ? "text-black bg-gray-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            {isAuthenticated && (
              <Link
                href={`/profile/${user?.id}`}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === `/profile/${user?.id}` ||
                  pathname.startsWith("/profile/")
                    ? "text-black bg-gray-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                My Profile
              </Link>
            )}
            {/* New Navigation Links for Mobile */}
            <Link
              href="/debates"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === "/debates"
                  ? "text-black bg-gray-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Debates
            </Link>
            
            <Link
              href="/leaderboard"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === "/leaderboard"
                  ? "text-black bg-gray-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Leaderboard
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/debates/new"
                  className="block px-3 py-2 rounded-md text-base font-medium text-indigo-800 hover:bg-purple-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  New Debate
                </Link>
                <Link
                  href="/profile/edit"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-800 hover:bg-purple-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-800 hover:bg-purple-50"
                >
                  Sign out
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 px-3 py-2">
                <Link
                  href="/auth/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-black hover:bg-purple-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="block px-3 py-2 rounded-md text-center text-base font-medium border-2 border-black"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};