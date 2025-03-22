// src/app/contact/page.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ContactPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center text-gray-900">Contact Us</h1>
      
      <Card className="bg-white shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Get in Touch</CardTitle>
          <p className="text-gray-500">We'd love to hear from you!</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Support</h2>
            <p className="text-gray-700">
              For technical support or account issues, email us at:
            </p>
            <p className="text-purple-600">
              <a href="mailto:support@convoco.app" className="hover:underline">support@convoco.app</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Feedback</h2>
            <p className="text-gray-700">
              Have suggestions or ideas to improve Convoco? Let us know:
            </p>
            <p className="text-purple-600">
              <a href="mailto:feedback@convoco.app" className="hover:underline">feedback@convoco.app</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Partnerships</h2>
            <p className="text-gray-700">
              Interested in partnering with us? Reach out to:
            </p>
            <p className="text-purple-600">
              <a href="mailto:partnerships@convoco.app" className="hover:underline">partnerships@convoco.app</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Social Media</h2>
            <p className="text-gray-700">Follow us for updates and community discussions:</p>
            <div className="flex gap-4 mt-2">
              <Button variant="outline">
                <a href="https://twitter.com/convocoapp" target="_blank" rel="noopener noreferrer">Twitter</a>
              </Button>
              <Button variant="outline">
                <a href="https://discord.gg/convoco" target="_blank" rel="noopener noreferrer">Discord</a>
              </Button>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}