// src/app/privacy/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function PrivacyPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">1. Information We Collect</h2>
          <p className="text-gray-600">
            We collect information you provide (e.g., email, username) and data generated from your use of Convoco (e.g., debate history).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">2. How We Use Your Information</h2>
          <p className="text-gray-600">
            Your data is used to provide and improve our services, personalize your experience, and comply with legal obligations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">3. Data Sharing</h2>
          <p className="text-gray-600">
            We do not sell your personal data. We may share it with service providers (e.g., Firebase) to operate the platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">4. Your Rights</h2>
          <p className="text-gray-600">
            You can access, update, or delete your account data by contacting us at <a href="mailto:support@convoco.app" className="text-purple-600 hover:underline">support@convoco.app</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">5. Cookies</h2>
          <p className="text-gray-600">
            We use cookies to enhance your experience. You can manage cookie preferences through your browser settings.
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