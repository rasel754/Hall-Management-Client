import React from "react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl mb-6">
          Privacy Policy
        </h1>
        <p className="text-xs text-muted-foreground mb-8">Last updated: June 16, 2026</p>

        <div className="space-y-6 text-foreground leading-relaxed text-sm">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">1. Information We Collect</h2>
            <p>
              We collect information that you directly provide when registering an account, booking a room, or submitting complaints. This includes your full name, student ID, email address, phone number, department, study year, and emergency contact details.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">2. How We Use Your Information</h2>
            <p>
              Your data is processed to manage hall room assignments, verify registrations, track billing/payments, solve housing complaints, and publish official notices. We do not sell or lease student information to marketing brokers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">3. Security Standards</h2>
            <p>
              We enforce strict industry encryption standards (SSL/TLS) for data in transit and safe database storage. Access to personal student profiles is restricted to authorized admin wardens.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">4. Cookies and Web Storage</h2>
            <p>
              We use local storage keys to store auth tokens and your preferred styling mode (Light/Dark). No tracking cookies are deployed for third-party profiling.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">5. Contact Support</h2>
            <p>
              If you have questions regarding these privacy rules or want to request account deletion, please email support@hallms-university.edu.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
