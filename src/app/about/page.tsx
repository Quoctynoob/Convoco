// src/app/about/page.tsx
"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">About Convoco</h1>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-12">
        {/* Hero Section */}
        <div className="relative h-64 md:h-80 bg-gradient-to-r from-black to-black overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-70">
            <div className="w-full h-full bg-black" />
          </div>
          <div className="relative z-10 text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Elevating the Art of Debate
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto">
              A platform for meaningful discourse, powered by AI moderation and
              fact-checking
            </p>
          </div>
        </div>

        {/* Mission and Vision */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-6">
            At Convoco, we believe in the power of structured debate to sharpen
            critical thinking, improve communication skills, and bridge
            ideological divides. Our mission is to create a platform where
            people from all backgrounds can engage in respectful, evidence-based
            discussions on topics that matter.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
          <p className="text-gray-700 mb-6">
            We envision a world where meaningful dialogue transcends echo
            chambers, where individuals develop stronger arguments through
            practice and feedback, and where the exchange of ideas leads to
            greater understanding and innovation. Convoco aims to be the leading
            platform for digital debate, making this skill accessible to
            everyone.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          How Convoco Works
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Create or Join
              </h3>
              <p className="text-gray-600">
                Start by creating a new debate on a topic you're passionate
                about, or join an existing debate that interests you. Choose
                your position as either affirmative or negative.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Engage in Debate
              </h3>
              <p className="text-gray-600">
                Participate in structured rounds where you present arguments,
                respond to your opponent, and develop your position with
                evidence and reasoning.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Receive AI Feedback
              </h3>
              <p className="text-gray-600">
                Get real-time analysis of your arguments, including
                fact-checking, logical assessment, and suggestions for
                improvement. Learn and grow with each debate.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Our AI Technology */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8 mb-12 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Our AI Technology
        </h2>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <p className="text-gray-700 mb-4">
              Convoco leverages state-of-the-art AI to enhance the debate
              experience in several ways:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-gray-700">
                  <span className="font-medium">Argument Analysis:</span> Our AI
                  evaluates the structure, coherence, and persuasiveness of
                  arguments, providing scores and feedback.
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-gray-700">
                  <span className="font-medium">Fact-Checking:</span> Claims
                  made during debates are verified against reliable sources in
                  real-time, promoting accuracy.
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-gray-700">
                  <span className="font-medium">Fair Judgment:</span> Debates
                  are evaluated based on objective criteria rather than
                  ideological biases.
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-gray-700">
                  <span className="font-medium">Improvement Suggestions:</span>{" "}
                  Participants receive personalized suggestions to strengthen
                  future arguments.
                </p>
              </li>
            </ul>
          </div>

          <div className="md:w-1/2 flex items-center justify-center">
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 max-w-sm">
              <div className="bg-gradient-to-r from-gray-50 to-purple-50 p-4 rounded-lg mb-3">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0">
                    AI
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">
                      Argument Analysis
                    </h4>
                    <div className="text-sm text-gray-600 bg-white p-2 rounded border border-gray-200">
                      "Strong opening with clear thesis. Evidence is relevant
                      but could be more specific. Consider addressing
                      counterarguments more directly. Overall score: 8.2/10"
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center text-sm text-gray-500">
                Example of AI feedback on a debate argument
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits of Using Convoco */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Benefits of Using Convoco
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                For Individuals
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-700">
                    Improve critical thinking and argumentation skills
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-700">
                    Receive personalized feedback to enhance performance
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-700">
                    Expand knowledge on diverse topics through research
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-700">
                    Build confidence in presenting and defending ideas
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-700">
                    Connect with others who share intellectual interests
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                For Educators
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-700">
                    Supplement classroom learning with practical debate
                    experience
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-700">
                    Track student progress with detailed analytics and feedback
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-700">
                    Provide structured practice opportunities outside the
                    classroom
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-700">
                    Foster a culture of evidence-based discussion and critical
                    thinking
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-700">
                    Create custom debate rooms for specific class activities and
                    topics
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Team</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Team Member 1 */}
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white text-2xl font-bold">
                  QL
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Quoc Le</h3>
              <p className="text-gray-500 mb-3">Software Engineer</p>
              <p className="text-gray-600 text-sm">
                Full-stack developer with expertise in debate platform
                architecture and AI integration.
              </p>
            </CardContent>
          </Card>

          {/* Team Member 2 */}
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                  EV
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Eleazar Videna
              </h3>
              <p className="text-gray-500 mb-3">Software Engineer</p>
              <p className="text-gray-600 text-sm">
                Backend specialist focused on real-time debate systems and
                database architecture.
              </p>
            </CardContent>
          </Card>

          {/* Team Member 3 */}
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold">
                  MD
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Megan D'costa
              </h3>
              <p className="text-gray-500 mb-3">Software Engineer</p>
              <p className="text-gray-600 text-sm">
                Frontend developer specializing in user experience and
                responsive design for debate interfaces.
              </p>
            </CardContent>
          </Card>

          {/* Team Member 4 */}
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-2xl font-bold">
                  EC
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Emily Chang
              </h3>
              <p className="text-gray-500 mb-3">Software Engineer</p>
              <p className="text-gray-600 text-sm">
                Full-stack developer focused on AI moderation systems and debate
                analytics features.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Get Started Section */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl overflow-hidden shadow-lg">
        <div className="p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Enhance Your Debate Skills?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join Convoco today and start practicing structured debates with
            AI-powered feedback in a supportive environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button variant="default" size="lg" className="font-semibold">
                Sign Up for Free
              </Button>
            </Link>
            <Link href="/debates">
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent border-white text-white hover:bg-white hover:text-indigo-600"
              >
                Browse Debates
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ Teaser Section */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Have Questions?
        </h2>
        <p className="text-gray-600 mb-6">
          Check out our frequently asked questions for more information about
          Convoco.
        </p>
        <Link href="/faq">
          <Button variant="outline" size="lg">
            View FAQ
          </Button>
        </Link>
      </div>
    </div>
  );
}
