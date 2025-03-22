// src/app/privacy/page.tsx
"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function PrivacyPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>

      <div className="bg-white rounded-xl p-8 shadow-md border border-gray-200 space-y-8">
        {/* Last Updated Notice */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <p className="text-sm text-gray-500">Last Updated: March 15, 2025</p>
          <Link
            href="/terms"
            className="text-purple-600 hover:underline text-sm"
          >
            View Terms of Service
          </Link>
        </div>

        {/* Introduction */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            1. Introduction
          </h2>
          <p className="text-gray-600 mb-3">
            At Convoco ("we," "our," or "us"), we respect your privacy and are
            committed to protecting your personal information. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your
            information when you use our debate platform.
          </p>
          <p className="text-gray-600 mb-3">
            Please read this Privacy Policy carefully. By accessing or using
            Convoco, you acknowledge that you have read, understood, and agree
            to be bound by all the terms of this Privacy Policy. If you do not
            agree with our policies and practices, please do not use our
            platform.
          </p>
          <p className="text-gray-600">
            This Privacy Policy may change from time to time. We will notify you
            of any changes by posting the new Privacy Policy on this page and
            updating the "Last Updated" date. You are advised to review this
            Privacy Policy periodically for any changes.
          </p>
        </section>

        {/* Information We Collect */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            2. Information We Collect
          </h2>
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              2.1 Information You Provide to Us
            </h3>
            <p className="text-gray-600 mb-3">
              We collect several types of information from and about users of
              our platform, including:
            </p>
            <ul className="list-disc pl-8 mb-3 text-gray-600 space-y-1">
              <li>
                <span className="font-medium">Personal Information:</span> When
                you register for an account, we collect your email address,
                username, and password. Optionally, you may provide additional
                information such as your profile picture, location, gender,
                biography, and debate interests.
              </li>
              <li>
                <span className="font-medium">Debate Content:</span> We collect
                the content you create, upload, or generate while using our
                platform, including debate arguments, comments, and feedback.
              </li>
              <li>
                <span className="font-medium">Communications:</span> If you
                contact us directly, we may receive additional information about
                you, such as your name, email address, phone number, the
                contents of your message, and any attachments you may send.
              </li>
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              2.2 Information We Collect Automatically
            </h3>
            <p className="text-gray-600 mb-3">
              When you visit, use, or navigate our platform, we may collect
              information automatically, including:
            </p>
            <ul className="list-disc pl-8 mb-3 text-gray-600 space-y-1">
              <li>
                <span className="font-medium">Usage Information:</span> We
                collect information about your interactions with our platform,
                including the debates you participate in, the content you view,
                and the features you use.
              </li>
              <li>
                <span className="font-medium">Device Information:</span> We
                collect information about the device you use to access our
                platform, including the hardware model, operating system and
                version, unique device identifiers, and mobile network
                information.
              </li>
              <li>
                <span className="font-medium">Location Information:</span> We
                may collect your approximate location derived from your IP
                address.
              </li>
              <li>
                <span className="font-medium">Log Information:</span> We
                automatically collect log information when you use our platform,
                including your IP address, browser type, access times, pages
                viewed, and the page you visited before navigating to our
                platform.
              </li>
              <li>
                <span className="font-medium">
                  Cookies and Similar Technologies:
                </span>{" "}
                We use cookies and similar tracking technologies to track
                activity on our platform and to maintain certain information.
                Cookies are files with a small amount of data that may include
                an anonymous unique identifier.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              2.3 Information from Third Parties
            </h3>
            <p className="text-gray-600">
              We may receive information about you from third parties,
              including:
            </p>
            <ul className="list-disc pl-8 mb-3 text-gray-600 space-y-1">
              <li>
                <span className="font-medium">Authentication Providers:</span>{" "}
                If you choose to register or log in to our platform using a
                third-party service (such as Google), we may receive information
                about you from that service, in accordance with the
                authorization procedures determined by that service.
              </li>
              <li>
                <span className="font-medium">Analytics Partners:</span> We may
                receive information from analytics providers who help us
                understand how users interact with our platform.
              </li>
            </ul>
          </div>
        </section>

        {/* How We Use Your Information */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            3. How We Use Your Information
          </h2>
          <p className="text-gray-600 mb-3">
            We use the information we collect for various purposes, including
            to:
          </p>
          <ul className="list-disc pl-8 mb-3 text-gray-600 space-y-1">
            <li>Provide, maintain, and improve our platform and services</li>
            <li>
              Create and manage your account, including to authenticate your
              identity
            </li>
            <li>
              Process and fulfill your participation in debates, including to
              match you with appropriate opponents
            </li>
            <li>
              Provide AI-powered analysis, feedback, fact-checking, and debate
              outcome determination
            </li>
            <li>
              Communicate with you about your account, our services, updates,
              and other matters
            </li>
            <li>
              Personalize your experience and deliver content relevant to your
              interests
            </li>
            <li>
              Monitor and analyze usage patterns, trends, and activities related
              to our platform
            </li>
            <li>
              Detect, prevent, and address technical issues, security breaches,
              and fraudulent activities
            </li>
            <li>
              Comply with legal obligations and enforce our terms and policies
            </li>
            <li>
              Improve our AI systems through analysis of debate content and user
              interactions
            </li>
          </ul>
        </section>

        {/* Data Sharing and Disclosure */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            4. Data Sharing and Disclosure
          </h2>
          <p className="text-gray-600 mb-3">
            We may share your information in the following situations:
          </p>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              4.1 With Your Consent
            </h3>
            <p className="text-gray-600">
              We may share your information with third parties when you have
              given us your consent to do so.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              4.2 Service Providers
            </h3>
            <p className="text-gray-600">
              We may share your information with third-party vendors, service
              providers, contractors, or agents who perform services for us or
              on our behalf and require access to such information to do that
              work. These may include payment processing, data analysis, email
              delivery, hosting services, customer service, and marketing
              efforts.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              4.3 Platform Features
            </h3>
            <p className="text-gray-600">
              Certain aspects of your information may be visible to other users
              of the platform. For example, your username, profile information,
              and debate arguments are visible to users participating in the
              same debate as you. Public debates may be visible to all users of
              the platform.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              4.4 Legal Requirements
            </h3>
            <p className="text-gray-600">
              We may disclose your information where required to do so by law or
              subpoena or if we reasonably believe that such action is necessary
              to (a) comply with the law and the reasonable requests of law
              enforcement; (b) protect the security or integrity of our
              platform; and/or (c) exercise or protect the rights, property, or
              personal safety of Convoco, our users, or others.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              4.5 Business Transfers
            </h3>
            <p className="text-gray-600">
              If we are involved in a merger, acquisition, or sale of all or a
              portion of our assets, your information may be transferred as part
              of that transaction. We will notify you via email and/or a
              prominent notice on our platform of any change in ownership or
              uses of your personal information.
            </p>
          </div>
        </section>

        {/* AI Processing and Data Usage */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            5. AI Processing and Data Usage
          </h2>
          <p className="text-gray-600 mb-3">
            Convoco uses artificial intelligence systems to analyze debate
            content, provide feedback, conduct fact-checking, and determine
            debate outcomes. By using our platform, you acknowledge and consent
            to:
          </p>
          <ul className="list-disc pl-8 mb-3 text-gray-600 space-y-1">
            <li>
              The automated processing of your debate arguments and other
              content by our AI systems
            </li>
            <li>
              The use of your debate content to train, improve, and refine our
              AI models and algorithms
            </li>
            <li>
              The storage and analysis of debate content for analytical purposes
            </li>
          </ul>
          <p className="text-gray-600">
            We take measures to ensure that AI processing is fair, transparent,
            and aligned with our platform's educational mission. While we strive
            for accuracy in our AI systems, we cannot guarantee that
            AI-generated feedback, fact-checking, and outcome determinations
            will be entirely free from errors or biases.
          </p>
        </section>

        {/* Data Retention */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            6. Data Retention
          </h2>
          <p className="text-gray-600 mb-3">
            We will retain your personal information only for as long as is
            necessary for the purposes set out in this Privacy Policy. We will
            retain and use your information to the extent necessary to comply
            with our legal obligations, resolve disputes, enforce our policies,
            and protect our legal interests.
          </p>
          <p className="text-gray-600">
            When you delete your account, we will remove your personal profile
            information. However, debate content may be retained in an
            anonymized form for analytical, educational, and AI training
            purposes. If you wish to have specific debate content removed,
            please contact us at{" "}
            <a
              href="mailto:quoc@uoguelph.ca"
              className="text-purple-600 hover:underline"
            >
              quoc@uoguelph.ca
            </a>
            .
          </p>
        </section>

        {/* Your Rights */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            7. Your Rights
          </h2>
          <p className="text-gray-600 mb-3">
            Depending on your location, you may have certain rights regarding
            your personal information, including:
          </p>
          <ul className="list-disc pl-8 mb-3 text-gray-600 space-y-1">
            <li>
              <span className="font-medium">Access:</span> You can request
              copies of your personal information that we hold.
            </li>
            <li>
              <span className="font-medium">Correction:</span> You can ask us to
              correct any information you believe is inaccurate or incomplete.
            </li>
            <li>
              <span className="font-medium">Deletion:</span> You can ask us to
              erase your personal information in certain circumstances.
            </li>
            <li>
              <span className="font-medium">Restriction:</span> You can ask us
              to restrict the processing of your information in certain
              circumstances.
            </li>
            <li>
              <span className="font-medium">Data Portability:</span> You may
              request that we transfer your information to another organization
              or directly to you.
            </li>
            <li>
              <span className="font-medium">Objection:</span> You can object to
              our processing of your information in certain circumstances.
            </li>
          </ul>
          <p className="text-gray-600">
            To exercise any of these rights, please contact us at{" "}
            <a
              href="mailto:quoc@uoguelph.ca"
              className="text-purple-600 hover:underline"
            >
              quoc@uoguelph.ca
            </a>
            . We may ask you to verify your identity before responding to such
            requests.
          </p>
        </section>

        {/* Cookies */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            8. Cookies and Tracking Technologies
          </h2>
          <p className="text-gray-600 mb-3">
            We use cookies and similar tracking technologies to track activity
            on our platform and hold certain information. Cookies are files with
            a small amount of data that may include an anonymous unique
            identifier.
          </p>
          <p className="text-gray-600 mb-3">Types of cookies we use:</p>
          <ul className="list-disc pl-8 mb-3 text-gray-600 space-y-1">
            <li>
              <span className="font-medium">Essential Cookies:</span> Necessary
              for the operation of our platform, enabling you to navigate and
              use features.
            </li>
            <li>
              <span className="font-medium">
                Analytical/Performance Cookies:
              </span>{" "}
              Allow us to recognize and count the number of visitors and see how
              visitors move around our platform.
            </li>
            <li>
              <span className="font-medium">Functionality Cookies:</span> Used
              to recognize you when you return to our platform, enabling us to
              personalize content and remember your preferences.
            </li>
            <li>
              <span className="font-medium">Targeting Cookies:</span> Record
              your visit to our platform, the pages you have visited, and the
              links you have followed.
            </li>
          </ul>
          <p className="text-gray-600">
            You can instruct your browser to refuse all cookies or to indicate
            when a cookie is being sent. However, if you do not accept cookies,
            you may not be able to use some portions of our platform. Most web
            browsers automatically accept cookies, but you can usually modify
            your browser settings to decline cookies if you prefer.
          </p>
        </section>

        {/* Data Security */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            9. Data Security
          </h2>
          <p className="text-gray-600 mb-3">
            The security of your data is important to us. We use commercially
            reasonable measures to protect your personal information from
            unauthorized access, alteration, disclosure, or destruction. These
            measures include encryption, secure socket layer technology,
            firewalls, and regular security assessments.
          </p>
          <p className="text-gray-600 mb-3">
            However, no method of transmission over the Internet, or method of
            electronic storage, is 100% secure. While we strive to use
            commercially acceptable means to protect your personal information,
            we cannot guarantee its absolute security.
          </p>
          <p className="text-gray-600">
            If you have reason to believe that your interaction with us is no
            longer secure, please immediately notify us by contacting us at{" "}
            <a
              href="mailto:quoc@uoguelph.ca"
              className="text-purple-600 hover:underline"
            >
              quoc@uoguelph.ca
            </a>
            .
          </p>
        </section>

        {/* Children's Privacy */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            10. Children's Privacy
          </h2>
          <p className="text-gray-600 mb-3">
            Our platform is not intended for use by children under the age of 13
            (or 16 in the European Union). We do not knowingly collect
            personally identifiable information from children under 13. If you
            are a parent or guardian and you are aware that your child has
            provided us with personal information, please contact us at{" "}
            <a
              href="mailto:quoc@uoguelph.ca"
              className="text-purple-600 hover:underline"
            >
              quoc@uoguelph.ca
            </a>
            . If we become aware that we have collected personal information
            from children without verification of parental consent, we will take
            steps to remove that information from our servers.
          </p>
        </section>

        {/* International Data Transfers */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            11. International Data Transfers
          </h2>
          <p className="text-gray-600">
            Our platform is operated in the United States. If you are located
            outside of the United States, please be aware that information we
            collect will be transferred to and processed in the United States.
            By using the platform or providing us with any information, you
            consent to this transfer, processing, and storage of your
            information in the United States, where privacy laws may not be as
            comprehensive as those in your country of residence.
          </p>
        </section>

        {/* Changes to Privacy Policy */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            12. Changes to This Privacy Policy
          </h2>
          <p className="text-gray-600">
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Last Updated" date. You are advised to review this
            Privacy Policy periodically for any changes. Changes to this Privacy
            Policy are effective when they are posted on this page. Your
            continued use of the platform after we post changes to this Privacy
            Policy means that you accept those changes.
          </p>
        </section>

        {/* Contact Us */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            13. Contact Us
          </h2>
          <p className="text-gray-600">
            If you have any questions about this Privacy Policy or our data
            practices, please contact us at:
          </p>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mt-3">
            <p className="text-gray-700 mb-1">
              Email:{" "}
              <a
                href="mailto:quoc@uoguelph.ca"
                className="text-purple-600 hover:underline"
              >
                quoc@uoguelph.ca
              </a>
            </p>
          </div>
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
