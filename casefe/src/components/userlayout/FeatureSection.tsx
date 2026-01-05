"use client";

import { FileText, Users, Calendar, BarChart3, Lock, Zap } from "lucide-react"
import { Card, CardContent } from "../ui/card";

const features = [
  {
    icon: FileText,
    title: "Document Management",
    description: "Organize, store, and access all case documents in one secure location with intelligent search.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Seamlessly collaborate with your team, share updates, and assign tasks in real-time.",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Never miss a deadline with automated reminders and intelligent calendar management.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description: "Track case progress, monitor team performance, and make data-driven decisions.",
  },
  {
    icon: Lock,
    title: "Bank-Level Security",
    description: "Your data is protected with enterprise-grade encryption and compliance certifications.",
  },
  {
    icon: Zap,
    title: "Workflow Automation",
    description: "Automate repetitive tasks and focus on high-value work that moves cases forward.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4 text-balance">
            Everything you need to manage cases efficiently
          </h2>
          <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
            Powerful features designed specifically for legal professionals who demand the best tools.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
export default FeaturesSection;