// src/components/debate/ArgumentDisplay.tsx
"use client";

import React from "react";
import { Argument } from "@/types/Argument";
import { User } from "@/types/User";
import { formatRelativeTime } from "@/utils/dates";

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
  return (
    <div
      className={`p-4 rounded-lg border ${
        isCreator
          ? "bg-blue-50 border-blue-200"
          : "bg-green-50 border-green-200"
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.username}
            className="h-8 w-8 rounded-full"
          />
        ) : (
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center text-white ${
              isCreator ? "bg-blue-500" : "bg-green-500"
            }`}
          >
            {user.username.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h4 className="font-medium">{user.username}</h4>
          <p className="text-xs text-gray-500">
            Round {argument.round} • {formatRelativeTime(argument.createdAt)}
          </p>
        </div>
      </div>

      <div className="prose prose-sm max-w-none">
        {argument.content
          .split("\n")
          .map((paragraph, index) =>
            paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
          )}
      </div>
    </div>
  );
};
