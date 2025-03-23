// src/components/debate/DebateTimer.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";

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
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTickTimeRef = useRef<number | null>(null);

  // Reset timer when it becomes active
  useEffect(() => {
    if (isActive) {
      setTimeLeft(duration);
      setIsPaused(false);
      lastTickTimeRef.current = Date.now();
    }
  }, [isActive, duration]);

  // Timer countdown logic using requestAnimationFrame for more consistent timing
  useEffect(() => {
    let animationFrameId: number;

    const tick = () => {
      if (isActive && !isPaused && timeLeft > 0) {
        const now = Date.now();

        // If this is the first tick or it's been at least 1 second since the last tick
        if (
          lastTickTimeRef.current === null ||
          now - lastTickTimeRef.current >= 1000
        ) {
          setTimeLeft((prevTime) => {
            const newTime = prevTime - 1;
            // If the timer has reached zero, call the onTimeUp callback
            if (newTime === 0) {
              setTimeout(() => onTimeUp(), 0);
            }
            return newTime;
          });
          lastTickTimeRef.current = now;
        }

        animationFrameId = requestAnimationFrame(tick);
      } else if (isActive && timeLeft === 0) {
        onTimeUp();
      }
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
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
