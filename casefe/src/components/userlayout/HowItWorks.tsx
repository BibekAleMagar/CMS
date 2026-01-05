"use client";

import { useState } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Sign Up & Setup",
    description:
      "Create your account in minutes and customize your workspace to match your firm's workflow.",
    details: [
      "Quick 2-minute setup",
      "Import existing cases",
      "Invite team members",
      "Configure permissions",
    ],
  },
  {
    number: "02",
    title: "Organize Your Cases",
    description:
      "Upload documents, set deadlines, and structure your cases with our intuitive interface.",
    details: [
      "Drag & drop documents",
      "Smart categorization",
      "Automated naming",
      "Bulk operations",
    ],
  },
  {
    number: "03",
    title: "Track",
    description:
      "Work seamlessly and track every aspect of your cases in real-time.",
    details: [
      "Real-time updates",
      "Progress tracking",
      "Activity timeline",
      "View Documents",
    ],
  },
  {
    number: "04",
    title: "Analyze & Win",
    description:
      "Leverage powerful analytics to identify patterns and improve your success rate.",
    details: [
      "Performance metrics",
      "Case insights",
      "Team analytics",
      "Custom reports",
    ],
  },
];

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8" id="work">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4 text-balance">
            How it works
          </h2>
          <p className="text-lg text-black text-pretty leading-relaxed">
            Get started in four simple steps and transform how you manage cases
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Timeline for desktop */}
          <div className="hidden lg:block mb-12">
            <div className="relative">
              {/* Progress line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-gray-50" />
              <div
                className="absolute top-1/2 left-0 h-1 bg-[#142650] -translate-y-1/2 transition-all duration-500 ease-in-out"
                style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
              />

              {/* Step indicators */}
              <div className="relative flex justify-between">
                {steps.map((step, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveStep(index)}
                    className={`flex flex-col items-center cursor-pointer  transition-all duration-300 ${
                      index === activeStep ? "scale-110" : "scale-100"
                    }`}
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300 ${
                        index <= activeStep
                          ? "bg-[#142650] text-primary-foreground  shadow-lg shadow-primary/50"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.number}
                    </div>
                    <span className={`text-sm font-medium text-black`}>
                      {step.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active step content */}
          <Card className="border-border bg-card shadow-xl overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    Step {steps[activeStep].number}
                  </div>
                  <h3 className="text-3xl font-bold text-black">
                    {steps[activeStep].title}
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {steps[activeStep].description}
                  </p>
                  <ul className="space-y-3">
                    {steps[activeStep].details.map((detail, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-3 text-muted-foreground"
                      >
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-3 pt-4">
                    {activeStep > 0 && (
                      <Button
                        className="cursor-pointer bg-white text-black border hover:bg-white"
                        onClick={() => setActiveStep(activeStep - 1)}
                      >
                        Previous
                      </Button>
                    )}
                    {activeStep < steps.length - 1 ? (
                      <Button
                        onClick={() => setActiveStep(activeStep + 1)}
                        className="gap-2 cursor-pointer"
                      >
                        Next Step
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Link href="/register">
                        <Button className="gap-2 cursor-pointer">
                          Get Started
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
                <div className="relative h-[300px] rounded-lg bg-muted/50 flex items-center justify-center">
                  <div className="text-6xl font-bold text-[#142650] ">
                    {steps[activeStep].number}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mobile step selector */}
          <div className="lg:hidden flex gap-2 justify-center mt-6">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeStep ? "w-8 bg-primary" : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
