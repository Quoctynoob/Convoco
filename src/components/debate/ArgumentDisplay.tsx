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

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 ${
        isCreator
          ? "border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50"
          : "border-green-200 bg-gradient-to-r from-green-50 to-teal-50"
      }`}
    >
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.username}
              className="h-10 w-10 rounded-full border-2 border-white shadow-sm"
            />
          ) : (
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-medium shadow-sm ${
                isCreator
                  ? "bg-gradient-to-br from-blue-500 to-indigo-600"
                  : "bg-gradient-to-br from-green-500 to-teal-600"
              }`}
            >
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">{user.username}</h4>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  isCreator
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {isCreator ? "Creator" : "Opponent"}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Round {argument.round} • {formatRelativeTime(argument.createdAt)}
            </p>
          </div>
        </div>

        <div className="prose prose-sm max-w-none">
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
            className={`mt-2 text-sm font-medium ${
              isCreator
                ? "text-blue-600 hover:text-blue-700"
                : "text-green-600 hover:text-green-700"
            }`}
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      <div
        className={`w-full h-1 ${
          isCreator
            ? "bg-gradient-to-r from-blue-400 to-indigo-500"
            : "bg-gradient-to-r from-green-400 to-teal-500"
        }`}
      ></div>
    </Card>
  );
};
