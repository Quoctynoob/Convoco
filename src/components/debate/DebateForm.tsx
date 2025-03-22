// src/components/debate/DebateForm.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { useDebateCreation } from "@/hooks/useDebate";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export const DebateForm: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { createNewDebate, loading, error, suggestedTopics } =
    useDebateCreation();
  const router = useRouter();

  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [rounds, setRounds] = useState(3);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      router.push("/auth/login");
      return;
    }

    if (!topic.trim() || !description.trim() || rounds < 1) {
      return;
    }

    await createNewDebate(topic.trim(), description.trim(), rounds, user.id);
  };

  const handleSelectTopic = (selectedTopic: string) => {
    setTopic(selectedTopic);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create a New Debate</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="topic"
              className="block text-sm font-medium text-gray-700"
            >
              Debate Topic
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="E.g., Should artificial intelligence be regulated more strictly?"
              required
            />
          </div>

          {suggestedTopics.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or choose a suggested topic:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestedTopics.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelectTopic(suggestion)}
                    className="text-left p-2 border border-gray-200 rounded-md hover:bg-gray-50 text-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="Provide context and scope for the debate..."
              required
            />
          </div>

          <div>
            <label
              htmlFor="rounds"
              className="block text-sm font-medium text-gray-700"
            >
              Number of Rounds
            </label>
            <div className="mt-1 flex items-center gap-4">
              <input
                type="range"
                id="rounds"
                min="1"
                max="5"
                value={rounds}
                onChange={(e) => setRounds(parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-lg font-medium w-8 text-center">
                {rounds}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Each round consists of one argument from each participant
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={!topic.trim() || !description.trim() || loading}
            className="w-full"
          >
            {loading ? "Creating Debate..." : "Create Debate"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
