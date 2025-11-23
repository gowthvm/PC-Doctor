"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { AnimatedBackground } from "@/components/ui/animated-background"
import { Particles } from "@/components/ui/particles"

export default function AboutPage() {
  return (
    <div className="min-h-screen" suppressHydrationWarning>
      <AnimatedBackground />
      <Particles />

      <main className="relative z-10 pt-8">
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text">About PC Doctor</h1>
              <p className="text-2xl md:text-3xl font-semibold text-primary">
                Empowering Everyone to Fix Their Own Tech
              </p>
            </div>

            {/* Introduction */}
            <Card className="glass-card p-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe that technical problems shouldn't stand between you and your productivity. PC Doctor was born from a simple frustration: why should fixing common computer issues require expensive support calls or hours of confusing forum diving?
              </p>
            </Card>

            {/* Mission */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To democratize computer troubleshooting by making expert-level technical guidance accessible to everyone, regardless of their technical background.
              </p>
            </div>

            {/* What We Do */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">What We Do</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                PC Doctor uses advanced AI to analyze your computer issues and provide personalized, step-by-step solutions tailored to your skill level. Whether you're a complete beginner or a seasoned tech enthusiast, we translate complex technical problems into clear, actionable guidance.
              </p>
              <p className="text-lg text-primary font-semibold">
                We don't just tell you what's wrong—we guide you through fixing it.
              </p>
            </div>

            {/* Why We're Different */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Why We're Different</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="glass-card p-6 space-y-3">
                  <h3 className="text-xl font-semibold">Personalized Intelligence</h3>
                  <p className="text-muted-foreground">
                    Our AI doesn't give generic advice. It analyzes your specific system configuration, understands your technical comfort level, and crafts solutions designed for you.
                  </p>
                </Card>

                <Card className="glass-card p-6 space-y-3">
                  <h3 className="text-xl font-semibold">Transparent & Educational</h3>
                  <p className="text-muted-foreground">
                    Every solution comes with clear explanations. You'll understand why you're taking each step, not just blindly following commands. We're here to teach, not just fix.
                  </p>
                </Card>

                <Card className="glass-card p-6 space-y-3">
                  <h3 className="text-xl font-semibold">Safety First</h3>
                  <p className="text-muted-foreground">
                    We never auto-execute changes to your system. You stay in control, with clear warnings and the ability to review every action before you take it.
                  </p>
                </Card>

                <Card className="glass-card p-6 space-y-3">
                  <h3 className="text-xl font-semibold">Multiple Difficulty Levels</h3>
                  <p className="text-muted-foreground">
                    The same problem can be solved different ways. We show you options ranging from simple to advanced, letting you choose your comfort zone.
                  </p>
                </Card>
              </div>
            </div>

            {/* Our Values */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Our Values</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1 icon-hover" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Accessibility</h3>
                    <p className="text-muted-foreground">
                      Technical knowledge shouldn't be gatekept. We break down barriers and make troubleshooting approachable for all.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1 icon-hover" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Honesty</h3>
                    <p className="text-muted-foreground">
                      If we're not confident about a diagnosis, we say so. We show probability scores and encourage second opinions when needed.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1 icon-hover" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">User Empowerment</h3>
                    <p className="text-muted-foreground">
                      Our goal isn't to make you dependent on us—it's to help you become more confident handling your own tech issues.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1 icon-hover" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Continuous Improvement</h3>
                    <p className="text-muted-foreground">
                      We learn from every interaction, refining our guidance based on what actually works in the real world.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* The Technology */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">The Technology</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                PC Doctor combines cutting-edge AI with structured diagnostic frameworks used by professional technicians. We cross-reference your problem against system specifications, common issue patterns, and solution effectiveness data to provide the most accurate guidance possible.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our platform is built on modern web technologies—fast, secure, and accessible from any device.
              </p>
            </div>

            {/* Looking Forward */}
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Looking Forward</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We're constantly evolving. Soon, we'll be adding visual guides, community-validated solutions, and preventive maintenance recommendations. Our vision is a world where computer problems are minor speedbumps, not roadblocks.
              </p>
            </div>

            {/* CTA */}
            <div className="text-center pt-8">
              <Button asChild size="lg" className="text-lg px-10 h-14 group">
                <Link href="/">
                  Back to Home
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform icon-hover" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
