"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"

export function TermsAndConditions() {
  const [accepted, setAccepted] = useState(false)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Terms & Conditions
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto max-w-2xl">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <section className="space-y-2">
            <h3 className="text-lg font-semibold">1. User Responsibilities</h3>
            <p className="text-sm text-muted-foreground">
              Users are responsible for maintaining the confidentiality of their login credentials and for all
              activities that occur under their account. Users must provide accurate and complete information when
              registering.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-semibold">2. Data Privacy</h3>
            <p className="text-sm text-muted-foreground">
              We are committed to protecting your personal information. All financial data is encrypted and stored
              securely. Your information will not be shared with third parties without your explicit consent.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-semibold">3. Acceptable Use</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Use the platform only for personal financial management</li>
              <li>Do not attempt to hack, reverse engineer, or bypass security measures</li>
              <li>Do not share inappropriate or offensive content in community sections</li>
              <li>Respect intellectual property rights of the platform</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-semibold">4. Financial Information</h3>
            <p className="text-sm text-muted-foreground">
              NextStep provides tools for budget tracking and financial planning. However, we do not provide
              professional financial or investment advice. Users are responsible for their financial decisions made
              based on platform recommendations.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-semibold">5. Limitation of Liability</h3>
            <p className="text-sm text-muted-foreground">
              NextStep is provided "as is" without warranties. We are not liable for any indirect, incidental, or
              consequential damages arising from the use of our platform.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-semibold">6. Community Guidelines</h3>
            <p className="text-sm text-muted-foreground">
              When sharing budgeting tips and productivity routines, ensure content is respectful, accurate, and
              helpful. Inappropriate content will be removed, and repeat violations may result in account suspension.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-semibold">7. Changes to Terms</h3>
            <p className="text-sm text-muted-foreground">
              We reserve the right to update these terms at any time. Continued use of the platform constitutes
              acceptance of updated terms.
            </p>
          </section>

          <div className="flex items-center space-x-2 border-t pt-4">
            <Checkbox
              id="accept-terms"
              checked={accepted}
              onCheckedChange={(checked) => setAccepted(checked as boolean)}
            />
            <label htmlFor="accept-terms" className="text-sm cursor-pointer">
              I have read and agree to the Terms and Conditions
            </label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
