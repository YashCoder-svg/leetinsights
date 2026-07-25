"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function FAQ() {
  const faqs = [
    {
      question: "How does LeetInsight connect to my LeetCode profile?",
      answer: "We sync statistics by querying public LeetCode profiles. You only need to supply your LeetCode username. We never ask for your password, cookies, or any sensitive credentials.",
    },
    {
      question: "What does the AI Skill Gap Diagnostic do?",
      answer: "Our analytics model evaluates your historical submissions, timing data, and categories. It recognizes if you struggle with specific concepts (like backtracking or dynamic programming) and structures personalized paths to fill those gaps.",
    },
    {
      question: "Can I use LeetInsight for free?",
      answer: "Yes, our Free tier provides standard dashboard summaries, solved counts, accuracy charts, and manual sync capabilities. Pro unlocks advanced AI diagnostics, customized routes, and company readiness reports.",
    },
    {
      question: "How is the Company Readiness Index calculated?",
      answer: "We analyze company-specific question distributions (e.g., questions frequently asked at Google or Meta over the last 6 months) and index your performance stats against those specific topics to output a preparation readiness estimate.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 md:py-28 relative overflow-hidden">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-zinc-600 dark:text-zinc-400"
          >
            Find answers to common questions about syncing, AI analytics, and plans.
          </motion.p>
        </div>

        {/* Collapsible Accordion Grid */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/30 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-center justify-between p-5 text-left font-semibold text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors"
                >
                  <span>{faq.question}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-5 w-5 text-zinc-500" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="border-t border-zinc-150 p-5 text-sm leading-relaxed text-zinc-650 dark:border-zinc-800 dark:text-zinc-400 bg-zinc-50/30 dark:bg-zinc-900/10">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
