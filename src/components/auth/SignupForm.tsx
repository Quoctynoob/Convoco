// src/components/auth/SignupForm.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { GoogleButton } from "./GoogleButton";
export const SignupForm: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { signup, loginWithGoogle, loading, error } = useAuth();
  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError(null);
    return true;
  };
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePasswords() || !acceptTerms) {
      return;
    }
    if (username.trim() && email.trim() && password.trim()) {
      await signup(email.trim(), password.trim(), username.trim());
    }
  };
  const handleGoogleSignup = async () => {
    await loginWithGoogle();
  };
  return (
    <Card className="max-w-md mx-auto shadow-md border-gray-200">
      <CardHeader className="text-center bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-100 rounded-t-lg">
        <CardTitle className="gradient-text text-2xl font-bold">
          Create Your Account
        </CardTitle>
        <p className="text-gray-600 mt-2">
          Join Convoco and start improving your debate skills
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              placeholder="Choose a username"
              required
            />
          </div>
          <div>
            <label
              htmlFor="signup-email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="signup-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="Enter your email address"
              required
            />
          </div>
          <div>
            <label
              htmlFor="signup-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="signup-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Create a password"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Password must be at least 6 characters long
            </p>
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={validatePasswords}
              className={`form-input ${
                passwordError
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : ""
              }`}
              placeholder="Confirm your password"
              required
            />
            {passwordError && (
              <p className="mt-1 text-sm text-red-600">{passwordError}</p>
            )}
          </div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="form-checkbox"
                required
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="text-gray-600">
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-purple-600 hover:text-purple-700"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-purple-600 hover:text-purple-700"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
          </div>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          <Button
            type="submit"
            disabled={
              !username.trim() ||
              !email.trim() ||
              !password.trim() ||
              password !== confirmPassword ||
              !acceptTerms ||
              loading
            }
            className="w-full mt-6"
            variant="gradient"
            isLoading={loading}
          >
            Create Account
          </Button>
        </form>
        <div className="relative py-3 mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or sign up with</span>
          </div>
        </div>
        <GoogleButton
          onClick={handleGoogleSignup}
          isLoading={loading}
          label="Sign up with Google"
        />
      </CardContent>
      <CardFooter className="flex justify-center border-t border-gray-100 bg-gray-50 py-4 rounded-b-lg">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
