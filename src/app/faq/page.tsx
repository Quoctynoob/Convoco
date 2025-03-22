// src/app/faq/page.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function FAQPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center text-gray-900">Frequently Asked Questions</h1>
      
      <Card className="bg-white shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Convoco FAQ</CardTitle>
          <p className="text-gray-500">Your questions, answered.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">What is Convoco?</h2>
            <p className="text-gray-700">
              Convoco is a real-time debate platform with AI fact-checking and moderation, designed to help users practice structured debates and improve their argumentation skills.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">How do I join a debate?</h2>
            <p className="text-gray-700">
              Sign up or log in, then visit the Debates page. Browse open debates and click "Join Debate" to participate in one that interests you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">How does AI moderation work?</h2>
            <p className="text-gray-700">
              Our AI analyzes arguments for logical consistency, fact-checks claims, and provides scores and suggested counterpoints. It ensures fair and objective moderation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Is my data secure?</h2>
            <p className="text-gray-700">
              Yes, we prioritize your privacy. See our <a href="/privacy" className="text-purple-600 hover:underline">Privacy Policy</a> for details on how we protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Can I suggest new features?</h2>
            <p className="text-gray-700">
              Absolutely! Email us at <a href="mailto:feedback@convoco.app" className="text-purple-600 hover:underline">feedback@convoco.app</a> with your ideas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">What happens if I abandon a debate?</h2>
            <p className="text-gray-700">
              If you leave a debate before it starts, it may be marked as abandoned or transferred to another user. Active debates can be forfeited, impacting your stats.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}