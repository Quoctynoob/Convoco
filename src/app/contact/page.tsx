// src/app/contact/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for form submission logic (e.g., send to an API endpoint)
    console.log("Contact form submitted:", { name, email, message });
    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h1>
      <Card className="bg-white shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">Get in Touch</CardTitle>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="text-center py-6">
              <p className="text-green-600 mb-4">
                Thank you for your message! We'll get back to you soon.
              </p>
              <Link href="/">
                <Button variant="outline">Return to Home</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input mt-1 w-full"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input mt-1 w-full"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="form-textarea mt-1 w-full h-32"
                  required
                />
              </div>
              <div className="text-center">
                <Button type="submit" variant="gradient">
                  Send Message
                </Button>
              </div>
            </form>
          )}
          <div className="mt-6 text-center text-gray-600">
            <p>
              Or email us directly at:{" "}
              <a
                href="mailto:quoc@uoguelph.ca"
                className="text-purple-600 hover:underline"
              >
                quoc@uoguelph.ca
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
