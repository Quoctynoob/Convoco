// src/app/faq/page.tsx
"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function FAQPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Frequently Asked Questions
      </h1>

      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200 space-y-8">
        {/* General Questions */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            About Convoco
          </h2>

          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                What is Convoco?
              </h3>
              <p className="text-gray-600">
                Convoco is a real-time debate platform with AI moderation and
                fact-checking, designed to help users practice structured
                debates in a fair and productive environment. Our platform
                provides a space for meaningful discussions on various topics
                while receiving AI feedback on argument quality.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Who can use Convoco?
              </h3>
              <p className="text-gray-600">
                Convoco is designed for anyone interested in improving their
                debate skills, including students, professionals, educators, and
                debate enthusiasts. Whether you're preparing for academic
                debates, professional discussions, or simply want to refine your
                persuasive abilities, our platform provides a structured
                environment to practice.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Is Convoco free to use?
              </h3>
              <p className="text-gray-600">
                Currently, Convoco offers free access to our basic features,
                including participating in debates and receiving AI feedback. We
                may introduce premium features in the future, but our core
                functionality will remain accessible to all users to encourage
                widespread participation and skill development.
              </p>
            </div>
          </div>
        </section>

        {/* Account Questions */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Account & Registration
          </h2>

          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Do I need an account to use Convoco?
              </h3>
              <p className="text-gray-600">
                Yes, an account is required to participate in debates on
                Convoco. This allows us to track your debate history, provide
                personalized feedback, and ensure a safe environment for all
                users. Registration is quick and can be done with your email or
                Google account.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                How do I create an account?
              </h3>
              <p className="text-gray-600">
                You can create an account by clicking the "Sign Up" button in
                the top navigation bar. You'll be asked to provide a username,
                email address, and password. Alternatively, you can sign up with
                your Google account for a faster registration process.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Can I change my username or profile information?
              </h3>
              <p className="text-gray-600">
                Yes, you can update your profile information including your
                username, bio, location, and preferred debate topics by visiting
                your profile page and clicking on "Edit Profile". These changes
                can be made at any time to keep your profile current.
              </p>
            </div>
          </div>
        </section>

        {/* Debate Process */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Debate Process
          </h2>

          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                How do I join a debate?
              </h3>
              <p className="text-gray-600">
                To join a debate, navigate to the "Debates" page and browse
                available debate rooms. Click "Join Debate" on any room that
                interests you. You'll be assigned the position opposite to the
                creator's stance (affirmative or negative). Once joined, you'll
                participate in the structured debate format with the established
                number of rounds.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                How do I create my own debate?
              </h3>
              <p className="text-gray-600">
                After signing in, go to the Debates page and click "Create New
                Debate". You'll need to specify a topic, choose which side
                you'll take (affirmative or negative), and determine the number
                of rounds. Once created, your debate will be listed for others
                to join. The default format includes 2 rounds with timed
                arguments.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                What is the standard debate format?
              </h3>
              <p className="text-gray-600">
                Convoco uses a structured debate format that typically includes:
                <ul className="list-disc pl-8 mt-2 space-y-1">
                  <li>Opening statements from both sides</li>
                  <li>
                    Alternate argument rounds where each participant presents
                    their case
                  </li>
                  <li>Rebuttals to address the opponent's points</li>
                  <li>Final statements to summarize positions</li>
                </ul>
                The number of rounds is determined by the debate creator, with
                most debates featuring 2-3 rounds.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                What happens if I need to leave a debate?
              </h3>
              <p className="text-gray-600">
                If you need to leave a debate before it's completed, you can
                click the "Forfeit Debate" button. This will end the debate
                prematurely and award the win to your opponent. While we
                encourage completing debates, we understand that circumstances
                sometimes require early exit. Repeated forfeitures may affect
                your user rating.
              </p>
            </div>
          </div>
        </section>

        {/* AI Moderation */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            AI Moderation & Feedback
          </h2>

          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                How does AI moderation work?
              </h3>
              <p className="text-gray-600">
                Our AI system analyzes each argument for logical coherence,
                factual accuracy, and persuasiveness. After each submission, the
                AI provides a detailed analysis including a score out of 10,
                feedback on argument structure, fact-checking of claims, and
                suggestions for improvement. This helps maintain debate quality
                and provides valuable learning opportunities.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                How are debate winners determined?
              </h3>
              <p className="text-gray-600">
                Debate winners are determined by our AI based on several
                factors:
                <ul className="list-disc pl-8 mt-2 space-y-1">
                  <li>Argument quality and logical coherence</li>
                  <li>Evidence presented and factual accuracy</li>
                  <li>Effectiveness in addressing opponent's points</li>
                  <li>Overall persuasiveness throughout the debate</li>
                </ul>
                The AI calculates scores for each participant's arguments and
                declares a winner based on the highest overall performance.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Is the fact-checking accurate?
              </h3>
              <p className="text-gray-600">
                Our AI fact-checking system is designed to identify common
                factual claims and verify them against reliable sources. While
                we strive for accuracy, the system is continuously improving and
                may occasionally miss nuances. Users are encouraged to provide
                sources for claims when possible to aid in verification and
                strengthen their arguments.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Can I dispute the AI's evaluation?
              </h3>
              <p className="text-gray-600">
                Currently, AI evaluations cannot be directly disputed within the
                platform. However, we are continually improving our AI systems
                based on user feedback. If you believe there was a significant
                error in evaluation, you can provide feedback through our
                contact form, which our team will review to improve future AI
                performance.
              </p>
            </div>
          </div>
        </section>

        {/* Technical & Privacy */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Technical & Privacy
          </h2>

          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Is my data safe?
              </h3>
              <p className="text-gray-600">
                Yes, we prioritize your privacy and data security. We use
                industry-standard encryption to protect your personal
                information and debate content. We do not sell your personal
                data to third parties. For more details, please check our{" "}
                <Link
                  href="/privacy"
                  className="text-purple-600 hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                What devices can I use Convoco on?
              </h3>
              <p className="text-gray-600">
                Convoco is a web-based platform optimized for both desktop and
                mobile browsers. You can access and participate in debates from
                any device with a modern web browser and internet connection. We
                recommend using the latest versions of Chrome, Firefox, Safari,
                or Edge for the best experience.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                How can I report inappropriate content or behavior?
              </h3>
              <p className="text-gray-600">
                If you encounter inappropriate content or behavior, please use
                the "Report" feature available in each debate. Our moderation
                team reviews all reports promptly. For serious concerns, please
                contact us directly through our{" "}
                <Link
                  href="/contact"
                  className="text-purple-600 hover:underline"
                >
                  Contact Page
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Additional Support */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Additional Support
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                I still have questions. How can I get help?
              </h3>
              <p className="text-gray-600">
                If your question isn't answered here, you can reach out to our
                support team through our{" "}
                <Link
                  href="/contact"
                  className="text-purple-600 hover:underline"
                >
                  Contact Page
                </Link>
                . We typically respond within 24-48 hours. You can also check
                our{" "}
                <Link href="/about" className="text-purple-600 hover:underline">
                  About Page
                </Link>{" "}
                for more information about our platform and mission.
              </p>
            </div>
          </div>
        </section>

        <div className="flex justify-center pt-4">
          <Link href="/">
            <Button variant="outline">Return to Home</Button>
          </Link>
          <Link href="/contact" className="ml-4">
            <Button variant="gradient">Contact Support</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
