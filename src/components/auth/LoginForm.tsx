// src/components/auth/LoginForm.tsx
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
export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { login, loginWithGoogle, forgotPassword, loading, error } = useAuth();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      await login(email.trim(), password.trim());
    }
  };
  const handleGoogleLogin = async () => {
    await loginWithGoogle();
  };
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      const success = await forgotPassword(email.trim());
      if (success) {
        setShowForgotPassword(false);
        alert("Password reset email sent. Please check your inbox.");
      }
    }
  };
  return (
    <Card className="max-w-md mx-auto shadow-md border-gray-200">
      <CardHeader className="text-center bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-100 rounded-t-lg">
        <CardTitle className="gradient-text text-2xl font-bold">
          {showForgotPassword ? "Reset Password" : "Log In"}
        </CardTitle>
        {!showForgotPassword && (
          <p className="text-gray-600 mt-2">Sign in to continue to Convoco</p>
        )}
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {showForgotPassword ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label
                htmlFor="reset-email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="reset-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="Enter your email address"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                We&apos;ll send you a link to reset your password.
              </p>
            </div>
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowForgotPassword(false)}
                className="text-gray-600"
              >
                Back to Login
              </Button>
              <Button
                type="submit"
                disabled={!email.trim() || loading}
                isLoading={loading}
                variant="gradient"
              >
                Send Reset Link
              </Button>
            </div>
          </form>
        ) : (
          <>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="Enter your email address"
                  required
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-blue-700 hover:text-blue-900 underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="form-checkbox"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              <Button
                type="submit"
                disabled={!email.trim() || !password.trim() || loading}
                className="w-full"
                variant="theme"
                isLoading={loading}
              >
                Sign in
              </Button>
            </form>
            <div className="relative py-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <GoogleButton onClick={handleGoogleLogin} isLoading={loading} />
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-center border-t border-gray-100 bg-gray-50 py-4 rounded-b-lg">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-blue-700 hover:text-blue-900 font-medium"
          >
            Sign up now
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
