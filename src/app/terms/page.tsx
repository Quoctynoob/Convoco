// src/app/terms/page.tsx
"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function TermsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Terms of Service
      </h1>

      <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200 space-y-8">
        {/* Last Updated Notice */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <p className="text-sm text-gray-500">Last Updated: March 15, 2025</p>
          <Link
            href="/privacy"
            className="text-purple-600 hover:underline text-sm"
          >
            View Privacy Policy
          </Link>
        </div>

        {/* Introduction */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            1. Introduction
          </h2>
          <p className="text-gray-600 mb-3">
            Welcome to Convoco ("we," "our," or "us"). By accessing or using our
            platform, you agree to be bound by these Terms of Service ("Terms").
            Please read these Terms carefully before using Convoco.
          </p>
          <p className="text-gray-600 mb-3">
            These Terms constitute a legally binding agreement between you and
            Convoco governing your access to and use of the website, including
            any content, functionality, and services offered on or through the
            website.
          </p>
          <p className="text-gray-600">
            If you do not agree to these Terms, please do not access or use our
            platform.
          </p>
        </section>

        {/* Acceptance of Terms */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            2. Acceptance of Terms
          </h2>
          <p className="text-gray-600 mb-3">
            By creating an account, accessing, or using our services, you
            acknowledge that you have read, understood, and agree to be bound by
            these Terms. If you are using the platform on behalf of an
            organization or entity, you represent and warrant that you have the
            authority to bind that organization or entity to these Terms.
          </p>
          <p className="text-gray-600">
            We reserve the right to modify these Terms at any time. We will
            provide notice of any significant changes through our platform or by
            sending an email to the address associated with your account. Your
            continued use of Convoco after such notification constitutes your
            acceptance of the modified Terms.
          </p>
        </section>

        {/* Eligibility */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            3. Eligibility
          </h2>
          <p className="text-gray-600 mb-3">
            You must be at least 13 years old to use our platform. If you are
            under 18, you may only use Convoco with the consent and supervision
            of a parent or legal guardian who agrees to be bound by these Terms.
          </p>
          <p className="text-gray-600">
            You represent and warrant that all registration information you
            submit is accurate and truthful and that you will maintain the
            accuracy of such information. You are responsible for maintaining
            the confidentiality of your account credentials and for all
            activities that occur under your account.
          </p>
        </section>

        {/* User Accounts */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            4. User Accounts
          </h2>
          <p className="text-gray-600 mb-3">
            To access certain features of Convoco, you must register for an
            account. When you register, you agree to provide accurate, current,
            and complete information about yourself and to update this
            information to maintain its accuracy.
          </p>
          <p className="text-gray-600 mb-3">You are solely responsible for:</p>
          <ul className="list-disc pl-8 mb-3 text-gray-600 space-y-1">
            <li>Maintaining the confidentiality of your account password</li>
            <li>Restricting access to your account</li>
            <li>All activities that occur under your account</li>
            <li>
              Promptly notifying us of any unauthorized use of your account or
              other security breaches
            </li>
          </ul>
          <p className="text-gray-600">
            We reserve the right to terminate accounts, remove or edit content,
            or cancel orders at our sole discretion.
          </p>
        </section>

        {/* User Conduct */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            5. User Conduct
          </h2>
          <p className="text-gray-600 mb-3">
            You agree to use Convoco respectfully and lawfully. When using our
            platform, you agree not to:
          </p>
          <ul className="list-disc pl-8 mb-3 text-gray-600 space-y-1">
            <li>
              Use the platform for any illegal purpose or in violation of any
              local, state, national, or international law
            </li>
            <li>Harass, abuse, threaten, or intimidate other users</li>
            <li>
              Post or transmit any content that is libelous, defamatory,
              obscene, pornographic, abusive, offensive, or hateful
            </li>
            <li>
              Impersonate any person or entity or falsely state or otherwise
              misrepresent your affiliation with a person or entity
            </li>
            <li>
              Interfere with or disrupt the services or servers or networks
              connected to the services
            </li>
            <li>
              Use automated scripts, bots, or other means to access or scrape
              content from the platform
            </li>
            <li>
              Attempt to bypass any security measures implemented on the
              platform
            </li>
            <li>
              Upload or transmit viruses, malware, or other types of malicious
              software
            </li>
            <li>
              Collect or store personal data about other users without their
              express consent
            </li>
          </ul>
          <p className="text-gray-600">
            Violation of these conduct rules may result in the termination of
            your account at our sole discretion.
          </p>
        </section>

        {/* Content Policies */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            6. Content Policies
          </h2>
          <p className="text-gray-600 mb-3">
            As a user of Convoco, you may post, upload, or contribute content to
            the platform, including debate arguments, profile information, and
            comments ("User Content").
          </p>
          <p className="text-gray-600 mb-3">
            You retain ownership of all User Content you submit to the platform.
            However, by posting User Content, you grant us a worldwide,
            non-exclusive, royalty-free license to use, reproduce, modify,
            adapt, publish, translate, create derivative works from, distribute,
            and display such content in connection with providing and promoting
            our services.
          </p>
          <p className="text-gray-600 mb-3">You represent and warrant that:</p>
          <ul className="list-disc pl-8 mb-3 text-gray-600 space-y-1">
            <li>
              You own or have the necessary rights to the User Content you post
            </li>
            <li>
              Your User Content does not violate the privacy rights, publicity
              rights, copyright, contractual rights, intellectual property
              rights, or any other rights of any person or entity
            </li>
            <li>
              Your User Content does not contain material that is false,
              intentionally misleading, or defamatory
            </li>
            <li>
              Your User Content does not violate any applicable law, regulation,
              or rule
            </li>
          </ul>
          <p className="text-gray-600">
            We reserve the right, but not the obligation, to monitor, review,
            and remove any User Content at our sole discretion, especially
            content that violates these Terms or is otherwise objectionable.
          </p>
        </section>

        {/* Intellectual Property */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            7. Intellectual Property
          </h2>
          <p className="text-gray-600 mb-3">
            The Convoco platform, including its design, features, functionality,
            content (excluding User Content), and underlying technology, is
            owned by us and protected by copyright, trademark, patent, trade
            secret, and other intellectual property laws.
          </p>
          <p className="text-gray-600 mb-3">
            You may not modify, reproduce, distribute, create derivative works
            or adaptations of, publicly display or in any way exploit any of our
            content or platform in whole or in part except as expressly
            authorized by us. You agree not to remove, alter, or obscure any
            copyright, trademark, service mark, or other proprietary notices.
          </p>
          <p className="text-gray-600">
            If you believe that your work has been copied in a way that
            constitutes copyright infringement, please contact us with
            information including a description of the copyrighted work,
            location of the infringing material, and your contact information.
          </p>
        </section>

        {/* AI Services */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            8. AI Services and Moderation
          </h2>
          <p className="text-gray-600 mb-3">
            Convoco employs artificial intelligence to analyze debates, provide
            feedback, fact-check content, and determine debate outcomes. You
            acknowledge that:
          </p>
          <ul className="list-disc pl-8 mb-3 text-gray-600 space-y-1">
            <li>
              AI analysis and feedback are provided on a best-effort basis and
              may not be perfect
            </li>
            <li>
              While our AI strives for objectivity, no system is entirely free
              of biases
            </li>
            <li>
              AI fact-checking may not catch all inaccuracies or may
              occasionally flag accurate information
            </li>
            <li>
              AI judgments of debate outcomes are final, though we continuously
              work to improve these systems
            </li>
          </ul>
          <p className="text-gray-600">
            By using our platform, you consent to having your content analyzed
            by our AI systems for the purposes of providing feedback,
            fact-checking, and determining debate outcomes.
          </p>
        </section>

        {/* Privacy */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            9. Privacy
          </h2>
          <p className="text-gray-600 mb-3">
            Your privacy is important to us. Our{" "}
            <Link href="/privacy" className="text-purple-600 hover:underline">
              Privacy Policy
            </Link>{" "}
            explains how we collect, use, and protect your personal information
            when you use our platform. By using Convoco, you consent to the
            collection and use of information as detailed in our Privacy Policy.
          </p>
        </section>

        {/* Termination */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            10. Termination
          </h2>
          <p className="text-gray-600 mb-3">
            We reserve the right to suspend or terminate your account and access
            to Convoco at our sole discretion, without notice, for conduct that
            we believe violates these Terms or is harmful to other users, us, or
            third parties, or for any other reason.
          </p>
          <p className="text-gray-600">
            You may terminate your account at any time by contacting us. Upon
            termination, your right to use the platform will immediately cease,
            but all provisions of these Terms that by their nature should
            survive termination shall survive.
          </p>
        </section>

        {/* Disclaimer of Warranties */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            11. Disclaimer of Warranties
          </h2>
          <p className="text-gray-600 mb-3">
            THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
            WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT
            NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
            PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
          </p>
          <p className="text-gray-600">
            We do not guarantee that the platform will be uninterrupted, secure,
            or error-free, that defects will be corrected, or that the platform
            or the server that makes it available are free of viruses or other
            harmful components. We make no warranties about the accuracy,
            reliability, completeness, or timeliness of the content, services,
            software, text, graphics, links, or communications provided on or
            through the use of the platform.
          </p>
        </section>

        {/* Limitation of Liability */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            12. Limitation of Liability
          </h2>
          <p className="text-gray-600 mb-3">
            IN NO EVENT SHALL CONVOCO, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR
            AGENTS, BE LIABLE TO YOU FOR ANY DIRECT, INDIRECT, INCIDENTAL,
            SPECIAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES WHATSOEVER RESULTING
            FROM ANY:
          </p>
          <ul className="list-disc pl-8 mb-3 text-gray-600 space-y-1">
            <li>ERRORS, MISTAKES, OR INACCURACIES OF CONTENT</li>
            <li>PERSONAL INJURY OR PROPERTY DAMAGE OF ANY NATURE WHATSOEVER</li>
            <li>
              UNAUTHORIZED ACCESS TO OR USE OF OUR SERVERS AND/OR ANY PERSONAL
              INFORMATION STORED THEREIN
            </li>
            <li>
              INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM OUR PLATFORM
            </li>
            <li>
              BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE THAT MAY BE TRANSMITTED
              TO OR THROUGH OUR PLATFORM
            </li>
            <li>
              ERRORS OR OMISSIONS IN ANY CONTENT OR FOR ANY LOSS OR DAMAGE OF
              ANY KIND INCURRED AS A RESULT OF YOUR USE OF ANY CONTENT POSTED,
              EMAILED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE PLATFORM
            </li>
          </ul>
          <p className="text-gray-600">
            THIS LIMITATION OF LIABILITY APPLIES WHETHER THE ALLEGED LIABILITY
            IS BASED ON CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY, OR ANY
            OTHER BASIS, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH
            DAMAGE.
          </p>
        </section>

        {/* Indemnification */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            13. Indemnification
          </h2>
          <p className="text-gray-600">
            You agree to defend, indemnify, and hold harmless Convoco, its
            officers, directors, employees, and agents, from and against any
            claims, liabilities, damages, losses, and expenses, including,
            without limitation, reasonable legal and accounting fees, arising
            out of or in any way connected with your access to or use of the
            platform, your violation of these Terms, or your violation of any
            third-party rights.
          </p>
        </section>

        {/* Governing Law */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            14. Governing Law
          </h2>
          <p className="text-gray-600">
            These Terms shall be governed by and construed in accordance with
            the laws of the State of Delaware, without regard to its conflict of
            law principles. Any dispute arising out of or relating to these
            Terms or your use of the platform shall be subject to the exclusive
            jurisdiction of the courts located within Delaware.
          </p>
        </section>

        {/* Contact Information */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            15. Contact Information
          </h2>
          <p className="text-gray-600">
            If you have any questions about these Terms, please contact us at{" "}
            <a
              href="mailto:quoc@uoguelph.ca"
              className="text-purple-600 hover:underline"
            >
              quoc@uoguelph.ca
            </a>
          </p>
        </section>

        {/* Agreement Button */}
        <div className="flex justify-center border-t border-gray-100 pt-6">
          <Link href="/">
            <Button variant="outline">Return to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
