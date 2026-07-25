"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  ComposedChart,
  RadialBarChart,
  RadialBar,
} from "recharts";

interface AnalyticsChartsProps {
  filter: "week" | "month" | "year" | "all";
}

export function AnalyticsCharts({ filter }: AnalyticsChartsProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-96 w-full flex items-center justify-center">Loading Visualizations...</div>;
  }

  const isDark = resolvedTheme === "dark";
  const textColor = isDark ? "#a1a1aa" : "#71717a";
  const gridColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
  const tooltipBg = isDark ? "#18181b" : "#ffffff";
  const tooltipBorder = isDark ? "#27272a" : "#e4e4e7";

  // Mock data sets depending on filter
  const getProblemsSolvedPerMonth = () => {
    if (filter === "week" || filter === "month") {
      return [
        { name: "Week 1", Easy: 4, Medium: 3, Hard: 1 },
        { name: "Week 2", Easy: 6, Medium: 4, Hard: 2 },
        { name: "Week 3", Easy: 3, Medium: 5, Hard: 1 },
        { name: "Week 4", Easy: 5, Medium: 6, Hard: 2 },
      ];
    }
    return [
      { name: "Jan", Easy: 12, Medium: 10, Hard: 2 },
      { name: "Feb", Easy: 15, Medium: 14, Hard: 3 },
      { name: "Mar", Easy: 20, Medium: 16, Hard: 4 },
      { name: "Apr", Easy: 18, Medium: 22, Hard: 5 },
      { name: "May", Easy: 24, Medium: 20, Hard: 3 },
      { name: "Jun", Easy: 23, Medium: 25, Hard: 6 },
    ];
  };

  const getProblemsSolvedPerWeek = () => {
    if (filter === "week") {
      return [
        { name: "Mon", count: 2 },
        { name: "Tue", count: 4 },
        { name: "Wed", count: 3 },
        { name: "Thu", count: 5 },
        { name: "Fri", count: 2 },
        { name: "Sat", count: 6 },
        { name: "Sun", count: 4 },
      ];
    }
    return [
      { name: "W1", count: 12 },
      { name: "W2", count: 18 },
      { name: "W3", count: 15 },
      { name: "W4", count: 22 },
      { name: "W5", count: 19 },
      { name: "W6", count: 26 },
    ];
  };

  const getDifficultyDistribution = () => {
    if (filter === "week") {
      return [
        { name: "Easy", value: 8, color: "#10b981" },
        { name: "Medium", value: 6, color: "#f59e0b" },
        { name: "Hard", value: 2, color: "#ef4444" },
      ];
    }
    return [
      { name: "Easy", value: 112, color: "#10b981" },
      { name: "Medium", value: 94, color: "#f59e0b" },
      { name: "Hard", value: 18, color: "#ef4444" },
    ];
  };

  const getAcceptanceRate = () => {
    const baseVal = filter === "week" ? 58 : filter === "month" ? 61 : 64.2;
    return [{ name: "Acceptance", value: baseVal, fill: "#f97316" }];
  };

  const getContestRatingGrowth = () => {
    if (filter === "week" || filter === "month") {
      return [
        { contest: "WC 388", rating: 1680 },
        { contest: "BC 122", rating: 1712 },
        { contest: "WC 389", rating: 1704 },
        { contest: "WC 390", rating: 1742 },
      ];
    }
    return [
      { contest: "WC 380", rating: 1510 },
      { contest: "WC 382", rating: 1560 },
      { contest: "BC 120", rating: 1612 },
      { contest: "WC 385", rating: 1640 },
      { contest: "WC 388", rating: 1680 },
      { contest: "WC 390", rating: 1742 },
    ];
  };

  const getSubmissionActivity = () => {
    if (filter === "week") {
      return [
        { name: "Mon", Active: 4, Total: 6 },
        { name: "Tue", Active: 8, Total: 10 },
        { name: "Wed", Active: 6, Total: 12 },
        { name: "Thu", Active: 10, Total: 14 },
        { name: "Fri", Active: 5, Total: 8 },
        { name: "Sat", Active: 12, Total: 16 },
        { name: "Sun", Active: 9, Total: 11 },
      ];
    }
    return [
      { name: "W1", Active: 24, Total: 40 },
      { name: "W2", Active: 36, Total: 58 },
      { name: "W3", Active: 30, Total: 52 },
      { name: "W4", Active: 44, Total: 70 },
      { name: "W5", Active: 38, Total: 64 },
      { name: "W6", Active: 52, Total: 84 },
    ];
  };

  const getTopicDistribution = () => {
    return [
      { subject: "Dynamic Prog.", solved: filter === "week" ? 20 : 64, fullMark: 100 },
      { subject: "Arrays", solved: filter === "week" ? 85 : 92, fullMark: 100 },
      { subject: "Graphs", solved: filter === "week" ? 40 : 58, fullMark: 100 },
      { subject: "Trees", solved: filter === "week" ? 50 : 72, fullMark: 100 },
      { subject: "Binary Search", solved: filter === "week" ? 65 : 80, fullMark: 100 },
    ];
  };

  const getAverageSolveTime = () => {
    return [
      { difficulty: "Easy", average: 12, target: 15 },
      { difficulty: "Medium", average: 26, target: 30 },
      { difficulty: "Hard", average: 48, target: 50 },
    ];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {/* 1. Problems Solved per Month */}
      <div className="md:col-span-2 rounded-2xl border border-zinc-200 bg-white/40 p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-900/10 backdrop-blur-md">
        <h3 className="text-xs font-bold text-zinc-550 dark:text-zinc-400 mb-4 uppercase tracking-wider">
          Problems Solved per Month / Period
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getProblemsSolvedPerMonth()}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" stroke={textColor} fontSize={10} />
              <YAxis stroke={textColor} fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: isDark ? "#fff" : "#000" }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="Easy" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Medium" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Hard" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Problems Solved per Week */}
      <div className="md:col-span-2 rounded-2xl border border-zinc-200 bg-white/40 p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-900/10 backdrop-blur-md">
        <h3 className="text-xs font-bold text-zinc-550 dark:text-zinc-400 mb-4 uppercase tracking-wider">
          Solve Velocity / Problems per Week
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={getProblemsSolvedPerWeek()}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" stroke={textColor} fontSize={10} />
              <YAxis stroke={textColor} fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: isDark ? "#fff" : "#000" }} />
              <Area type="monotone" dataKey="count" stroke="#f97316" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Difficulty Distribution */}
      <div className="rounded-2xl border border-zinc-200 bg-white/40 p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-900/10 backdrop-blur-md flex flex-col justify-between">
        <h3 className="text-xs font-bold text-zinc-550 dark:text-zinc-400 mb-4 uppercase tracking-wider">
          Difficulty Distribution
        </h3>
        <div className="h-44 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={getDifficultyDistribution()}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
              >
                {getDifficultyDistribution().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: isDark ? "#fff" : "#000" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-around text-[10px] font-bold mt-2">
          <span className="text-green-550">Easy</span>
          <span className="text-yellow-550">Medium</span>
          <span className="text-red-500">Hard</span>
        </div>
      </div>

      {/* 4. Acceptance Rate Gauge */}
      <div className="rounded-2xl border border-zinc-200 bg-white/40 p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-900/10 backdrop-blur-md flex flex-col justify-between">
        <h3 className="text-xs font-bold text-zinc-550 dark:text-zinc-400 mb-4 uppercase tracking-wider">
          Acceptance Rate
        </h3>
        <div className="h-44 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="75%"
              outerRadius="95%"
              barSize={10}
              data={getAcceptanceRate()}
              startAngle={180}
              endAngle={-180}
            >
              <RadialBar background dataKey="value" cornerRadius={5} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute flex flex-col items-center">
            <span className="text-2xl font-black">{getAcceptanceRate()[0].value}%</span>
            <span className="text-[9px] uppercase font-bold text-zinc-450">Pass rate</span>
          </div>
        </div>
        <p className="text-[10px] text-zinc-450 text-center">Calculated from total attempts</p>
      </div>

      {/* 5. Contest Rating Growth */}
      <div className="md:col-span-2 rounded-2xl border border-zinc-200 bg-white/40 p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-900/10 backdrop-blur-md">
        <h3 className="text-xs font-bold text-zinc-550 dark:text-zinc-400 mb-4 uppercase tracking-wider">
          Contest Rating Growth
        </h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={getContestRatingGrowth()}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="contest" stroke={textColor} fontSize={10} />
              <YAxis stroke={textColor} fontSize={10} domain={["dataMin - 100", "dataMax + 100"]} />
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: isDark ? "#fff" : "#000" }} />
              <Area type="monotone" dataKey="rating" stroke="#6366f1" strokeWidth={2} fill="rgba(99, 102, 241, 0.1)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 6. Submission Activity */}
      <div className="md:col-span-2 rounded-2xl border border-zinc-200 bg-white/40 p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-900/10 backdrop-blur-md">
        <h3 className="text-xs font-bold text-zinc-550 dark:text-zinc-400 mb-4 uppercase tracking-wider">
          Submission Volume / Activity
        </h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getSubmissionActivity()}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="name" stroke={textColor} fontSize={10} />
              <YAxis stroke={textColor} fontSize={10} />
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: isDark ? "#fff" : "#000" }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="Total" stroke="#f97316" strokeWidth={2.5} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="Active" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 7. Topic Distribution (Radar) */}
      <div className="rounded-2xl border border-zinc-200 bg-white/40 p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-900/10 backdrop-blur-md">
        <h3 className="text-xs font-bold text-zinc-550 dark:text-zinc-400 mb-4 uppercase tracking-wider">
          Topic Strength Map
        </h3>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getTopicDistribution()}>
              <PolarGrid stroke={gridColor} />
              <PolarAngleAxis dataKey="subject" stroke={textColor} fontSize={9} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} fontSize={8} stroke={textColor} />
              <Radar name="Solved Strength" dataKey="solved" stroke="#a855f7" fill="#a855f7" fillOpacity={0.2} />
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: isDark ? "#fff" : "#000" }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 8. Average Solve Time Composed */}
      <div className="rounded-2xl border border-zinc-200 bg-white/40 p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-900/10 backdrop-blur-md">
        <h3 className="text-xs font-bold text-zinc-555 dark:text-zinc-400 mb-4 uppercase tracking-wider">
          Solve Speed Analysis (min)
        </h3>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={getAverageSolveTime()}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="difficulty" stroke={textColor} fontSize={10} />
              <YAxis stroke={textColor} fontSize={10} label={{ value: "Minutes", angle: -90, position: "insideLeft", style: { textAnchor: "middle", fill: textColor, fontSize: 9 } }} />
              <Tooltip contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: isDark ? "#fff" : "#000" }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="average" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="target" stroke="#ec4899" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
