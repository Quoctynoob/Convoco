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
  const { createNewDebate, loading, error } = useDebateCreation();
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [side, setSide] = useState<"affirmative" | "negative">("affirmative");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      router.push("/auth/login");
      return;
    }
    if (!topic.trim()) {
      return;
    }
    // We'll use fixed values for description and rounds
    const description = `This is a debate on the topic: ${topic}. The creator has chosen to take the ${side} position.`;
    const rounds = 2; // Fixed at 2 rounds based on your debate format
    // We'll pass the selected side as part of the debate creation
    await createNewDebate(topic.trim(), description, rounds, user.id, side);
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Your Position
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  side === "affirmative"
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-purple-200 hover:bg-purple-50/30"
                }`}
                onClick={() => setSide("affirmative")}
              >
                <div className="flex items-center mb-2">
                  <div
                    className={`w-5 h-5 rounded-full mr-2 ${
                      side === "affirmative" ? "bg-purple-500" : "bg-gray-200"
                    }`}
                  ></div>
                  <h3 className="text-lg font-medium">Affirmative (Pro)</h3>
                </div>
                <p className="text-sm text-gray-600">
                  I will argue in favor of the topic
                </p>
              </div>
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  side === "negative"
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-red-200 hover:bg-red-50/30"
                }`}
                onClick={() => setSide("negative")}
              >
                <div className="flex items-center mb-2">
                  <div
                    className={`w-5 h-5 rounded-full mr-2 ${
                      side === "negative" ? "bg-red-500" : "bg-gray-200"
                    }`}
                  ></div>
                  <h3 className="text-lg font-medium">Negative (Con)</h3>
                </div>
                <p className="text-sm text-gray-600">
                  I will argue against the topic
                </p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">Format</h3>
            <p className="text-sm text-blue-700">
              This debate will follow the timed 2-round format:
            </p>
            <ul className="text-sm text-blue-700 list-disc list-inside mt-2 space-y-1">
              <li>Each participant gets 1 minute per turn to respond</li>
              <li>First round: Opening statements from both sides</li>
              <li>Second round: Rebuttals and final arguments</li>
              <li>
                The timer will automatically submit current text if time runs
                out
              </li>
              <li>
                AI analysis will determine the winner based on argument
                strength, rebuttals, clarity, and evidence
              </li>
            </ul>
          </div>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          <Button
            type="submit"
            disabled={!topic.trim() || loading}
            className="w-full"
          >
            {loading ? "Creating Debate..." : "Create Debate"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
