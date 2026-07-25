"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";

export function Pricing() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      description: "Essential analytics for individual coding trackers.",
      features: [
        "Dashboard overview",
        "Total solved problem metrics",
        "Accuracy rate parser",
        "Manual sync",
      ],
      cta: "Get Started",
      href: "/register",
      popular: false,
    },
    {
      name: "Pro",
      price: "$9",
      period: "/month",
      description: "AI guidance to supercharge interview preparation.",
      features: [
        "Everything in Free",
        "AI Diagnostic skill-gap detection",
        "Personalized problem path maps",
        "Company readiness index",
        "Interactive analytics dashboard",
        "Daily automated syncing",
      ],
      cta: "Start 7-day Free Trial",
      href: "/register",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Tailored dashboard and reporting for bootcamps.",
      features: [
        "Everything in Pro",
        "Multi-student leaderboards",
        "Custom programmatic reporting",
        "Dedicated account manager",
        "SAML SSO integrations",
      ],
      cta: "Contact Sales",
      href: "mailto:sales@leetinsight.com",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 md:py-28 relative overflow-hidden bg-zinc-55/30 dark:bg-zinc-950/40 border-y border-zinc-100 dark:border-zinc-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl"
          >
            Transparent Pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-zinc-600 dark:text-zinc-400"
          >
            Unlock diagnostic AI insights. Choose the tier that corresponds with your engineering ambition.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
          {tiers.map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative flex flex-col justify-between p-8 rounded-2xl border ${
                tier.popular
                  ? "border-orange-500 bg-zinc-900 text-white dark:bg-zinc-900 shadow-xl shadow-orange-500/10"
                  : "border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/30"
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-1/2 -translate-y-1/2 translate-x-1/2 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Most Popular
                </div>
              )}

              <div>
                <h3 className={`text-xl font-bold ${tier.popular ? "text-white" : "text-zinc-900 dark:text-white"}`}>
                  {tier.name}
                </h3>
                <p className={`mt-2 text-sm leading-relaxed ${tier.popular ? "text-zinc-400" : "text-zinc-500 dark:text-zinc-400"}`}>
                  {tier.description}
                </p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className={`text-4xl font-extrabold ${tier.popular ? "text-white" : "text-zinc-900 dark:text-white"}`}>
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className={`text-sm ${tier.popular ? "text-zinc-400" : "text-zinc-500 dark:text-zinc-400"}`}>
                      {tier.period}
                    </span>
                  )}
                </div>

                <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-6" />

                <ul className="space-y-3.5">
                  {tier.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2.5 text-sm">
                      <Check className={`h-4.5 w-4.5 shrink-0 mt-0.5 ${tier.popular ? "text-orange-400" : "text-orange-500"}`} />
                      <span className={tier.popular ? "text-zinc-350" : "text-zinc-650 dark:text-zinc-300"}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  href={tier.href}
                  className={`flex w-full items-center justify-center rounded-lg py-3 text-sm font-semibold transition-all active:scale-98 ${
                    tier.popular
                      ? "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/20"
                      : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
