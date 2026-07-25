"use client";

import Link from "next/link";
import { ArrowRight, Play, Terminal } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24 grid-bg min-h-[85vh] flex items-center">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full glow-gradient opacity-80" />
      <div className="absolute top-1/3 left-1/3 -z-10 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full glow-gradient-orange opacity-40 blur-[80px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge Alert */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/5 px-4 py-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 mb-8 backdrop-blur-sm"
        >
          <Terminal className="h-3.5 w-3.5" />
          <span>v1.0.0 Now Available with AI Analytics</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto max-w-4xl font-sans text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl lg:text-7xl leading-tight sm:leading-none"
        >
          Understand Your <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
            Coding Journey
          </span>
          .
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-zinc-650 dark:text-zinc-400 sm:text-xl"
        >
          AI-powered analytics for LeetCode users. Turn your problem-solving metrics into actionable insights, identify skill gaps, and ace your technical interviews.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/register"
            className="group relative flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-orange-500 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:bg-orange-600 active:scale-95 shadow-lg shadow-orange-500/25"
          >
            Get Started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="#preview"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-6 py-3.5 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 hover:text-zinc-950 active:scale-95 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
          >
            <Play className="h-4 w-4 fill-current text-zinc-500 dark:text-zinc-450" />
            View Demo
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
