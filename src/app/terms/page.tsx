// src/app/terms/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function TermsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">1. Acceptance of Terms</h2>
          <p className="text-gray-600">
            By accessing or using Convoco, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">2. User Conduct</h2>
          <p className="text-gray-600">
            You agree to use Convoco respectfully and lawfully. Harassment, hate speech, or any illegal activities are strictly prohibited.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">3. Intellectual Property</h2>
          <p className="text-gray-600">
            All content you submit remains yours, but by posting it, you grant Convoco a non-exclusive license to display and use it within the platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">4. Termination</h2>
          <p className="text-gray-600">
            We reserve the right to terminate or suspend your account at our discretion, particularly for violations of these terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">5. Limitation of Liability</h2>
          <p className="text-gray-600">
            Convoco is provided "as is." We are not liable for any damages arising from your use of the platform.
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