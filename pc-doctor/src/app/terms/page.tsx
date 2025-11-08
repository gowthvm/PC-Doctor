"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, AlertCircle } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen" suppressHydrationWarning>
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50" />

      <main className="relative z-10 pt-8">
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Terms of Service</h1>
              <p className="text-muted-foreground">Effective Date: January 2024</p>
            </div>

            <div className="space-y-8 text-lg leading-relaxed">
              <section className="space-y-4">
                <h2 className="text-3xl font-bold">Agreement to Terms</h2>
                <p className="text-muted-foreground">
                  Welcome to PC Doctor. By accessing or using our web application, you agree to be bound by these Terms of Service. If you do not agree to these Terms, please do not use our Service.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-3xl font-bold flex items-center gap-2">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                  Important Disclaimers
                </h2>
                
                <div className="space-y-4 bg-red-500/10 border border-red-500/20 rounded-lg p-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Service Limitations</h3>
                    <p className="text-muted-foreground font-semibold mb-2">PC Doctor is a Guidance Tool, Not Professional IT Support</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>We do NOT guarantee that our solutions will fix your problem</li>
                      <li>We are NOT a replacement for professional technical support</li>
                      <li>Our AI may provide inaccurate or incomplete diagnoses</li>
                      <li>Computer problems can be complex and may require expert intervention</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2">You Use Our Service at Your Own Risk</h3>
                    <p className="text-muted-foreground">By following our guidance:</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>You acknowledge that system modifications can cause data loss or damage</li>
                      <li>You accept full responsibility for any actions taken based on our suggestions</li>
                      <li>You understand that we cannot predict every outcome for every system configuration</li>
                      <li>You agree to create backups before making any system changes</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2">🔒 No Automated Execution</h3>
                    <p className="text-muted-foreground">PC Doctor provides instructions and guidance only. We do NOT:</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Remotely access your computer</li>
                      <li>Automatically execute commands on your system</li>
                      <li>Install software without your explicit action</li>
                      <li>Make changes without your manual intervention</li>
                    </ul>
                    <p className="text-muted-foreground font-semibold mt-2">YOU maintain complete control over what happens to your computer.</p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-3xl font-bold">Eligibility</h2>
                <p className="text-muted-foreground">To use PC Doctor, you must:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Be at least 13 years of age</li>
                  <li>Have the legal capacity to enter into binding agreements</li>
                  <li>Not be prohibited from using our Service under applicable laws</li>
                  <li>Provide accurate information during registration</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-3xl font-bold">Account Registration</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold mb-2">Creating an Account</h3>
                    <p className="text-muted-foreground">To access certain features, you must:</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Provide a valid email address</li>
                      <li>Create a secure password</li>
                      <li>Accept these Terms and our Privacy Policy</li>
                      <li>Provide accurate and complete information</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Account Security</h3>
                    <p className="text-muted-foreground">You are responsible for maintaining the confidentiality of your password and all activities under your account. Notify us immediately of any unauthorized access.</p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-3xl font-bold">Acceptable Use Policy</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold mb-2 text-green-400">✅ You MAY Use PC Doctor To:</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Diagnose and troubleshoot personal computer issues</li>
                      <li>Learn about technical problem-solving</li>
                      <li>Access AI-generated guidance and solutions</li>
                      <li>Save and track your diagnostic sessions</li>
                      <li>Provide feedback on solution effectiveness</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-red-400">❌ You MAY NOT Use PC Doctor To:</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Access, modify, or damage others' computers without authorization</li>
                      <li>Distribute malware, viruses, or malicious code</li>
                      <li>Attempt to reverse engineer, decompile, or hack our platform</li>
                      <li>Scrape, data mine, or automatically collect information</li>
                      <li>Share your account credentials with others</li>
                      <li>Impersonate others or provide false information</li>
                      <li>Use our Service for any illegal purpose</li>
                      <li>Overload our servers or interfere with platform operations</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-3xl font-bold">Intellectual Property Rights</h2>
                <p className="text-muted-foreground">
                  All content on PC Doctor is protected by copyright, trademark, and other intellectual property laws. You may use our Service for personal, non-commercial purposes only. You may not copy, reproduce, distribute, or create derivative works based on our platform.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-3xl font-bold">Disclaimers and Limitation of Liability</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold mb-2">Service "As Is"</h3>
                    <p className="text-muted-foreground font-semibold">PC DOCTOR IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND.</p>
                    <p className="text-muted-foreground">We disclaim all warranties, including merchantability, fitness for a particular purpose, accuracy, reliability, and uninterrupted service.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">No Guarantee of Results</h3>
                    <p className="text-muted-foreground">We do not guarantee that our solutions will resolve your technical problems, that our diagnoses are accurate, or that following our guidance will not cause system issues.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Your Responsibility</h3>
                    <p className="text-muted-foreground">You agree to back up important data before following our guidance, verify solutions with additional sources for critical systems, and seek professional help for business-critical issues.</p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-3xl font-bold">AI-Generated Content Disclaimer</h2>
                <p className="text-muted-foreground">Our diagnostic solutions are generated using artificial intelligence:</p>
                <div className="space-y-2">
                  <p className="text-muted-foreground"><span className="font-semibold">Important Limitations:</span> AI can produce inaccurate or misleading information. Solutions are based on patterns, not guaranteed knowledge.</p>
                  <p className="text-muted-foreground"><span className="font-semibold">Best Practices:</span> Verify critical solutions with additional sources. Proceed cautiously with system-level changes. Seek professional help for mission-critical systems.</p>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-3xl font-bold">Termination</h2>
                <p className="text-muted-foreground">
                  You may delete your account at any time. We reserve the right to suspend or terminate accounts that violate these Terms, engage in fraudulent behavior, or pose security risks.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-3xl font-bold">Contact Information</h2>
                <p className="text-muted-foreground">For questions regarding these Terms:</p>
                <div className="text-muted-foreground space-y-1">
                  <p>General Inquiries: support@pcdoctor.com</p>
                  <p>Legal Matters: legal@pcdoctor.com</p>
                  <p>Abuse Reports: abuse@pcdoctor.com</p>
                </div>
              </section>

              <section className="space-y-4 bg-primary/10 border border-primary/20 rounded-lg p-6">
                <h2 className="text-2xl font-bold">Acknowledgment</h2>
                <p className="text-muted-foreground">By using PC Doctor, you acknowledge that:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>✓ You have read and understood these Terms</li>
                  <li>✓ You agree to be bound by these Terms</li>
                  <li>✓ You understand the limitations and disclaimers</li>
                  <li>✓ You accept responsibility for your use of our Service</li>
                  <li>✓ You will create backups before following system-level guidance</li>
                </ul>
              </section>

              <p className="text-muted-foreground italic text-center">
                Thank you for using PC Doctor responsibly. We're here to help guide you through technical problems, but ultimate responsibility for your system rests with you. Stay safe, back up your data, and troubleshoot confidently.
              </p>
            </div>

            {/* CTA */}
            <div className="text-center pt-8">
              <Button asChild size="lg" className="text-lg px-10 h-14 group">
                <Link href="/">
                  Back to Home
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
