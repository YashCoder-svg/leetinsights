"use client";

import { Brain, Sparkles, AlertTriangle, ShieldCheck, Flame, ArrowUpRight } from "lucide-react";

interface TopicInfo {
  name: string;
  solved: number;
  total: number;
  accuracy: number;
  solveTime: number; // in minutes
  strength: number;  // 0-100
  weakness: number;  // 0-100
  recommendation: "Easy" | "Medium" | "Hard";
}

export function TopicAnalysisList() {
  const topics: TopicInfo[] = [
    { name: "Arrays", solved: 42, total: 60, accuracy: 88, solveTime: 14, strength: 90, weakness: 10, recommendation: "Medium" },
    { name: "Strings", solved: 28, total: 45, accuracy: 78, solveTime: 18, strength: 80, weakness: 20, recommendation: "Medium" },
    { name: "Binary Search", solved: 15, total: 30, accuracy: 64, solveTime: 22, strength: 68, weakness: 32, recommendation: "Medium" },
    { name: "HashMap", solved: 22, total: 35, accuracy: 84, solveTime: 12, strength: 88, weakness: 12, recommendation: "Hard" },
    { name: "Tree", solved: 24, total: 50, accuracy: 72, solveTime: 24, strength: 74, weakness: 26, recommendation: "Medium" },
    { name: "Graph", solved: 12, total: 40, accuracy: 52, solveTime: 32, strength: 58, weakness: 42, recommendation: "Medium" },
    { name: "Stack", solved: 14, total: 20, accuracy: 80, solveTime: 15, strength: 82, weakness: 18, recommendation: "Medium" },
    { name: "Queue", solved: 8, total: 15, accuracy: 78, solveTime: 16, strength: 75, weakness: 25, recommendation: "Medium" },
    { name: "Heap", solved: 10, total: 25, accuracy: 60, solveTime: 28, strength: 62, weakness: 38, recommendation: "Medium" },
    { name: "Greedy", solved: 14, total: 35, accuracy: 58, solveTime: 29, strength: 55, weakness: 45, recommendation: "Easy" },
    { name: "Dynamic Programming", solved: 8, total: 45, accuracy: 38, solveTime: 42, strength: 34, weakness: 66, recommendation: "Easy" },
    { name: "Trie", solved: 2, total: 10, accuracy: 40, solveTime: 38, strength: 42, weakness: 58, recommendation: "Easy" },
    { name: "Linked List", solved: 19, total: 25, accuracy: 82, solveTime: 11, strength: 85, weakness: 15, recommendation: "Hard" },
    { name: "Backtracking", solved: 4, total: 20, accuracy: 32, solveTime: 44, strength: 28, weakness: 72, recommendation: "Easy" },
    { name: "Math", solved: 11, total: 30, accuracy: 62, solveTime: 20, strength: 65, weakness: 35, recommendation: "Medium" },
  ];

  // Weak topics (Weakness score >= 60)
  const weakTopics = topics.filter((t) => t.weakness >= 60).sort((a, b) => b.weakness - a.weakness);
  
  // Recommend what to practice next (the top weakness topics)
  const practiceRecommendations = topics
    .sort((a, b) => b.weakness - a.weakness)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* 1. TOP HIGHLIGHTS & PRACTICE RECOMMENDATIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Practice Next Recommendation Box */}
        <div className="md:col-span-2 rounded-2xl border border-orange-500/20 bg-orange-500/5 p-6 dark:border-orange-500/10 dark:bg-orange-500/[0.015] backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-5 w-5 text-orange-500" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                AI Target Recommendations
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-zinc-650 dark:text-zinc-400 mb-4">
              Our analysis model suggests focusing on your high-weakness algorithmic structures to balance your DSA readiness index. Solve these recommended topics next:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {practiceRecommendations.map((rec, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-zinc-200 bg-white/60 dark:border-zinc-800 dark:bg-zinc-950/40 text-xs">
                  <span className="font-bold block text-zinc-800 dark:text-zinc-200">{rec.name}</span>
                  <div className="flex justify-between items-center mt-2 text-[10px]">
                    <span className="text-red-500 font-bold">Weakness: {rec.weakness}%</span>
                    <span className="bg-orange-500/10 text-orange-500 px-1.5 py-0.5 rounded font-semibold uppercase">
                      {rec.recommendation}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Highlighted Weak Topics alerts count */}
        <div className="md:col-span-1 rounded-2xl border border-red-500/20 bg-red-500/5 p-6 dark:border-red-500/10 dark:bg-red-500/[0.015] backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-red-550" />
              <h3 className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                Action Areas
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-450 mb-3">
              You have <strong className="text-red-500">{weakTopics.length} critical weak topics</strong> where accuracy is below 50% and solving delay exceeds 40 mins.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {weakTopics.map((wt, i) => (
              <span key={i} className="text-[10px] font-bold text-red-600 bg-red-500/10 dark:text-red-450 px-2.5 py-1 rounded-md">
                {wt.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. TOPICS CARD GRID */}
      <div>
        <h3 className="text-xs font-bold text-zinc-550 dark:text-zinc-500 mb-4 uppercase tracking-wider">
          DSA Topic Breakdown ({topics.length} Areas)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {topics.map((t, idx) => {
            const solvedPercentage = (t.solved / t.total) * 100;
            const isWeak = t.weakness >= 60;

            return (
              <div
                key={idx}
                className={`relative flex flex-col justify-between p-5 rounded-2xl border bg-white/40 shadow-sm dark:bg-zinc-900/10 backdrop-blur-md transition-all duration-300 ${
                  isWeak
                    ? "border-red-500/30 shadow-lg shadow-red-500/[0.02]"
                    : "border-zinc-200/80 hover:border-zinc-300 dark:border-zinc-850 dark:hover:border-zinc-700"
                }`}
              >
                {/* Glow alert indicator for weak topics */}
                {isWeak && (
                  <div className="absolute top-3 right-3 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-black tracking-tight text-zinc-900 dark:text-white truncate">
                    {t.name}
                  </h4>
                  <div className="mt-1 flex items-baseline gap-1 text-[11px] text-zinc-450 dark:text-zinc-500">
                    <span className="font-bold text-zinc-700 dark:text-zinc-350">{t.solved}</span>
                    <span>/</span>
                    <span>{t.total} solved</span>
                  </div>

                  {/* Animated Progress Bar */}
                  <div className="mt-3.5 h-1.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isWeak ? "bg-red-500" : "bg-orange-500"
                      }`}
                      style={{ width: `${solvedPercentage}%` }}
                    />
                  </div>

                  {/* Core Metrics lists */}
                  <div className="mt-4 space-y-2 border-t border-zinc-100 dark:border-zinc-850 pt-3 text-[10px] text-zinc-550 dark:text-zinc-450">
                    <div className="flex justify-between">
                      <span>Accuracy:</span>
                      <span className="font-bold text-zinc-750 dark:text-zinc-300">{t.accuracy}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Solve Time:</span>
                      <span className="font-bold text-zinc-750 dark:text-zinc-300">{t.solveTime} min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Diagnostics:</span>
                      <span className="flex gap-1.5 font-bold">
                        <span className="text-emerald-500" title="Strength">S:{t.strength}</span>
                        <span className="text-red-500" title="Weakness">W:{t.weakness}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-zinc-100 dark:border-zinc-850 flex items-center justify-between text-[9px] font-bold">
                  <span className="text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">Practice Next</span>
                  <span className={`px-2 py-0.5 rounded-full uppercase ${
                    isWeak ? "bg-red-500/10 text-red-500" : "bg-orange-500/10 text-orange-500"
                  }`}>
                    {t.recommendation}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
