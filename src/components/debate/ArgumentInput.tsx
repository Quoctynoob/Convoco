// src/components/debate/ArgumentInput.tsx
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/Button";

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
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !loading) {
      onSubmit(content.trim());
      setContent("");
    }
  };

  const remainingChars = maxLength - content.length;
  const isOverLimit = remainingChars < 0;
  const isNearLimit = remainingChars <= 200 && remainingChars > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg overflow-hidden border border-gray-300 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Present your argument here. Make your case with compelling evidence and clear reasoning. Address counterpoints from your opponent when appropriate."
          rows={8}
          className={`w-full p-4 focus:outline-none resize-none ${
            isOverLimit ? "border-red-300" : ""
          }`}
          disabled={loading}
        />
        <div className="bg-gray-50 px-4 py-2 flex justify-between items-center border-t border-gray-200">
          <div className="flex items-center text-xs text-gray-500">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>
              Use <span className="font-medium">clear and concise</span>{" "}
              language
            </span>
          </div>
          <div
            className={`text-sm font-medium ${
              isOverLimit
                ? "text-red-600"
                : isNearLimit
                ? "text-amber-600"
                : "text-gray-500"
            }`}
          >
            {remainingChars} characters remaining
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border border-gray-100">
          <span className="font-medium block mb-1">
            Tips for effective arguments:
          </span>
          <ul className="list-disc pl-5 space-y-1">
            <li>Support claims with specific evidence</li>
            <li>Address your opponent's previous points</li>
            <li>Stay focused on the debate topic</li>
            <li>Use logical reasoning to make your case</li>
          </ul>
        </div>
        <Button
          type="submit"
          disabled={loading || !content.trim() || isOverLimit}
          isLoading={loading}
          size="lg"
          variant="gradient"
          className="whitespace-nowrap self-end"
        >
          {loading ? "Submitting..." : "Submit Argument"}
        </Button>
      </div>
    </form>
  );
};
