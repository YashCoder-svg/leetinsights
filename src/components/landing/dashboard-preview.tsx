"use client";

import { motion } from "framer-motion";
import { Award, Brain, TrendingUp, CheckCircle, Sparkles } from "lucide-react";

export function DashboardPreview() {
  return (
    <section id="preview" className="relative py-16 md:py-24 bg-zinc-50/50 dark:bg-zinc-950/20 border-y border-zinc-100 dark:border-zinc-900">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-orange-500/10 to-indigo-500/5 blur-[120px] opacity-70" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl"
          >
            Insights at a Glance
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-zinc-600 dark:text-zinc-400"
          >
            Experience a rich dashboard designed to monitor progress, understand your strengths, and point you exactly to what to solve next.
          </motion.p>
        </div>

        {/* Dashboard Mockup Wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, type: "spring", bounce: 0.2 }}
          className="relative mx-auto max-w-5xl rounded-xl border border-zinc-200 bg-white p-4 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900/60 backdrop-blur-xl"
        >
          {/* Mock Browser Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-850 mb-6">
            <div className="flex gap-1.5">
              <span className="h-3.5 w-3.5 rounded-full bg-red-400/80" />
              <span className="h-3.5 w-3.5 rounded-full bg-yellow-400/80" />
              <span className="h-3.5 w-3.5 rounded-full bg-green-400/80" />
            </div>
            <div className="flex h-6 w-80 items-center justify-center rounded bg-zinc-100 px-3 text-[11px] font-medium text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
              dashboard.leetinsight.com/overview
            </div>
            <div className="w-10" />
          </div>

          {/* Grid Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Metric 1 */}
            <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-5 dark:border-zinc-800/80 dark:bg-zinc-900/40">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Total Solved</span>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">432</span>
                <span className="text-xs font-semibold text-zinc-400">/ 3200+</span>
              </div>
              {/* Solved Progress Bar */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-green-600 dark:text-green-450">Easy: 210</span>
                  <span className="text-yellow-600 dark:text-yellow-450">Medium: 180</span>
                  <span className="text-red-600 dark:text-red-450">Hard: 42</span>
                </div>
                <div className="flex h-2.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <div className="bg-green-500" style={{ width: "48%" }} />
                  <div className="bg-yellow-500" style={{ width: "42%" }} />
                  <div className="bg-red-500" style={{ width: "10%" }} />
                </div>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-5 dark:border-zinc-800/80 dark:bg-zinc-900/40">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Active Streak</span>
                <Award className="h-5 w-5 text-orange-550" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">18 Days</span>
                <span className="text-xs font-semibold text-emerald-500">+4 this week</span>
              </div>
              {/* Daily Active Blocks */}
              <div className="mt-4 flex gap-1.5 justify-between">
                {[2, 3, 0, 4, 1, 5, 2, 6, 3, 2, 4, 0, 1, 5].map((level, i) => {
                  const colors = [
                    "bg-zinc-200 dark:bg-zinc-800",
                    "bg-orange-500/20",
                    "bg-orange-500/40",
                    "bg-orange-500/60",
                    "bg-orange-500/80",
                    "bg-orange-500",
                    "bg-orange-600",
                  ];
                  return (
                    <div
                      key={i}
                      className={`h-6 w-full rounded-sm ${colors[level]}`}
                      title={`${level} problems solved`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Metric 3 */}
            <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-5 dark:border-zinc-800/80 dark:bg-zinc-900/40">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Accuracy Rate</span>
                <TrendingUp className="h-5 w-5 text-indigo-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">72.4%</span>
                <span className="text-xs font-semibold text-zinc-450 dark:text-zinc-500">Global Avg: 58%</span>
              </div>
              {/* Submissions rate chart representation */}
              <div className="mt-4 flex items-end justify-between h-8 gap-1">
                {[30, 45, 38, 55, 62, 50, 72, 80, 68, 72].map((height, i) => (
                  <div
                    key={i}
                    style={{ height: `${height}%` }}
                    className="w-full bg-gradient-to-t from-indigo-500/40 to-indigo-500 rounded-sm"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* AI Insight Row */}
          <div className="mt-4 rounded-xl border border-orange-550/20 bg-orange-500/5 p-5 dark:border-orange-500/10 dark:bg-orange-500/[0.02]">
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500 text-white">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">AI Performance Strategy</h4>
                  <span className="flex items-center gap-0.5 rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-bold text-orange-600 dark:text-orange-400">
                    <Sparkles className="h-2.5 w-2.5" />
                    Insight
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Your accuracy on <strong className="text-zinc-900 dark:text-zinc-150">Dynamic Programming (Medium)</strong> has improved by 14% over the last week. Suggesting 3 intermediate-level Tree problems next to balance your graph concept baseline before jumping to Advanced DP.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
