"use client";

import { motion } from "framer-motion";

export function Shimmer({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      style={style}
      className={`relative overflow-hidden bg-zinc-200/50 dark:bg-zinc-800/40 rounded-lg ${className}`}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-zinc-700/20"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
      />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white/40 p-5 shadow-sm dark:border-zinc-850 dark:bg-zinc-900/20 backdrop-blur-md">
      <div className="flex justify-between items-center mb-3">
        <Shimmer className="h-4 w-24" />
        <Shimmer className="h-5 w-5 rounded-full" />
      </div>
      <Shimmer className="h-8 w-16 mb-2" />
      <Shimmer className="h-3 w-32" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white/40 p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900/20 backdrop-blur-md flex flex-col justify-between h-72">
      <div className="flex justify-between items-center mb-4">
        <Shimmer className="h-5 w-32" />
        <Shimmer className="h-4 w-12 rounded-full" />
      </div>
      <div className="flex items-end justify-between gap-2 h-40 px-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <Shimmer
            key={i}
            className="w-full rounded-md"
            style={{ height: `${Math.floor(Math.random() * 60) + 30}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between items-center mt-4">
        <Shimmer className="h-3.5 w-16" />
        <Shimmer className="h-3.5 w-16" />
      </div>
    </div>
  );
}

export function ListSkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white/40 p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900/20 backdrop-blur-md space-y-4">
      <div className="flex justify-between items-center mb-2">
        <Shimmer className="h-5 w-36" />
        <Shimmer className="h-4.5 w-16 rounded" />
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex justify-between items-center py-2.5 border-b border-zinc-100 dark:border-zinc-800 last:border-none">
          <div className="space-y-1.5 flex-1">
            <Shimmer className="h-4.5 w-[65%]" />
            <Shimmer className="h-3 w-[30%]" />
          </div>
          <Shimmer className="h-6 w-14 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function HeatmapSkeleton() {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white/40 p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900/20 backdrop-blur-md space-y-4">
      <div className="flex justify-between items-center">
        <Shimmer className="h-5 w-40" />
        <Shimmer className="h-4 w-28" />
      </div>
      <div className="grid gap-1.5 h-32 py-2" style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}>
        {Array.from({ length: 120 }).map((_, i) => (
          <Shimmer key={i} className="aspect-square w-full rounded-sm" />
        ))}
      </div>
      <div className="flex justify-between items-center text-xs text-zinc-400">
        <Shimmer className="h-3 w-16" />
        <Shimmer className="h-3 w-28" />
      </div>
    </div>
  );
}
