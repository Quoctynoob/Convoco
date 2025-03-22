// src/app/profile/edit/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

export default function EditProfilePage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [debateTopics, setDebateTopics] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Load user data when available
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setGender(user.gender || "");
      setLocation(user.location || "");
      setBio(user.bio || "");
      setDebateTopics(user.debateTopics || []);
    }
  }, [user]);

  const handleAddTopic = () => {
    if (newTopic.trim() && !debateTopics.includes(newTopic.trim())) {
      setDebateTopics([...debateTopics, newTopic.trim()]);
      setNewTopic("");
    }
  };

  const handleRemoveTopic = (topicToRemove: string) => {
    setDebateTopics(debateTopics.filter((topic) => topic !== topicToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const userRef = doc(db, "users", user.id);

      await updateDoc(userRef, {
        username: username.trim(),
        gender: gender.trim(),
        location: location.trim(),
        bio: bio.trim(),
        debateTopics,
        updatedAt: Date.now(),
      });

      setSuccess(true);

      // Redirect after a short delay
      setTimeout(() => {
        router.push(`/profile/${user.id}`);
      }, 1500);
    } catch (e) {
      console.error("Error updating profile:", e);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Edit Your Profile</h1>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="Your display name"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                >
                  <option value="">Prefer not to say</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  placeholder="City, Country"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700"
              >
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="Tell others about yourself..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Favorite Debate Topics
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Add topics you&aops;re interested in debating
              </p>
              <div className="mt-2 flex">
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-l-md shadow-sm"
                  placeholder="Add a topic (e.g., Climate Change, AI Ethics)"
                />
                <button
                  type="button"
                  onClick={handleAddTopic}
                  className="bg-purple-600 text-white px-4 py-2 rounded-r-md hover:bg-purple-700 disabled:opacity-50"
                  disabled={!newTopic.trim()}
                >
                  Add
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {debateTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {topic}
                    <button
                      type="button"
                      onClick={() => handleRemoveTopic(topic)}
                      className="ml-2 text-purple-600 hover:text-purple-800"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-700">
                  Profile updated successfully!
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
