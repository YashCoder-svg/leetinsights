"use client";

import { motion } from "framer-motion";
import { Brain, BarChart3, Flame, ShieldAlert, Sparkles, Terminal } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <BarChart3 className="h-6 w-6 text-orange-500" />,
      title: "Real-time Metrics Parser",
      description:
        "Visualize your problem-solving metrics. Track Easy, Medium, and Hard solve ratios, global ranking history, and category distributions.",
    },
    {
      icon: <Brain className="h-6 w-6 text-indigo-500" />,
      title: "AI Skill Gap Diagnostics",
      description:
        "Our proprietary AI assistant reviews your solve logs to identify hidden coding patterns and suggest customized problem sets.",
    },
    {
      icon: <Flame className="h-6 w-6 text-amber-500" />,
      title: "Consistency Trackers",
      description:
        "Establish coding streaks, set weekly submission targets, and configure custom notification reminders to maintain your momentum.",
    },
    {
      icon: <Terminal className="h-6 w-6 text-emerald-500" />,
      title: "Complexity Optimization",
      description:
        "Inspect runtime and space-complexity curves. Pinpoint where you rank compared to the global submissions baseline.",
    },
    {
      icon: <ShieldAlert className="h-6 w-6 text-red-500" />,
      title: "Weakness Spotter",
      description:
        "Automatically identifies algorithms or categories where you experience high submission failures (e.g., TLE or WA).",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-violet-500" />,
      title: "Interview Readiness Index",
      description:
        "Get a dynamic score estimating your technical readiness for top-tier companies based on historical coding profiles.",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="features" className="py-20 md:py-28 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-4"
          >
            <Sparkles className="h-3 w-3" />
            <span>Powerful Features</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl"
          >
            Everything you need to master DSA.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-zinc-650 dark:text-zinc-400"
          >
            Accelerate your technical preparation with analytics built on top of your historical LeetCode performance.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="relative flex flex-col p-6 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-zinc-700 transition-colors shadow-sm dark:shadow-none overflow-hidden group"
            >
              {/* Card Corner Light Gradient */}
              <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-50 border border-zinc-100 dark:bg-zinc-800 dark:border-zinc-750 mb-5 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 flex-grow">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
