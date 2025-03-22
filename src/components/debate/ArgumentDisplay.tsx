// src/components/debate/ArgumentDisplay.tsx
"use client";
import React, { useState } from "react";
import { Argument } from "@/types/Argument";
import { User } from "@/types/User";
import { formatRelativeTime } from "@/utils/dates";
import { Card } from "@/components/ui/Card";

interface ArgumentDisplayProps {
  argument: Argument;
  user: User;
  isCreator: boolean;
}

export const ArgumentDisplay: React.FC<ArgumentDisplayProps> = ({
  argument,
  user,
  isCreator,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongContent = argument.content.length > 500;
  const displayContent =
    isLongContent && !isExpanded
      ? `${argument.content.substring(0, 500)}...`
      : argument.content;

  // Define colors based on role
  const roleColors = isCreator
    ? {
        border: "border-blue-200",
        gradient: "from-blue-500 to-indigo-600",
        badge: "bg-blue-100 text-blue-800 border-blue-200",
        button: "text-blue-600 hover:text-blue-700",
      }
    : {
        border: "border-green-200",
        gradient: "from-green-500 to-teal-600",
        badge: "bg-green-100 text-green-800 border-green-200",
        button: "text-green-600 hover:text-green-700",
      };

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md ${roleColors.border}`}
    >
      <div className={`p-1 bg-gradient-to-r ${roleColors.gradient}`}></div>
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.username}
              className={`h-10 w-10 rounded-full border-2 shadow-sm ${
                isCreator ? "border-blue-200" : "border-green-200"
              }`}
            />
          ) : (
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-medium shadow-sm bg-gradient-to-br ${roleColors.gradient}`}
            >
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">{user.username}</h4>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full border ${roleColors.badge}`}
              >
                {isCreator ? "Creator" : "Opponent"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Round {argument.round}</span>
              <span>•</span>
              <span>{formatRelativeTime(argument.createdAt)}</span>
            </div>
          </div>
        </div>

        <div
          className={`prose prose-sm max-w-none ${
            isCreator ? "prose-blue" : "prose-green"
          }`}
        >
          {displayContent.split("\n").map((paragraph, index) =>
            paragraph ? (
              <p key={index} className="mb-3 text-gray-700">
                {paragraph}
              </p>
            ) : (
              <br key={index} />
            )
          )}
        </div>

        {isLongContent && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`mt-2 text-sm font-medium ${roleColors.button}`}
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>
    </Card>
  );
};
