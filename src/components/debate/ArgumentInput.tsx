// src/components/debate/ArgumentInput.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Argument } from "@/types/Argument";
import { User } from "@/types/User";
import SpeechToTextButton from "./SpeechToTextButton";

interface ArgumentInputProps {
  onSubmit: (content: string) => void;
  loading: boolean;
  round: number;
  maxLength: number;
  previousArgument?: Argument | null;
  previousUser?: User | null;
  timeLimit?: number; // Time limit in seconds
}

export const ArgumentInput: React.FC<ArgumentInputProps> = ({
  onSubmit,
  loading,
  round,
  maxLength,
  previousArgument,
  previousUser,
  timeLimit = 0, // Default to no time limit
}) => {
  const [content, setContent] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [timerActive, setTimerActive] = useState(timeLimit > 0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle timer
  useEffect(() => {
    if (!timerActive || timeLimit <= 0) return;

    // Initialize time remaining when component mounts
    if (timeRemaining === timeLimit) {
      setTimeRemaining(timeLimit);
    }

    // Set up the timer
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setTimerActive(false);
          // Auto-submit when time is up
          if (content.trim()) {
            onSubmit(content.trim());
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive, timeLimit, timeRemaining, content, onSubmit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && !loading) {
      onSubmit(content.trim());
      setContent("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Enter (without shift) to make it more convenient
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (content.trim() && !loading) {
        onSubmit(content.trim());
        setContent("");
      }
    }
  };

  const handleSpeechResult = (text: string) => {
    setContent((prev) => {
      // If there's existing content, add a space before the new text
      const newContent = prev ? `${prev} ${text}` : text;
      return newContent.slice(0, maxLength);
    });
  };

  const remainingChars = maxLength - content.length;
  const isOverLimit = remainingChars < 0;
  const isNearLimit = remainingChars <= 200 && remainingChars > 0;

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Previous argument display */}
      {previousArgument && previousUser && (
        <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center mb-2">
            <div className="flex-shrink-0 mr-3">
              {previousUser.photoURL ? (
                <img
                  src={previousUser.photoURL}
                  alt={previousUser.username}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-medium">
                  {previousUser.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                {previousUser.username} said:
              </p>
              <p className="text-xs text-gray-500">
                Round {previousArgument.round}
              </p>
            </div>
          </div>
          <div className="pl-11 text-gray-700 max-h-60 overflow-y-auto text-sm bg-white p-3 rounded border border-gray-100">
            {previousArgument.content.split("\n").map((paragraph, i) =>
              paragraph ? (
                <p key={i} className="mb-2">
                  {paragraph}
                </p>
              ) : (
                <br key={i} />
              )
            )}
          </div>
        </div>
      )}

      <div className="rounded-lg overflow-hidden border border-gray-300 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500 transition-all">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
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
          
          {/* Timer display */}
          {timeLimit > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <span className="font-medium">Time Remaining: </span>
              <span 
                className={`font-bold ${
                  timeRemaining < 30 
                    ? "text-red-600" 
                    : timeRemaining < 60 
                    ? "text-amber-600" 
                    : "text-green-600"
                }`}
              >
                {formatTime(timeRemaining)}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-2">
          {/* Speech-to-text button */}
          <SpeechToTextButton 
            onSpeechResult={handleSpeechResult}
            className="self-end"
          />
          
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
      </div>
    </form>
  );
};