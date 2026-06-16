import React from "react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl mb-6">
          Terms of Service
        </h1>
        <p className="text-xs text-muted-foreground mb-8">Last updated: June 16, 2026</p>

        <div className="space-y-6 text-foreground leading-relaxed text-sm">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and logging into the University Hall Management System (HallMS) portal, you agree to comply with campus regulations and these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">2. User Accounts</h2>
            <p>
              Students must provide accurate registration details (ID, department, year). You are responsible for safeguarding your login credentials. Sharing accounts is strictly forbidden.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">3. Hall Allocations and Conduct</h2>
            <p>
              Booking rooms does not guarantee allocation. Allocations are confirmed solely on official warden approval. Students housed in university rooms must adhere to quiet hours and respect roommate agreements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">4. Payments and Refunds</h2>
            <p>
              Monthly rents must be cleared before the invoice due dates. The university reserves the right to evict students or withhold transcripts for overdue payments.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">5. Eviction and Termination</h2>
            <p>
              Eviction notices are issued for property damage, code of conduct violations, or non-payment. Evicted students must vacate rooms within 72 hours of notice receipt.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
