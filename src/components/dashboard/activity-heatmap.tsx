"use client";

import { useEffect, useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { HeatmapSkeleton } from "./skeletons";

interface ActivityHeatmapProps {
  username: string;
  filter: "month" | "year" | "all";
}

export function ActivityHeatmap({ username, filter }: ActivityHeatmapProps) {
  const [daysData, setDaysData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredDay, setHoveredDay] = useState<{ dateString: string; solves: number } | null>(null);

  useEffect(() => {
    const fetchHeatmap = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/dashboard/heatmap?username=${encodeURIComponent(username)}&filter=${filter}`);
        if (!res.ok) throw new Error("Failed to load heatmap");
        const dbData: { date: string; count: number }[] = await res.json();
        
        // Build full list of days based on filter range
        const list = [];
        const today = new Date();
        let limitDays = 371; // 53 weeks default
        if (filter === "month") limitDays = 30;
        else if (filter === "year") limitDays = 365;

        const dataMap = new Map(dbData.map(item => [item.date, item.count]));

        for (let i = 0; i < limitDays; i++) {
          const date = new Date();
          date.setDate(today.getDate() - (limitDays - 1 - i));
          const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD
          const solves = dataMap.get(dateKey) || 0;
          
          let level = 0;
          if (solves >= 4) level = 4;
          else if (solves === 3) level = 3;
          else if (solves === 2) level = 2;
          else if (solves === 1) level = 1;

          list.push({
            dateString: date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            solves,
            level,
          });
        }
        setDaysData(list);
      } catch (err) {
        console.error("Heatmap loading error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHeatmap();
  }, [username, filter]);

  if (loading) {
    return <HeatmapSkeleton />;
  }

  // Group into columns of 7 days (weeks)
  const weeks = [];
  for (let i = 0; i < daysData.length; i += 7) {
    weeks.push(daysData.slice(i, i + 7));
  }

  // Calculate total solved count inside active data
  const totalSolves = daysData.reduce((acc, curr) => acc + curr.solves, 0);

  // Activity shade classes (LeetCode style Orange/Amber)
  const shadeClasses = [
    "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800", // 0
    "bg-orange-500/20 hover:bg-orange-500/30 dark:bg-orange-500/10 dark:hover:bg-orange-500/20", // 1
    "bg-orange-500/40 hover:bg-orange-500/50 dark:bg-orange-500/30 dark:hover:bg-orange-500/40", // 2
    "bg-orange-500/70 hover:bg-orange-500/80 dark:bg-orange-500/60 dark:hover:bg-orange-500/70", // 3
    "bg-orange-500 hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600", // 4
  ];

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white/40 p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900/20 backdrop-blur-md">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-355">Submission Activity History</h3>
          <p className="text-xs text-zinc-450 dark:text-zinc-500">Live activity logs retrieved from cache</p>
        </div>
        
        <div className="flex items-center gap-1 text-[11px] font-semibold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full">
          <Sparkles className="h-3 w-3" />
          <span>{totalSolves} Solves recorded</span>
        </div>
      </div>

      {/* Heatmap Layout container */}
      <div className="relative">
        <div className="flex overflow-x-auto pb-2 no-scrollbar">
          <div className="flex gap-[3.5px]">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3.5px]">
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`h-[11px] w-[11px] rounded-[2.5px] transition-colors cursor-pointer ${
                      shadeClasses[day.level]
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Floating tooltip */}
        <div className="mt-4 flex items-center justify-between text-xs text-zinc-555 dark:text-zinc-400">
          <div className="h-4 flex items-center">
            {hoveredDay ? (
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                {hoveredDay.solves} {hoveredDay.solves === 1 ? "problem" : "problems"} solved on {hoveredDay.dateString}
              </span>
            ) : (
              <span className="text-[11px] text-zinc-450">Hover over grids to inspect active solves</span>
            )}
          </div>
          
          <div className="flex items-center gap-1.5 text-[10px]">
            <span>Less</span>
            <div className="h-2.5 w-2.5 rounded-[1.5px] bg-zinc-100 dark:bg-zinc-900" />
            <div className="h-2.5 w-2.5 rounded-[1.5px] bg-orange-500/20 dark:bg-orange-500/10" />
            <div className="h-2.5 w-2.5 rounded-[1.5px] bg-orange-500/40 dark:bg-orange-500/30" />
            <div className="h-2.5 w-2.5 rounded-[1.5px] bg-orange-500/70 dark:bg-orange-500/60" />
            <div className="h-2.5 w-2.5 rounded-[1.5px] bg-orange-500" />
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
