// src/app/page.tsx
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="space-y-16 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center py-16 px-4 sm:px-6 lg:py-20 lg:px-8 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl max-w-4xl mx-auto">
          <span className="block">Master the Art of Debate</span>
          <span className="block gradient-text mt-2">
            With AI-Powered Feedback
          </span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
          Practice structured debates with real opponents while Gemini AI
          moderates, fact-checks your arguments, and provides insightful
          feedback.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/debates">
            <Button
              size="lg"
              variant="gradient"
              className="w-full sm:w-auto shadow-md"
            >
              Browse Debates
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              Sign Up Free
            </Button>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base gradient-text font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A better way to debate
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our platform combines human intelligence with AI assistance to
              create the ultimate debate experience.
            </p>
          </div>
          <div className="mt-16">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                    />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-semibold text-gray-900">
                    AI-Powered Moderation
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Gemini AI acts as a neutral moderator, analyzing arguments,
                    checking facts, and ensuring a fair debate environment.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                    />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-semibold text-gray-900">
                    Real-Time Fact Checking
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Claims made during debates are automatically fact-checked to
                    promote accuracy and truthfulness.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
                    />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-semibold text-gray-900">
                    Performance Analytics
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Track your debate performance over time, identify strengths
                    and weaknesses, and improve your skills.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                    />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-semibold text-gray-900">
                    Suggested Counterpoints
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Get AI-generated suggestions for effective counterarguments
                    to strengthen your rebuttals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base gradient-text font-semibold tracking-wide uppercase">
              How It Works
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Simple, structured debate format
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our platform guides you through a structured debate process with
              AI assistance at every step.
            </p>
          </div>
          <div className="mt-16">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="text-center relative">
                <div className="flex items-center justify-center mx-auto h-20 w-20 rounded-full bg-purple-100 text-purple-900 text-2xl font-bold relative">
                  <span className="relative z-10">1</span>
                  <div className="absolute w-full h-full rounded-full bg-purple-200 animate-ping opacity-20"></div>
                </div>
                <div className="mt-6 bg-white p-5 rounded-lg border border-purple-100 shadow-sm transform transition-transform hover:-translate-y-1 hover:shadow-md">
                  <h3 className="text-lg leading-6 font-semibold text-gray-900">
                    Choose or Create a Topic
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Select from trending debate topics or create your own. Add
                    it to your profile to attract opponents.
                  </p>
                </div>
              </div>
              <div className="text-center relative">
                <div className="flex items-center justify-center mx-auto h-20 w-20 rounded-full bg-purple-100 text-purple-900 text-2xl font-bold">
                  <span className="relative z-10">2</span>
                  <div className="absolute w-full h-full rounded-full bg-purple-200 animate-ping opacity-20 animation-delay-300"></div>
                </div>
                <div className="mt-6 bg-white p-5 rounded-lg border border-purple-100 shadow-sm transform transition-transform hover:-translate-y-1 hover:shadow-md">
                  <h3 className="text-lg leading-6 font-semibold text-gray-900">
                    Take Turns Presenting Arguments
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Present your arguments in alternating rounds. Receive
                    real-time AI analysis and feedback.
                  </p>
                </div>
              </div>
              <div className="text-center relative">
                <div className="flex items-center justify-center mx-auto h-20 w-20 rounded-full bg-purple-100 text-purple-900 text-2xl font-bold">
                  <span className="relative z-10">3</span>
                  <div className="absolute w-full h-full rounded-full bg-purple-200 animate-ping opacity-20 animation-delay-600"></div>
                </div>
                <div className="mt-6 bg-white p-5 rounded-lg border border-purple-100 shadow-sm transform transition-transform hover:-translate-y-1 hover:shadow-md">
                  <h3 className="text-lg leading-6 font-semibold text-gray-900">
                    Get AI-Judged Results
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    After all rounds, Gemini AI provides an impartial judgment
                    and detailed feedback for improvement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600">
          <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">
                Ready to sharpen your debate skills?
              </span>
              <span className="block mt-2">Start a debate today.</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-purple-100">
              Join our community of debaters and practice with AI-powered
              feedback.
            </p>
            <Link href="/auth/signup" className="mt-8 inline-block">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-purple-50 shadow-md"
              >
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
