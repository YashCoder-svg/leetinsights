"use client";

import { motion } from "framer-motion";
import { Check, X, ShieldAlert, Sparkles } from "lucide-react";

export function WhyChoose() {
  const comparison = [
    {
      metric: "Problem Selection",
      traditional: "Solving blindly from random list grids, often repeating mastered topics.",
      leetinsight: "Curated recommendations targeted at your specific Algorithmic weaknesses.",
      value: true,
    },
    {
      metric: "Skill Assessments",
      traditional: "Vague understanding of performance based on submission tabs.",
      leetinsight: "Detailed metrics analyzing accuracy, speed, complexity, and streak index.",
      value: true,
    },
    {
      metric: "Time Allocation",
      traditional: "Hours wasted trying to find relevant questions or reading long editorials.",
      leetinsight: "Direct path recommendations with code suggestions & complexity feedback.",
      value: true,
    },
    {
      metric: "Interview Preparation",
      traditional: "Hoping the question matches the 200 standard questions memorized.",
      leetinsight: "Ready score estimations for target tech companies.",
      value: true,
    },
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-zinc-55/30 dark:bg-zinc-950/40 border-y border-zinc-100 dark:border-zinc-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl"
          >
            Why Choose LeetInsight?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-zinc-605 dark:text-zinc-400"
          >
            We replace guess-work with quantitative direction to make your DSA prep highly structured and efficient.
          </motion.p>
        </div>

        {/* Comparison Board */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-5xl rounded-xl border border-zinc-200 bg-white/60 shadow-xl dark:border-zinc-800 dark:bg-zinc-900/30 backdrop-blur-md overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-4 text-sm font-bold text-zinc-700 dark:text-zinc-300">
            <div>Metric</div>
            <div className="mt-2 md:mt-0 flex items-center gap-1.5 text-zinc-500 dark:text-zinc-500 font-medium">
              <ShieldAlert className="h-4 w-4" />
              Traditional Way
            </div>
            <div className="mt-2 md:mt-0 flex items-center gap-1.5 text-orange-550 dark:text-orange-400">
              <Sparkles className="h-4 w-4" />
              With LeetInsight
            </div>
          </div>

          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {comparison.map((item, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-3 p-5 items-center text-sm gap-4 transition-colors hover:bg-zinc-50/40 dark:hover:bg-zinc-800/10"
              >
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">{item.metric}</div>
                <div className="flex items-start gap-2 text-zinc-500 dark:text-zinc-455">
                  <X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{item.traditional}</span>
                </div>
                <div className="flex items-start gap-2 text-zinc-800 dark:text-zinc-300 font-medium">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item.leetinsight}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
