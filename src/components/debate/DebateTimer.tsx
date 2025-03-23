// src/components/debate/DebateTimer.tsx
"use client";
import React, { useState, useEffect } from "react";

interface DebateTimerProps {
  duration: number; // Duration in seconds
  onTimeUp: () => void; // Function to call when time is up
  isActive: boolean; // Whether the timer is active
}

export const DebateTimer: React.FC<DebateTimerProps> = ({
  duration,
  onTimeUp,
  isActive,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);

  // Reset timer when it becomes active
  useEffect(() => {
    if (isActive) {
      setTimeLeft(duration);
      setIsPaused(false);
    }
  }, [isActive, duration]);

  // Timer countdown logic
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isActive && !isPaused && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      onTimeUp();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, isActive, isPaused, onTimeUp]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Calculate progress percentage
  const progressPercentage = (timeLeft / duration) * 100;

  // Determine color based on time left
  const getTimerColor = () => {
    if (timeLeft > duration * 0.6) return "bg-green-500"; // More than 60% time left
    if (timeLeft > duration * 0.3) return "bg-yellow-500"; // Between 30-60% time left
    return "bg-red-500"; // Less than 30% time left
  };

  return (
    <div className="w-full mb-4">
      <div className="flex justify-between items-center mb-1">
        <div className="text-sm font-medium">Time Remaining</div>
        <div className="text-sm font-bold">{formatTime(timeLeft)}</div>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getTimerColor()} transition-all duration-1000 ease-linear`}
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      {isActive && (
        <div className="flex justify-end mt-1">
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="text-xs text-gray-600 hover:text-purple-600"
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
        </div>
      )}
    </div>
  );
};
