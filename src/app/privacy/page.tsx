// src/app/privacy/page.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function PrivacyPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center text-gray-900">Privacy Policy</h1>
      
      <Card className="bg-white shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Convoco Privacy Policy</CardTitle>
          <p className="text-gray-500">Last Updated: March 22, 2025</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Introduction</h2>
            <p className="text-gray-700">
              At Convoco, we value your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">2. Information We Collect</h2>
            <p className="text-gray-700">We may collect:</p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Account information (email, username, profile photo).</li>
              <li>Debate content you create or participate in.</li>
              <li>Usage data (e.g., pages visited, time spent).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">3. How We Use Your Information</h2>
            <p className="text-gray-700">Your information is used to:</p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Provide and improve the Convoco platform.</li>
              <li>Facilitate debates and AI moderation.</li>
              <li>Communicate with you about your account or updates.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Sharing Your Information</h2>
            <p className="text-gray-700">
              We do not sell your personal information. We may share it with:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Service providers (e.g., Firebase for authentication).</li>
              <li>Legal authorities if required by law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Data Security</h2>
            <p className="text-gray-700">
              We use industry-standard security measures to protect your data, but no system is completely secure. You use Convoco at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">6. Your Rights</h2>
            <p className="text-gray-700">
              You can access, update, or delete your account information via your profile settings. Contact us at <a href="mailto:support@convoco.app" className="text-purple-600 hover:underline">support@convoco.app</a> for assistance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">7. Cookies</h2>
            <p className="text-gray-700">
              We use cookies to enhance your experience. You can manage cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">8. Changes to This Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy. Changes will be posted here, and continued use of Convoco signifies acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">9. Contact Us</h2>
            <p className="text-gray-700">
              Questions? Reach out at <a href="mailto:support@convoco.app" className="text-purple-600 hover:underline">support@convoco.app</a>.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}