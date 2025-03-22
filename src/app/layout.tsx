// src/app/terms/page.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function TermsPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center text-gray-900">Terms of Service</h1>
      
      <Card className="bg-white shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Convoco Terms of Service</CardTitle>
          <p className="text-gray-500">Last Updated: March 22, 2025</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h2>
            <p className="text-gray-700">
              By accessing or using Convoco, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">2. Use of the Platform</h2>
            <p className="text-gray-700">
              Convoco is a platform for structured debates with AI moderation. You may only use the platform for lawful purposes and in a manner consistent with these Terms. You agree not to:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Post harmful, offensive, or illegal content.</li>
              <li>Harass or abuse other users.</li>
              <li>Attempt to bypass security measures or disrupt the platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">3. User Accounts</h2>
            <p className="text-gray-700">
              You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately if you suspect unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">4. Intellectual Property</h2>
            <p className="text-gray-700">
              All content on Convoco, including text, graphics, and code, is the property of Convoco or its licensors. You may not reproduce or distribute this content without permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">5. Termination</h2>
            <p className="text-gray-700">
              We reserve the right to suspend or terminate your account for violations of these Terms at our sole discretion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">6. Limitation of Liability</h2>
            <p className="text-gray-700">
              Convoco is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">7. Changes to Terms</h2>
            <p className="text-gray-700">
              We may update these Terms from time to time. Continued use of the platform after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">8. Contact Us</h2>
            <p className="text-gray-700">
              For questions about these Terms, please contact us at <a href="mailto:support@convoco.app" className="text-purple-600 hover:underline">support@convoco.app</a>.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}