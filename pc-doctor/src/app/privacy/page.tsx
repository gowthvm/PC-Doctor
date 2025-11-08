"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen" suppressHydrationWarning>
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50" />

      <main className="relative z-10 pt-8">
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8 prose prose-invert max-w-none">
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Privacy Policy</h1>
              <p className="text-muted-foreground">Effective Date: January 2024</p>
            </div>

            <div className="space-y-8 text-lg leading-relaxed">
              <section className="space-y-4">
                <h2 className="text-3xl font-bold">Introduction</h2>
                <p className="text-muted-foreground">
                  At PC Doctor ("we," "our," or "us"), we are committed to protecting your privacy and ensuring transparency about how we collect, use, and safeguard your information. This Privacy Policy explains our practices regarding data collection and usage when you use our web application.
                </p>
                <p className="text-muted-foreground">
                  By using PC Doctor, you agree to the collection and use of information in accordance with this policy.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-3xl font-bold">Information We Collect</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">1. Account Information</h3>
                    <p className="text-muted-foreground">When you create an account, we collect:</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Email address</li>
                      <li>Password (encrypted and securely stored)</li>
                      <li>Account creation date</li>
                      <li>User preferences and settings</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2">2. System Information</h3>
                    <p className="text-muted-foreground">To provide accurate diagnostics, we collect:</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Operating system type and version</li>
                      <li>Hardware specifications (CPU, GPU, RAM, storage)</li>
                      <li>Software configurations you provide</li>
                      <li>Problem descriptions and symptoms you report</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2">3. Usage Data</h3>
                    <p className="text-muted-foreground">We automatically collect:</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Pages visited and features used</li>
                      <li>Time spent on different sections</li>
                      <li>Solution effectiveness ratings and feedback</li>
                      <li>Search queries within the application</li>
                      <li>Device type and browser information</li>
                      <li>IP address (for security purposes only)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2">4. Diagnostic Session Data</h3>
                    <p className="text-muted-foreground">During troubleshooting sessions, we store:</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Problem descriptions and AI-generated diagnoses</li>
                      <li>Solutions provided and steps followed</li>
                      <li>User-selected skill levels and preferences</li>
                      <li>Session timestamps and duration</li>
                      <li>Solution outcome feedback</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-2">5. Communication Data</h3>
                    <p className="text-muted-foreground">If you contact us for support:</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Email correspondence</li>
                      <li>Support ticket content</li>
                      <li>Feedback and feature requests</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-3xl font-bold">How We Use Your Information</h2>
                <p className="text-muted-foreground">We use collected information to:</p>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold">Provide Core Services</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Generate personalized diagnostic solutions</li>
                      <li>Adapt guidance to your skill level</li>
                      <li>Remember your system specifications across sessions</li>
                      <li>Track your troubleshooting progress</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold">Improve Our Platform</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Analyze which solutions are most effective</li>
                      <li>Identify common technical problems</li>
                      <li>Enhance AI diagnostic accuracy</li>
                      <li>Develop new features based on user needs</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold">Communicate With You</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Send important service updates</li>
                      <li>Respond to support requests</li>
                      <li>Notify you of relevant new features (with your consent)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold">Security and Compliance</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Prevent fraud and abuse</li>
                      <li>Enforce our Terms of Service</li>
                      <li>Comply with legal obligations</li>
                      <li>Protect user safety and platform integrity</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-3xl font-bold">How We Share Your Information</h2>
                <p className="text-muted-foreground font-semibold">We do NOT sell your personal information to third parties.</p>
                <p className="text-muted-foreground">We may share your information only in these limited circumstances:</p>
                
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold">Service Providers</h3>
                    <p className="text-muted-foreground">We work with trusted third-party services:</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Supabase (authentication and database hosting)</li>
                      <li>OpenRouter (AI diagnostic processing)</li>
                      <li>Vercel (hosting and deployment)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Processing</h3>
                    <p className="text-muted-foreground">Your problem descriptions and system specifications are sent to AI services (via OpenRouter) to generate diagnostic solutions. This data is processed securely and is not used to train third-party AI models without explicit consent.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Legal Requirements</h3>
                    <p className="text-muted-foreground">We may disclose information if required by valid legal process, law enforcement requests, or to protect rights and safety.</p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-3xl font-bold">Data Security</h2>
                <p className="text-muted-foreground">We implement industry-standard security measures including end-to-end encryption, encrypted password storage, secure authentication, and regular security audits.</p>
                <p className="text-muted-foreground font-semibold text-red-400">Important Note: No system is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-3xl font-bold">Your Rights and Choices</h2>
                <p className="text-muted-foreground">You can access, correct, delete, and export your data. To exercise these rights, contact us at privacy@pcdoctor.com or use the in-app settings.</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-3xl font-bold">Contact Us</h2>
                <p className="text-muted-foreground">For privacy-related questions, concerns, or requests:</p>
                <div className="text-muted-foreground space-y-1">
                  <p>Email: privacy@pcdoctor.com</p>
                  <p>Support: support@pcdoctor.com</p>
                </div>
                <p className="text-muted-foreground">We aim to respond to all privacy inquiries within 30 days.</p>
              </section>

              <p className="text-muted-foreground italic">
                PC Doctor is committed to protecting your privacy while helping you solve technical problems with confidence.
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
