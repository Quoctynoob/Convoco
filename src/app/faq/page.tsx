// src/app/faq/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function FAQPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h1>
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">What is Convoco?</h2>
          <p className="text-gray-600">
            Convoco is a real-time debate platform with AI moderation and fact-checking, designed to help users practice structured debates.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">How do I join a debate?</h2>
          <p className="text-gray-600">
            Sign up or log in, then visit the Debates page to browse open debates. Click "Join Debate" on any available room.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Is my data safe?</h2>
          <p className="text-gray-600">
            Yes, we prioritize your privacy. Check our <Link href="/privacy" className="text-purple-600 hover:underline">Privacy Policy</Link> for details.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Can I create my own debate?</h2>
          <p className="text-gray-600">
            Yes! After signing in, go to the Debates page and click "Create New Debate" to set your topic and rules.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">How does AI moderation work?</h2>
          <p className="text-gray-600">
            Our AI analyzes arguments for logic, facts, and persuasiveness, providing scores and feedback to ensure fair debates.
          </p>
        </section>

        <div className="text-center">
          <Link href="/">
            <Button variant="outline">Return to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}