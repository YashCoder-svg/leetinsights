"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";

export function Testimonials() {
  const testimonials = [
    {
      name: "Alex Rivera",
      role: "Software Engineer at Google",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      quote:
        "LeetInsight helped me identify my weak spots in Graph Algorithms. Instead of resolving the same sliding window problems, I focused on what mattered and cleared my Google loop in 3 weeks.",
      stars: 5,
    },
    {
      name: "Samantha Chen",
      role: "Frontend Engineer at Vercel",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Samantha",
      quote:
        "The dashboard visualization is incredibly motivating. Seeing my accuracy rise daily and having actionable recommendations took all the anxiety out of the interview prep process.",
      stars: 5,
    },
    {
      name: "Marcus Vance",
      role: "SWE Intern at Meta",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
      quote:
        "As a student, I didn't know where to start. The AI readiness score estimated which companies I was ready for, which guided my application strategy and landed me a Meta offer.",
      stars: 5,
    },
  ];

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl"
          >
            Loved by Developers
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-zinc-600 dark:text-zinc-400"
          >
            See how developers are structure-charging their preparation to secure top-tier engineering positions.
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col justify-between p-6 rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/30 backdrop-blur-sm"
            >
              <div>
                {/* Rating stars */}
                <div className="flex gap-1 mb-4 text-amber-500">
                  {Array.from({ length: t.stars }).map((_, starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed italic text-zinc-650 dark:text-zinc-400 mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 border-t border-zinc-100 dark:border-zinc-850 pt-4">
                {/* Image replacement with SVG or standard img tag to prevent Next.js image domain config errors */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-10 w-10 rounded-full border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
                />
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-150">{t.name}</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
