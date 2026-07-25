"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ActivityHeatmap } from "@/components/dashboard/activity-heatmap";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { TopicAnalysisList } from "@/components/dashboard/topic-analysis-list";
import {
  CardSkeleton,
  ChartSkeleton,
  ListSkeleton,
} from "@/components/dashboard/skeletons";
import {
  Code2,
  LogOut,
  LayoutDashboard,
  BarChart3,
  PieChart,
  Award,
  Calendar,
  CheckSquare,
  FileText,
  Brain,
  Settings,
  Search,
  Bell,
  Menu,
  X,
  ChevronLeft,
  RefreshCw,
  CheckCircle,
  TrendingUp,
  Clock,
  Sparkles,
  User,
  Plus,
  Trash2,
  Check,
  Send,
  AlertCircle,
  HelpCircle,
  Loader2,
  ArrowUpRight,
  ShieldCheck,
  Compass,
  Sprout,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

// Custom GitHub inline SVG to prevent import failures
const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const BADGES_LIST = [
  {
    id: "starter",
    name: "Starter Coder",
    desc: "Began the analytics and tracking journey.",
    req: "Reach Level 1",
    icon: Sparkles,
    bgClass: "bg-zinc-500/5 border-zinc-200/40 dark:bg-zinc-950/20 dark:border-zinc-800/80",
    iconBgClass: "bg-zinc-400 dark:bg-zinc-650",
    glowColor: "rgba(156, 163, 175, 0.25)",
  },
  {
    id: "dp",
    name: "DP Sensei",
    desc: "Unlocking advanced dynamic programming solutions.",
    req: "Set Dynamic Programming milestones",
    icon: Brain,
    bgClass: "bg-pink-500/5 border-pink-500/20 dark:bg-pink-950/10 dark:border-pink-500/20",
    iconBgClass: "bg-pink-500 dark:bg-pink-600",
    glowColor: "rgba(236, 72, 153, 0.25)",
  },
  {
    id: "graph",
    name: "Graph Voyager",
    desc: "Conquering complex traversal algorithms.",
    req: "Practice graphs and trees analytics",
    icon: TrendingUp,
    bgClass: "bg-cyan-500/5 border-cyan-500/20 dark:bg-cyan-950/10 dark:border-cyan-500/20",
    iconBgClass: "bg-cyan-500 dark:bg-cyan-600",
    glowColor: "rgba(6, 182, 212, 0.25)",
  },
  {
    id: "architect",
    name: "Code Architect",
    desc: "Log optimized complexity revision notes.",
    req: "Create 3+ revision notes",
    icon: Code2,
    bgClass: "bg-emerald-500/5 border-emerald-500/20 dark:bg-emerald-950/10 dark:border-emerald-500/20",
    iconBgClass: "bg-emerald-500 dark:bg-emerald-600",
    glowColor: "rgba(16, 185, 129, 0.25)",
  },
  {
    id: "streak",
    name: "Daily Warrior",
    desc: "Maintaining consistent daily solves streak.",
    req: "Reach a 7+ day solve streak",
    icon: ShieldCheck,
    bgClass: "bg-orange-500/5 border-orange-500/20 dark:bg-orange-950/10 dark:border-orange-500/20",
    iconBgClass: "bg-orange-500 dark:bg-orange-600",
    glowColor: "rgba(249, 115, 22, 0.25)",
  },
  {
    id: "elite",
    name: "LeetInsight Elite",
    desc: "Master of problem tracking and revision.",
    req: "Unlock all badges and level up",
    icon: Award,
    bgClass: "bg-yellow-500/5 border-yellow-500/20 dark:bg-yellow-950/10 dark:border-yellow-550/20",
    iconBgClass: "bg-yellow-555 dark:bg-yellow-600",
    glowColor: "rgba(234, 179, 8, 0.25)",
  },
  {
    id: "stack",
    name: "Stack Slinger",
    desc: "Solve stack and queue challenges.",
    req: "Revision notes contain 'stack' or 'queue'",
    icon: Sprout,
    bgClass: "bg-teal-500/5 border-teal-500/20 dark:bg-teal-950/10 dark:border-teal-500/20",
    iconBgClass: "bg-teal-500 dark:bg-teal-600",
    glowColor: "rgba(20, 184, 166, 0.25)",
  },
  {
    id: "search",
    name: "Search Master",
    desc: "Conquering search limits.",
    req: "Goals checklist contains 'search' or 'binary'",
    icon: Compass,
    bgClass: "bg-indigo-500/5 border-indigo-500/20 dark:bg-indigo-950/10 dark:border-indigo-500/20",
    iconBgClass: "bg-indigo-550 dark:bg-indigo-600",
    glowColor: "rgba(99, 102, 241, 0.25)",
  },
];

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loadingView, setLoadingView] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  // Search & notification mock triggers
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "LeetCode synchronization was successful.", read: false, time: "Just now" },
    { id: 2, text: "AI Coach suggested practicing 'Sliding Window' patterns.", read: false, time: "2 hours ago" },
  ]);

  // Real LeetCode GraphQL fetch states
  const [leetcodeUsername, setLeetcodeUsername] = useState<string>("");
  const [leetcodeData, setLeetcodeData] = useState<any | null>(null);
  const [fetchingData, setFetchingData] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Syncing details
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [streak, setStreak] = useState(12);
  const [timeFilter, setTimeFilter] = useState<"week" | "month" | "year" | "all">("month");

  // Daily Goals States
  const [goalsList, setGoalsList] = useState<any[]>([]);
  const [newGoalText, setNewGoalText] = useState("");
  const [userProgress, setUserProgress] = useState<any>({ xp: 0, level: 1, streak: 0, badges: ["Welcome Coder"] });

  // Heatmap States
  const [heatmapFilter, setHeatmapFilter] = useState<"month" | "year">("year");

  // Revision Planner States
  const [revisionNotes, setRevisionNotes] = useState<any[]>([]);
  const [revisionSearch, setRevisionSearch] = useState("");
  const [revisionBookmarkFilter, setRevisionBookmarkFilter] = useState(false);
  const [revisionFavoriteFilter, setRevisionFavoriteFilter] = useState(false);
  const [studyMode, setStudyMode] = useState<"list" | "flashcard">("list");
  const [flippedNotes, setFlippedNotes] = useState<Record<string, boolean>>({});
  const [dailyGoalTarget, setDailyGoalTarget] = useState(3);
  const [defaultDifficulty, setDefaultDifficulty] = useState("medium");
  const [studyReminder, setStudyReminder] = useState("daily");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedGoal = localStorage.getItem("leetinsight_daily_goal");
      if (savedGoal) setDailyGoalTarget(parseInt(savedGoal, 10));
      
      const savedDiff = localStorage.getItem("leetinsight_default_difficulty");
      if (savedDiff) setDefaultDifficulty(savedDiff);

      const savedReminder = localStorage.getItem("leetinsight_study_reminder");
      if (savedReminder) setStudyReminder(savedReminder);
    }
  }, []);

  const handleUpdateDailyGoal = (val: number) => {
    setDailyGoalTarget(val);
    localStorage.setItem("leetinsight_daily_goal", val.toString());
  };

  const handleUpdateDifficulty = (val: string) => {
    setDefaultDifficulty(val);
    localStorage.setItem("leetinsight_default_difficulty", val);
  };

  const handleUpdateReminder = (val: string) => {
    setStudyReminder(val);
    localStorage.setItem("leetinsight_study_reminder", val);
  };

  // Quiz states
  const [quizActive, setQuizActive] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFlipped, setQuizFlipped] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleStartQuiz = () => {
    setQuizActive(true);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizFlipped(false);
    setQuizFinished(false);
  };

  const handleQuizChoice = (knewIt: boolean) => {
    if (knewIt) {
      setQuizScore((prev) => prev + 1);
    }
    setQuizFlipped(false);
    setTimeout(() => {
      if (quizIndex + 1 < revisionNotes.length) {
        setQuizIndex((prev) => prev + 1);
      } else {
        setQuizFinished(true);
      }
    }, 200);
  };

  const triggerConfetti = () => {
    const colors = ["#ec4899", "#10b981", "#06b6d4", "#f59e0b", "#d946ef", "#f43f5e", "#6366f1"];
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 300,
      y: -20 - Math.random() * 200,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1200);
  };

  const handleClaimQuizReward = async () => {
    let newXp = (userProgress.xp || 0) + 50;
    let newLevel = userProgress.level || 1;
    const newBadges = [...(userProgress.badges || ["Welcome Coder"])];
    const xpNeeded = newLevel * 100;
    if (newXp >= xpNeeded) {
      newXp -= xpNeeded;
      newLevel += 1;
      newBadges.push(`Level ${newLevel} Achiever`);
      triggerConfetti();
    }
    const updatedProgress = { ...userProgress, xp: newXp, level: newLevel, badges: newBadges };
    setUserProgress(updatedProgress);

    try {
      await fetch(`/api/dashboard/goals?username=${encodeURIComponent(activeUsername)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: activeUsername,
          action: "update_progress",
          progress: updatedProgress
        })
      });
    } catch (e) {
      console.error("Failed to persist quiz XP reward", e);
    }

    setQuizActive(false);
    setQuizFinished(false);
  };

  const [revisionTitle, setRevisionTitle] = useState("");
  const [revisionNotesField, setRevisionNotesField] = useState("");
  const [revisionApproach, setRevisionApproach] = useState("");
  const [revisionMistakes, setRevisionMistakes] = useState("");
  const [revisionTimeComplexity, setRevisionTimeComplexity] = useState("O(N)");
  const [revisionSpaceComplexity, setRevisionSpaceComplexity] = useState("O(1)");
  const [revisionIsBookmarked, setRevisionIsBookmarked] = useState(false);
  const [revisionIsFavorite, setRevisionIsFavorite] = useState(false);

  // AI Coach states
  const [coachDiagnostic, setCoachDiagnostic] = useState<any | null>(null);
  const [runningDiagnostic, setRunningDiagnostic] = useState(false);

  // GitHub states
  const [githubProfile, setGithubProfile] = useState<any | null>(null);
  const [loadingGithub, setLoadingGithub] = useState(false);
  const [githubConnected, setGithubConnected] = useState(false);

  // Settings custom states
  const [displayName, setDisplayName] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Local storage profile checks
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUsername = localStorage.getItem("leetinsight_leetcode_username");
      if (savedUsername) {
        setLeetcodeUsername(savedUsername);
        triggerFetchProfile(savedUsername);
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || user.email?.split("@")[0] || "");
      setEmailInput(user.email || "");
    }
  }, [user]);

  const triggerFetchProfile = async (usernameStr: string) => {
    if (!usernameStr.trim()) return;
    setFetchingData(true);
    setFetchError(null);
    try {
      const res = await fetch(`/api/leetcode/profile?username=${encodeURIComponent(usernameStr.trim())}`);
      if (!res.ok) {
        const errorPayload = await res.json();
        throw new Error(errorPayload.error || "Failed to load LeetCode profile statistics.");
      }
      const data = await res.json();
      setLeetcodeData(data);
      localStorage.setItem("leetinsight_leetcode_username", usernameStr.trim());
      setUnreadNotifications((prev) => prev + 1);
      setNotifications((prev) => [
        { id: Date.now(), text: `Profile stats synced for ${usernameStr}.`, read: false, time: "Just now" },
        ...prev,
      ]);
    } catch (err: any) {
      setFetchError(err.message || "An unexpected API error occurred.");
      setLeetcodeData(null);
    } finally {
      setFetchingData(false);
    }
  };

  const handleManualSync = async () => {
    if (!leetcodeUsername) return;
    setSyncing(true);
    setSyncSuccess(false);
    try {
      await triggerFetchProfile(leetcodeUsername);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    } catch (err) {
      // Handled in triggerFetchProfile
    } finally {
      setSyncing(false);
    }
  };

  const handleCycleTheme = () => {
    const themesList = ["light", "dark", "sunset", "forest", "arctic", "cyberpunk", "rose", "ocean", "sage"];
    const nextThemes = themesList.filter((t) => t !== theme);
    const randomTheme = nextThemes[Math.floor(Math.random() * nextThemes.length)];
    setTheme(randomTheme);
    
    // Trigger particles at the button position
    const colors = ["#ec4899", "#10b981", "#06b6d4", "#f59e0b", "#d946ef", "#f43f5e", "#6366f1"];
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 160,
      y: -20 - Math.random() * 120,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1000);
  };

  // Compute active username
  const activeUsername = leetcodeUsername || user?.email?.split("@")[0] || "default_user";

  // Fetch Goals & Progress
  const fetchGoalsAndProgress = useCallback(async () => {
    if (!activeUsername) return;
    try {
      const res = await fetch(`/api/dashboard/goals?username=${encodeURIComponent(activeUsername)}`);
      if (res.ok) {
        const data = await res.json();
        setGoalsList(data.goals || []);
        setUserProgress(data.progress || { xp: 0, level: 1, streak: 0, badges: ["Welcome Coder"] });
      }
    } catch (e) {
      console.error(e);
    }
  }, [activeUsername]);

  // Fetch Revision Notes
  const fetchRevisionNotes = useCallback(async () => {
    if (!activeUsername) return;
    try {
      const res = await fetch(
        `/api/dashboard/revision?username=${encodeURIComponent(activeUsername)}&search=${encodeURIComponent(
          revisionSearch
        )}&favorite=${revisionFavoriteFilter}&bookmark=${revisionBookmarkFilter}`
      );
      if (res.ok) {
        const data = await res.json();
        setRevisionNotes(data || []);
      }
    } catch (e) {
      console.error(e);
    }
  }, [activeUsername, revisionSearch, revisionFavoriteFilter, revisionBookmarkFilter]);

  useEffect(() => {
    fetchGoalsAndProgress();
  }, [fetchGoalsAndProgress]);

  useEffect(() => {
    fetchRevisionNotes();
  }, [fetchRevisionNotes]);

  // Goals Action Handlers
  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    try {
      const res = await fetch("/api/dashboard/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: activeUsername,
          action: "create",
          text: newGoalText.trim(),
          xpReward: 25,
        }),
      });
      if (res.ok) {
        setNewGoalText("");
        fetchGoalsAndProgress();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompleteGoal = async (goalId: string) => {
    try {
      const res = await fetch("/api/dashboard/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: activeUsername,
          action: "complete",
          goalId,
        }),
      });
      if (res.ok) {
        fetchGoalsAndProgress();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      const res = await fetch("/api/dashboard/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: activeUsername,
          action: "delete",
          goalId,
        }),
      });
      if (res.ok) {
        fetchGoalsAndProgress();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Revision Planner Action Handlers
  const handleSaveRevisionNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionTitle.trim()) return;
    try {
      const res = await fetch("/api/dashboard/revision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: activeUsername,
          action: "save",
          title: revisionTitle.trim(),
          notes: revisionNotesField.trim(),
          approach: revisionApproach.trim(),
          mistakes: revisionMistakes.trim(),
          timeComplexity: revisionTimeComplexity,
          spaceComplexity: revisionSpaceComplexity,
          isBookmarked: revisionIsBookmarked,
          isFavorite: revisionIsFavorite,
        }),
      });
      if (res.ok) {
        setRevisionTitle("");
        setRevisionNotesField("");
        setRevisionApproach("");
        setRevisionMistakes("");
        setRevisionTimeComplexity("O(N)");
        setRevisionSpaceComplexity("O(1)");
        setRevisionIsBookmarked(false);
        setRevisionIsFavorite(false);
        fetchRevisionNotes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRevisionNote = async (noteId: string) => {
    try {
      const res = await fetch("/api/dashboard/revision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: activeUsername,
          action: "delete",
          noteId,
        }),
      });
      if (res.ok) {
        fetchRevisionNotes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFavorite = async (noteId: string, currentVal: boolean) => {
    try {
      const res = await fetch("/api/dashboard/revision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: activeUsername,
          action: "toggle_favorite",
          noteId,
          isFavorite: !currentVal,
        }),
      });
      if (res.ok) {
        fetchRevisionNotes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleBookmark = async (noteId: string, currentVal: boolean) => {
    try {
      const res = await fetch("/api/dashboard/revision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: activeUsername,
          action: "toggle_bookmark",
          noteId,
          isBookmarked: !currentVal,
        }),
      });
      if (res.ok) {
        fetchRevisionNotes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // AI Coach API diagnostic handler
  const handleRunCoachDiagnostic = async () => {
    setRunningDiagnostic(true);
    try {
      const res = await fetch("/api/dashboard/ai-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leetcodeStats: leetcodeData || {
            totalSolved: 224,
            easySolved: 112,
            mediumSolved: 94,
            hardSolved: 18,
            ranking: 45000,
            contestRating: 1742,
          },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setCoachDiagnostic(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRunningDiagnostic(false);
    }
  };

  // GitHub OAuth & connection simulation handler
  const handleConnectGithub = async () => {
    setLoadingGithub(true);
    try {
      const res = await fetch(`/api/github/profile?username=${encodeURIComponent(activeUsername)}`);
      if (res.ok) {
        const data = await res.json();
        setGithubProfile(data);
        setGithubConnected(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingGithub(false);
    }
  };

  const handleDisconnectGithub = () => {
    setGithubProfile(null);
    setGithubConnected(false);
  };

  // PDF Export
  const handlePrintDashboard = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // CSV Export of Solved counts
  const handleExportSolvedCSV = () => {
    if (typeof window === "undefined") return;
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Metric,Count\n";
    csvContent += `Total Solved,${leetcodeData?.totalSolved || 224}\n`;
    csvContent += `Easy Solved,${leetcodeData?.easySolved || 112}\n`;
    csvContent += `Medium Solved,${leetcodeData?.mediumSolved || 94}\n`;
    csvContent += `Hard Solved,${leetcodeData?.hardSolved || 18}\n`;
    csvContent += `Acceptance Rate,${leetcodeData?.acceptanceRate || "64.2%"}\n`;
    csvContent += `Contest Rating,${leetcodeData?.contestRating || 1742}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${activeUsername}_leetcode_solved_metrics.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // JSON Data Export
  const handleExportDataJSON = () => {
    if (typeof window === "undefined") return;
    const exportObj = {
      username: activeUsername,
      leetcodeStats: leetcodeData,
      goals: goalsList,
      revisionNotes: revisionNotes,
      userProgress: userProgress,
      exportedAt: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `${activeUsername}_leetinsight_export.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Password reset trigger
  const handleTriggerPasswordReset = () => {
    alert("Password reset instructions have been forwarded to: " + emailInput);
  };

  // Delete Account final trigger
  const handleDeleteAccountFinal = () => {
    alert("Account deletion sequence initiated. Disconnecting profiles...");
    localStorage.clear();
    window.location.href = "/";
  };

  // AI Coach Chat Simulation
  const [chatMessage, setChatMessage] = useState("");
  const [chatLog, setChatLog] = useState([
    { sender: "ai", text: "Hello! I am your LeetInsight coach. What algorithmic concept are we practicing today? (e.g. Dynamic Programming, Trees)" },
  ]);
  const [aiTyping, setAiTyping] = useState(false);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setMobileSidebarOpen(false);
    setLoadingView(true);
    const delay = setTimeout(() => {
      setLoadingView(false);
    }, 400);
    return () => clearTimeout(delay);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = { sender: "user", text: chatMessage };
    setChatLog((prev) => [...prev, userMsg]);
    const input = chatMessage;
    setChatMessage("");
    setAiTyping(true);

    setTimeout(() => {
      setAiTyping(false);
      let reply = "That sounds like a great topic! Let's start with a standard implementation before reviewing optimized complexities.";
      if (input.toLowerCase().includes("dp") || input.toLowerCase().includes("dynamic")) {
        reply = "Dynamic programming is all about recurrence relations. I suggest trying 'Longest Common Subsequence' (Medium) to map your overlap state tables.";
      } else if (input.toLowerCase().includes("tree") || input.toLowerCase().includes("graph")) {
        reply = "For graphs, make sure to master BFS for shortest path and DFS for connectivity. Try 'Number of Islands' to lock down standard grid traversals.";
      } else if (input.toLowerCase().includes("search") || input.toLowerCase().includes("binary")) {
        reply = "Binary search is tricky with index boundaries. Remember to evaluate if search range is sorted. Recommended: 'Search in Rotated Sorted Array'.";
      }
      setChatLog((prev) => [...prev, { sender: "ai", text: reply }]);
    }, 1000);
  };

  const handleMarkNotificationsRead = () => {
    setUnreadNotifications(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: "analytics", label: "Analytics", icon: <BarChart3 className="h-5 w-5" /> },
    { id: "topic-analysis", label: "Topic Analysis", icon: <PieChart className="h-5 w-5" /> },
    { id: "contest", label: "Contest", icon: <Award className="h-5 w-5" /> },
    { id: "heatmap", label: "Heatmap", icon: <Calendar className="h-5 w-5" /> },
    { id: "goals", label: "Goals", icon: <CheckSquare className="h-5 w-5" /> },
    { id: "revision-notes", label: "Revision Notes", icon: <FileText className="h-5 w-5" /> },
    { id: "ai-coach", label: "AI Coach", icon: <Brain className="h-5 w-5" /> },
    { id: "github", label: "GitHub", icon: <GithubIcon className="h-5 w-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
    { id: "admin", label: "Admin Console", icon: <ShieldCheck className="h-5 w-5" /> },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      {/* 1. Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col border-r border-zinc-200 bg-white/40 dark:border-zinc-900 dark:bg-zinc-900/10 backdrop-blur-xl transition-all duration-300 ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5 border-b border-zinc-200/50 dark:border-zinc-900/50">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white">
                <Code2 className="h-4.5 w-4.5" />
              </div>
              <span className="font-sans text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Leet<span className="text-orange-500">Insight</span>
              </span>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="flex h-8 w-8 mx-auto items-center justify-center rounded-lg bg-orange-500 text-white">
              <Code2 className="h-4.5 w-4.5" />
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 text-zinc-450 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-500 dark:hover:bg-zinc-850 cursor-pointer"
          >
            <ChevronLeft className={`h-4.5 w-4.5 transition-transform ${sidebarCollapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto no-scrollbar">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 cursor-pointer group ${
                activeTab === item.id
                  ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/15"
                  : "text-zinc-550 border border-transparent hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/40 dark:hover:text-zinc-100"
              }`}
            >
              <div className="flex items-center justify-center group-hover:scale-105 transition-transform">
                {item.icon}
              </div>
              {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-900">
          <div className="flex items-center gap-3 mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={leetcodeData?.avatar || user?.photoURL || "https://api.dicebear.com/7.x/adventurer/svg?seed=Leet"}
              alt="Avatar"
              className="h-10 w-10 shrink-0 rounded-full border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
            />
            {!sidebarCollapsed && (
              <div className="overflow-hidden">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                  {leetcodeData?.realName || user?.displayName || "Coder"}
                </h4>
                <p className="text-[10px] text-zinc-450 dark:text-zinc-550 truncate">
                  {leetcodeData ? `@${leetcodeData.username}` : user?.email}
                </p>
              </div>
            )}
          </div>
          {!sidebarCollapsed && (
            <button
              onClick={() => logout()}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-500/5 py-2 text-xs font-semibold text-red-650 transition-colors hover:bg-red-500/10 dark:border-red-950 dark:bg-red-950/10 dark:text-red-400 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          )}
        </div>
      </aside>

      {/* 2. Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white border-r border-zinc-200 dark:bg-zinc-950 dark:border-zinc-900 lg:hidden"
            >
              <div className="flex h-16 items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-900">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white">
                    <Code2 className="h-4.5 w-4.5" />
                  </div>
                  <span className="font-sans text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Leet<span className="text-orange-500">Insight</span>
                  </span>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 dark:border-zinc-800 dark:text-zinc-350"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-250 cursor-pointer ${
                      activeTab === item.id
                        ? "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                        : "text-zinc-550 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>

              <div className="p-4 border-t border-zinc-200 dark:border-zinc-900">
                <div className="flex items-center gap-3 mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={leetcodeData?.avatar || user?.photoURL || "https://api.dicebear.com/7.x/adventurer/svg?seed=Leet"}
                    alt="Avatar"
                    className="h-10 w-10 rounded-full border border-zinc-200 dark:border-zinc-900"
                  />
                  <div className="overflow-hidden">
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      {leetcodeData?.realName || user?.displayName || "Coder"}
                    </h4>
                    <p className="text-xs text-zinc-550 dark:text-zinc-450 truncate">
                      {leetcodeData ? `@${leetcodeData.username}` : user?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => logout()}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-500/5 py-2.5 text-sm font-semibold text-red-650 hover:bg-red-500/10 dark:border-red-950 dark:bg-red-950/10 dark:text-red-400 cursor-pointer"
                >
                  <LogOut className="h-4.5 w-4.5" />
                  Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 3. Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-16 items-center justify-between px-6 border-b border-zinc-200/50 bg-white/40 dark:border-zinc-900/50 dark:bg-zinc-950/10 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 dark:border-zinc-800 dark:text-zinc-350 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Mock Command Search */}
            <div className="relative hidden md:flex items-center w-80">
              <Search className="absolute left-3 h-4 w-4 text-zinc-450 dark:text-zinc-550" />
              <input
                type="text"
                placeholder="Search stats or revision logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-14 py-2 rounded-xl border border-zinc-200/80 bg-zinc-50/50 text-xs text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/15 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-white"
              />
              <kbd className="absolute right-3 inline-flex items-center gap-0.5 rounded border border-zinc-200/80 bg-white px-1.5 py-0.5 text-[10px] font-sans font-medium text-zinc-450 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-500">
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  if (!notificationsOpen) handleMarkNotificationsRead();
                }}
                className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200/80 bg-white/50 text-zinc-700 backdrop-blur-md hover:bg-zinc-100 dark:border-zinc-800/80 dark:bg-zinc-950/50 dark:text-zinc-400 dark:hover:bg-zinc-900 cursor-pointer"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-zinc-950">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setNotificationsOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2.5 z-20 w-80 rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 backdrop-blur-xl"
                    >
                      <h4 className="text-xs font-bold text-zinc-550 dark:text-zinc-455 mb-2 uppercase tracking-wider">
                        Recent Notifications
                      </h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
                        {notifications.map((n) => (
                          <div key={n.id} className="p-2.5 rounded-lg hover:bg-zinc-55 dark:hover:bg-zinc-850/50 transition-colors">
                            <p className="text-xs text-zinc-800 dark:text-zinc-300">{n.text}</p>
                            <span className="text-[10px] text-zinc-455 mt-1 block">{n.time}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={handlePrintDashboard}
              title="Export Dashboard as PDF"
              className="hidden sm:flex h-9 px-3 items-center justify-center gap-1.5 rounded-lg border border-zinc-200/80 bg-white/50 text-xs font-bold text-zinc-750 backdrop-blur-md hover:bg-zinc-100 dark:border-zinc-800/80 dark:bg-zinc-950/50 dark:text-zinc-400 dark:hover:bg-zinc-900 cursor-pointer"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Print PDF</span>
            </button>

            <button
              onClick={handleExportSolvedCSV}
              title="Export Solved Problems as CSV"
              className="hidden sm:flex h-9 px-3 items-center justify-center gap-1.5 rounded-lg border border-zinc-200/80 bg-white/50 text-xs font-bold text-zinc-750 backdrop-blur-md hover:bg-zinc-100 dark:border-zinc-800/80 dark:bg-zinc-950/50 dark:text-zinc-400 dark:hover:bg-zinc-900 cursor-pointer"
            >
              <Code2 className="h-4 w-4" />
              <span className="hidden md:inline">Export CSV</span>
            </button>

            <ThemeToggle />

            {/* Profile Avatar */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={leetcodeData?.avatar || user?.photoURL || "https://api.dicebear.com/7.x/adventurer/svg?seed=Leet"}
              alt="Avatar"
              className="h-9 w-9 rounded-full border border-zinc-200 bg-zinc-50 dark:border-zinc-800"
            />
          </div>
        </header>

        {/* Tab view host */}
        <main className="flex-1 overflow-y-auto p-6 bg-zinc-50/30 dark:bg-zinc-950/20">
          <AnimatePresence mode="wait">
            {fetchingData || loadingView ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <ChartSkeleton />
                  </div>
                  <div>
                    <ListSkeleton />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* --- 1. DASHBOARD OVERVIEW TAB --- */}
                {activeTab === "dashboard" && (
                  <>
                    {/* Prompt username card if not synced */}
                    {!leetcodeData ? (
                      <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-8 dark:border-orange-500/10 dark:bg-orange-500/[0.015] backdrop-blur-md max-w-xl mx-auto text-center space-y-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-white mx-auto">
                          <Code2 className="h-6 w-6" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold tracking-tight">Sync Your LeetCode Account</h2>
                          <p className="mt-2 text-xs text-zinc-550 dark:text-zinc-400">
                            Enter your LeetCode username to fetch your real statistics, contest history, and recent submissions directly from LeetCode.
                          </p>
                        </div>

                        {fetchError && (
                          <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-650 dark:text-red-400 text-left">
                            <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                            <span>{fetchError}</span>
                          </div>
                        )}

                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            triggerFetchProfile(leetcodeUsername);
                          }}
                          className="flex gap-2 max-w-md mx-auto"
                        >
                          <input
                            type="text"
                            required
                            value={leetcodeUsername}
                            onChange={(e) => setLeetcodeUsername(e.target.value)}
                            placeholder="e.g. vansh-leetcode"
                            className="flex-1 rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
                          />
                          <button
                            type="submit"
                            className="rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-semibold text-white hover:bg-orange-600 active:scale-95 cursor-pointer"
                          >
                            Connect
                          </button>
                        </form>
                      </div>
                    ) : (
                      <>
                        {/* Welcome Header bar & Sync data button */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-orange-500/20 bg-orange-500/5 p-6 dark:border-orange-500/10 dark:bg-orange-500/[0.015] backdrop-blur-md">
                          <div>
                            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                              Welcome, {leetcodeData.realName || leetcodeData.username}!
                            </h2>
                            <p className="mt-1 text-sm text-zinc-650 dark:text-zinc-400">
                              Cache updated: <strong className="text-orange-500">{new Date(leetcodeData.updatedAt).toLocaleTimeString()}</strong>. Auto-refreshes every 24 hours.
                            </p>
                          </div>
                          <button
                            onClick={handleManualSync}
                            disabled={syncing}
                            className="inline-flex items-center justify-center gap-2 self-start md:self-auto rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-orange-600 active:scale-95 disabled:opacity-50 cursor-pointer shadow-lg shadow-orange-500/15"
                          >
                            <RefreshCw className={`h-4.5 w-4.5 ${syncing ? "animate-spin" : ""}`} />
                            {syncing ? "Syncing..." : "Sync Profile"}
                          </button>
                        </div>

                        {syncSuccess && (
                          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
                            <CheckCircle className="h-5 w-5 shrink-0" />
                            <span>Stats refreshed successfully from LeetCode GraphQL API.</span>
                          </div>
                        )}

                        {/* Cards grids */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                          {/* Streak (Mock) */}
                          <div className="rounded-xl border border-zinc-200/80 bg-white/40 p-5 shadow-sm dark:border-zinc-850 dark:bg-zinc-900/10 backdrop-blur-md">
                            <div className="flex items-center justify-between text-zinc-550 dark:text-zinc-500 mb-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider">Streak</span>
                              <Sparkles className="h-4.5 w-4.5 text-orange-500" />
                            </div>
                            <div className="text-2xl font-black text-zinc-900 dark:text-white">{streak} Days</div>
                            <p className="text-[10px] text-zinc-450 mt-1">Keep it burning</p>
                          </div>

                          {/* Problems Solved (Real) */}
                          <div className="rounded-xl border border-zinc-200/80 bg-white/40 p-5 shadow-sm dark:border-zinc-850 dark:bg-zinc-900/10 backdrop-blur-md">
                            <div className="flex items-center justify-between text-zinc-550 dark:text-zinc-500 mb-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider">Solved</span>
                              <CheckCircle className="h-4.5 w-4.5 text-green-500" />
                            </div>
                            <div className="text-2xl font-black text-zinc-900 dark:text-white">{leetcodeData.totalSolved}</div>
                            <p className="text-[10px] text-zinc-455 mt-1">{leetcodeData.mediumSolved} Mediums</p>
                          </div>

                          {/* Contest Rating (Real) */}
                          <div className="rounded-xl border border-zinc-200/80 bg-white/40 p-5 shadow-sm dark:border-zinc-850 dark:bg-zinc-900/10 backdrop-blur-md">
                            <div className="flex items-center justify-between text-zinc-555 dark:text-zinc-500 mb-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider">Contest Rating</span>
                              <Award className="h-4.5 w-4.5 text-indigo-500" />
                            </div>
                            <div className="text-2xl font-black text-zinc-900 dark:text-white">
                              {leetcodeData.contestRating || "Unrated"}
                            </div>
                            <p className="text-[10px] text-zinc-450 mt-1">
                              {leetcodeData.contestGlobalRank ? `Rank: #${leetcodeData.contestGlobalRank.toLocaleString()}` : "No history"}
                            </p>
                          </div>

                          {/* Acceptance Rate (Real) */}
                          <div className="rounded-xl border border-zinc-200/80 bg-white/40 p-5 shadow-sm dark:border-zinc-850 dark:bg-zinc-900/10 backdrop-blur-md">
                            <div className="flex items-center justify-between text-zinc-555 dark:text-zinc-500 mb-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider">Acceptance</span>
                              <TrendingUp className="h-4.5 w-4.5 text-emerald-500" />
                            </div>
                            <div className="text-2xl font-black text-zinc-900 dark:text-white">{leetcodeData.acceptanceRate}%</div>
                            <p className="text-[10px] text-zinc-450 mt-1">Submission pass rate</p>
                          </div>

                          {/* Global Ranking (Real) */}
                          <div className="rounded-xl border border-zinc-200/80 bg-white/40 p-5 shadow-sm dark:border-zinc-850 dark:bg-zinc-900/10 backdrop-blur-md">
                            <div className="flex items-center justify-between text-zinc-550 dark:text-zinc-500 mb-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider">Global Rank</span>
                              <User className="h-4.5 w-4.5 text-violet-500" />
                            </div>
                            <div className="text-2xl font-black text-zinc-900 dark:text-white">
                              {leetcodeData.ranking ? `#${leetcodeData.ranking.toLocaleString()}` : "N/A"}
                            </div>
                            <p className="text-[10px] text-zinc-455 mt-1">LeetCode leaderboard</p>
                          </div>

                          {/* Daily Goal (Mock) */}
                          <div className="rounded-xl border border-zinc-200/80 bg-white/40 p-5 shadow-sm dark:border-zinc-850 dark:bg-zinc-900/10 backdrop-blur-md">
                            <div className="flex items-center justify-between text-zinc-555 dark:text-zinc-500 mb-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider">Daily Goal</span>
                              <CheckSquare className="h-4.5 w-4.5 text-amber-500" />
                            </div>
                            <div className="text-2xl font-black text-zinc-900 dark:text-white">
                              {goalsList.filter((g) => g.completed).length} / {dailyGoalTarget}
                            </div>
                            <p className="text-[10px] text-zinc-450 mt-1">Objectives completed</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Difficulty distribution dials */}
                          <div className="lg:col-span-1 rounded-2xl border border-zinc-200 bg-white/40 p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-900/10 backdrop-blur-md flex flex-col justify-between">
                            <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-350 mb-4">
                              Difficulty Breakdown
                            </h3>
                            <div className="relative flex items-center justify-center h-44">
                              <svg className="w-32 h-32 transform -rotate-90">
                                <circle cx="64" cy="64" r="50" className="stroke-zinc-150 dark:stroke-zinc-800 fill-none" strokeWidth="8" />
                                <circle
                                  cx="64"
                                  cy="64"
                                  r="50"
                                  className="stroke-orange-500 fill-none"
                                  strokeWidth="8"
                                  strokeDasharray={2 * Math.PI * 50}
                                  strokeDashoffset={2 * Math.PI * 50 * (1 - leetcodeData.mediumSolved / leetcodeData.totalSolved)}
                                />
                              </svg>
                              <div className="absolute flex flex-col items-center">
                                <span className="text-2xl font-black">{leetcodeData.totalSolved}</span>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-455">
                                  Solved
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2 mt-4 text-xs">
                              <div className="flex justify-between items-center">
                                <span className="text-green-550 font-semibold flex items-center gap-1.5">
                                  <span className="h-2 w-2 rounded-full bg-green-550" />
                                  Easy
                                </span>
                                <span className="font-bold">{leetcodeData.easySolved}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-yellow-500 font-semibold flex items-center gap-1.5">
                                  <span className="h-2 w-2 rounded-full bg-yellow-500" />
                                  Medium
                                </span>
                                <span className="font-bold">{leetcodeData.mediumSolved}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-red-500 font-semibold flex items-center gap-1.5">
                                  <span className="h-2 w-2 rounded-full bg-red-500" />
                                  Hard
                                </span>
                                <span className="font-bold">{leetcodeData.hardSolved}</span>
                              </div>
                            </div>
                          </div>

                          {/* Recent Submissions Feed */}
                          <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white/40 p-6 shadow-sm dark:border-zinc-900 dark:bg-zinc-900/10 backdrop-blur-md">
                            <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-350 mb-4">
                              Recent Submissions (Real-time)
                            </h3>
                            <div className="space-y-3.5 max-h-[300px] overflow-y-auto no-scrollbar">
                              {leetcodeData.recentSubmissions && leetcodeData.recentSubmissions.length > 0 ? (
                                leetcodeData.recentSubmissions.map((sub: any, index: number) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/20 dark:border-zinc-800 dark:bg-zinc-950/20 text-xs"
                                  >
                                    <div>
                                      <h4 className="font-semibold text-zinc-900 dark:text-zinc-200">{sub.title}</h4>
                                      <div className="flex gap-2 mt-1 text-[10px] text-zinc-450">
                                        <span>{sub.lang}</span>
                                        <span>•</span>
                                        <span className="text-emerald-500">{sub.status}</span>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <span className="block text-[9px] text-zinc-450 mt-1">{sub.time}</span>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-xs text-zinc-450 italic">No recent submission logs found.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}

                {/* --- 2. ANALYTICS VIEW --- */}
                {activeTab === "analytics" && (
                  <div className="space-y-6">
                    {/* Time Filter Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-200/60 bg-white/40 p-4 dark:border-zinc-900 dark:bg-zinc-900/10 backdrop-blur-md">
                      <div>
                        <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Interactive Analytics Dashboard</h3>
                        <p className="text-xs text-zinc-450 dark:text-zinc-550">Filter data points by active intervals</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 text-xs">
                        {[
                          { id: "week", label: "Last Week" },
                          { id: "month", label: "Last Month" },
                          { id: "year", label: "Last Year" },
                          { id: "all", label: "All Time" },
                        ].map((btn) => {
                          const isActive = timeFilter === btn.id;
                          return (
                            <button
                              key={btn.id}
                              onClick={() => setTimeFilter(btn.id as any)}
                              className={`rounded-lg px-4 py-2 font-semibold transition-all cursor-pointer ${
                                isActive
                                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/15"
                                  : "border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-750 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900"
                              }`}
                            >
                              {btn.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Recharts visualizations */}
                    <AnalyticsCharts filter={timeFilter} />
                  </div>
                )}

                {/* --- 3. TOPIC ANALYSIS TAB --- */}
                {activeTab === "topic-analysis" && (
                  <TopicAnalysisList />
                )}

                {/* --- 4. CONTEST RATING VIEW --- */}
                {activeTab === "contest" && (
                  <div className="space-y-6">
                    <ChartSkeleton />
                    <div className="rounded-2xl border border-zinc-200 bg-white/40 p-6 dark:border-zinc-900 dark:bg-zinc-900/10 backdrop-blur-md">
                      <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-4">
                        Contest History (Real-time)
                      </h3>
                      <div className="space-y-3 text-xs">
                        {leetcodeData?.contestHistory && leetcodeData.contestHistory.length > 0 ? (
                          leetcodeData.contestHistory.map((m: any, i: number) => (
                            <div key={i} className="flex justify-between items-center p-3 rounded-xl border border-zinc-200/50 bg-zinc-55/10 dark:border-zinc-850 dark:bg-zinc-900/10">
                              <div>
                                <span className="font-bold text-zinc-900 dark:text-zinc-100">{m.contestTitle}</span>
                                <span className="block text-[10px] text-zinc-450 mt-0.5">Rank: #{m.ranking.toLocaleString()}</span>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-orange-500">
                                  Rating: {m.rating}
                                </span>
                                <span className="block text-[10px] text-zinc-450 mt-0.5">{m.date}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-zinc-450 italic">No contest ranking histories found.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* --- 5. ACTIVITY HEATMAP TAB --- */}
                {activeTab === "heatmap" && (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-200/60 bg-white/40 p-4 dark:border-zinc-900 dark:bg-zinc-900/10 backdrop-blur-md">
                      <div>
                        <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Activity contribution map</h3>
                        <p className="text-xs text-zinc-450 dark:text-zinc-550">Filter solve contribution grids</p>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <button
                          onClick={() => setHeatmapFilter("month")}
                          className={`rounded-lg px-4 py-2 font-semibold transition-all cursor-pointer ${
                            heatmapFilter === "month"
                              ? "bg-orange-500 text-white shadow-md shadow-orange-500/15"
                              : "border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-750 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900"
                          }`}
                        >
                          Month View
                        </button>
                        <button
                          onClick={() => setHeatmapFilter("year")}
                          className={`rounded-lg px-4 py-2 font-semibold transition-all cursor-pointer ${
                            heatmapFilter === "year"
                              ? "bg-orange-500 text-white shadow-md shadow-orange-500/15"
                              : "border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-750 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900"
                          }`}
                        >
                          Year View
                        </button>
                      </div>
                    </div>
                    <ActivityHeatmap username={activeUsername} filter={heatmapFilter} />
                  </div>
                )}

                {/* --- 6. GOALS CHECKLIST TAB --- */}
                {activeTab === "goals" && (
                  <div className="space-y-6">
                    {/* Gamified stats panel */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-2xl border border-zinc-200 bg-white/40 p-6 dark:border-zinc-900 dark:bg-zinc-900/10 backdrop-blur-md">
                      {/* Level and XP progress */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-baseline">
                          <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Level Progress</h4>
                          <span className="text-xl font-black text-orange-500">Lvl {userProgress.level || 1}</span>
                        </div>
                        <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                          <div
                            className="h-full bg-orange-500 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, ((userProgress.xp || 0) / ((userProgress.level || 1) * 100)) * 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-zinc-500">
                          <span>{userProgress.xp || 0} XP</span>
                          <span>{(userProgress.level || 1) * 100} XP needed</span>
                        </div>
                      </div>

                      {/* Daily Streak flame */}
                      <div className="flex items-center gap-4 border-y md:border-y-0 md:border-x border-zinc-200 dark:border-zinc-850 py-4 md:py-0 md:px-6">
                        <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 text-xl font-black">
                          🔥
                        </div>
                        <div>
                          <span className="text-2xl font-black block text-zinc-900 dark:text-white">{userProgress.streak || 0} Days</span>
                          <span className="text-[10px] text-zinc-450 uppercase font-bold tracking-wider">Daily Solves Streak</span>
                        </div>
                      </div>

                      {/* Badges Collection */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Achievement Badges</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {userProgress.badges && userProgress.badges.length > 0 ? (
                            userProgress.badges.map((badge: string, i: number) => (
                              <span
                                key={i}
                                className="text-[9px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/25 whitespace-nowrap"
                              >
                                {badge}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-zinc-450 italic">No badges earned yet.</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Create New Goal Checklist */}
                    <div className="rounded-2xl border border-zinc-200 bg-white/40 p-6 dark:border-zinc-900 dark:bg-zinc-900/10 backdrop-blur-md">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Milestone Tasks</h3>
                        <span className="text-[10px] font-bold bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded-full">
                          {goalsList.filter((g) => g.completed).length} / {goalsList.length} Solved
                        </span>
                      </div>

                      <form onSubmit={handleCreateGoal} className="flex gap-2.5 mb-6">
                        <input
                          type="text"
                          value={newGoalText}
                          onChange={(e) => setNewGoalText(e.target.value)}
                          placeholder="e.g. Solve 3 Medium DFS Tree patterns"
                          className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs focus:border-orange-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-800 dark:text-white"
                        />
                        <button
                          type="submit"
                          className="rounded-lg bg-orange-500 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-orange-600 active:scale-95 cursor-pointer shadow-lg shadow-orange-500/15"
                        >
                          Add Goal
                        </button>
                      </form>

                      {/* Goals List */}
                      <div className="space-y-2">
                        {goalsList.length > 0 ? (
                          goalsList.map((g) => (
                            <div
                              key={g._id}
                              className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                                g.completed
                                  ? "border-zinc-150 bg-zinc-50/50 opacity-60 dark:border-zinc-850 dark:bg-zinc-900/5"
                                  : "border-zinc-200 bg-zinc-50/20 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/10"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => !g.completed && handleCompleteGoal(g._id)}
                                  className={`h-5 w-5 rounded-md border flex items-center justify-center cursor-pointer transition-colors ${
                                    g.completed
                                      ? "border-green-500 bg-green-500 text-white"
                                      : "border-zinc-300 dark:border-zinc-850 bg-white dark:bg-zinc-950 text-transparent"
                                  }`}
                                  disabled={g.completed}
                                >
                                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                                </button>
                                <span className={`text-xs font-semibold ${g.completed ? "line-through text-zinc-450 dark:text-zinc-500" : "text-zinc-850 dark:text-zinc-250"}`}>
                                  {g.text}
                                </span>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded">
                                  +{g.xpReward || 25} XP
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteGoal(g._id)}
                                  className="text-zinc-400 hover:text-red-500 cursor-pointer p-1"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-zinc-450 italic text-center py-6">No study tasks declared. Add a milestone above!</p>
                        )}
                      </div>
                    </div>

                    {/* Conquest Badges Trophy Room Cabinet */}
                    <div className="rounded-2xl border border-zinc-200 bg-white/40 p-6 dark:border-zinc-900 dark:bg-zinc-900/10 backdrop-blur-md space-y-4">
                      <div className="flex items-center gap-2.5 border-b border-zinc-150 dark:border-zinc-900 pb-3">
                        <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500">
                          <Award className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">Conquest Badges Cabinet</h3>
                          <p className="text-[10px] text-zinc-450 dark:text-zinc-500 mt-0.5">Unlock custom developer achievements by maintaining streaks, writing optimized code, and leveling up.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {BADGES_LIST.map((badgeItem) => {
                          const isEarned = userProgress.badges?.some(
                            (b: string) => b.toLowerCase().replace(/\s+/g, '').includes(badgeItem.name.toLowerCase().replace(/\s+/g, ''))
                          );
                          const BadgeIcon = badgeItem.icon;

                          return (
                            <div 
                              key={badgeItem.id}
                              className={`p-4 rounded-xl border transition-all flex items-center gap-4 relative overflow-hidden ${
                                isEarned 
                                  ? `${badgeItem.bgClass} shadow-md`
                                  : "bg-zinc-50/20 border-zinc-200/60 dark:bg-zinc-950/10 dark:border-zinc-850/80 opacity-50"
                              }`}
                              style={isEarned ? { boxShadow: `0 4px 15px -4px ${badgeItem.glowColor}` } : {}}
                            >
                              <div className={`p-2 rounded-lg shrink-0 ${
                                isEarned 
                                  ? `${badgeItem.iconBgClass} text-white`
                                  : "bg-zinc-100 text-zinc-400 dark:bg-zinc-900"
                              }`}>
                                <BadgeIcon className="h-5 w-5" />
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5">
                                  <h4 className="text-xs font-black text-zinc-800 dark:text-zinc-200 leading-none">{badgeItem.name}</h4>
                                  {!isEarned ? (
                                    <span className="text-[8px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">Locked</span>
                                  ) : (
                                    <span className="text-[8px] font-bold text-orange-500 dark:text-orange-400 uppercase tracking-wide">Earned</span>
                                  )}
                                </div>
                                <p className="text-[10px] text-zinc-500 dark:text-zinc-450 leading-tight">{badgeItem.desc}</p>
                                <div className="text-[8px] text-zinc-400 font-bold mt-1">
                                  {isEarned ? "🎉 Unlocked!" : `Requirement: ${badgeItem.req}`}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* --- 7. REVISION NOTES TAB --- */}
                {activeTab === "revision-notes" && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Add note panel */}
                    <form onSubmit={handleSaveRevisionNote} className="lg:col-span-1 rounded-2xl border border-zinc-200 bg-white/40 p-6 dark:border-zinc-900 dark:bg-zinc-900/10 backdrop-blur-md flex flex-col gap-4">
                      <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                        Create Revision Note
                      </h3>
                      
                      <div className="space-y-3.5 text-xs">
                        <div>
                          <label className="block font-semibold text-zinc-550 dark:text-zinc-400">Problem Title</label>
                          <input
                            type="text"
                            value={revisionTitle}
                            onChange={(e) => setRevisionTitle(e.target.value)}
                            placeholder="e.g. Spiral Matrix (Medium)"
                            className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs focus:border-orange-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-800 dark:text-white"
                            required
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-zinc-555 dark:text-zinc-400">Key Concept Summary</label>
                          <textarea
                            value={revisionNotesField}
                            onChange={(e) => setRevisionNotesField(e.target.value)}
                            placeholder="Brief description of the core trick or data structure used..."
                            rows={2}
                            className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs focus:border-orange-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-800 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-zinc-555 dark:text-zinc-400">Optimal Approach</label>
                          <textarea
                            value={revisionApproach}
                            onChange={(e) => setRevisionApproach(e.target.value)}
                            placeholder="Detail step-by-step resolution algorithm..."
                            rows={3}
                            className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs focus:border-orange-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-800 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-zinc-555 dark:text-zinc-400">Common Pitfalls & Mistakes</label>
                          <textarea
                            value={revisionMistakes}
                            onChange={(e) => setRevisionMistakes(e.target.value)}
                            placeholder="What caused bugs or corner cases during coding?"
                            rows={2}
                            className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs focus:border-orange-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-800 dark:text-white"
                          />
                        </div>

                        {/* Complexity selectors */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block font-semibold text-zinc-550 dark:text-zinc-400">Time Complex.</label>
                            <select
                              value={revisionTimeComplexity}
                              onChange={(e) => setRevisionTimeComplexity(e.target.value)}
                              className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs focus:border-orange-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-800 dark:text-white"
                            >
                              {["O(1)", "O(log N)", "O(N)", "O(N log N)", "O(N^2)", "O(2^N)"].map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block font-semibold text-zinc-550 dark:text-zinc-400">Space Complex.</label>
                            <select
                              value={revisionSpaceComplexity}
                              onChange={(e) => setRevisionSpaceComplexity(e.target.value)}
                              className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs focus:border-orange-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-800 dark:text-white"
                            >
                              {["O(1)", "O(log N)", "O(N)", "O(N^2)"].map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Bookmark / Favorite toggles */}
                        <div className="flex gap-4 items-center pt-2">
                          <label className="flex items-center gap-1.5 font-semibold text-zinc-600 dark:text-zinc-400 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={revisionIsFavorite}
                              onChange={(e) => setRevisionIsFavorite(e.target.checked)}
                              className="accent-orange-500"
                            />
                            Favorite ⭐
                          </label>
                          <label className="flex items-center gap-1.5 font-semibold text-zinc-600 dark:text-zinc-400 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={revisionIsBookmarked}
                              onChange={(e) => setRevisionIsBookmarked(e.target.checked)}
                              className="accent-orange-500"
                            />
                            Bookmark 🔖
                          </label>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 mt-2 rounded-lg bg-orange-500 text-xs font-semibold text-white hover:bg-orange-600 transition-colors cursor-pointer shadow-lg shadow-orange-500/10"
                      >
                        Save Note to Database
                      </button>
                    </form>

                    {/* Notes listing panel */}
                    <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white/40 p-6 dark:border-zinc-900 dark:bg-zinc-900/10 backdrop-blur-md flex flex-col gap-4">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <h3 className="text-sm font-bold text-zinc-750 dark:text-zinc-300">
                          Revision Library
                        </h3>
                        
                        <div className="flex gap-2 text-[10px] font-bold">
                          <button
                            type="button"
                            onClick={() => {
                              setStudyMode(studyMode === "list" ? "flashcard" : "list");
                              setQuizActive(false);
                            }}
                            className={`rounded px-2.5 py-1.5 border transition-all cursor-pointer flex items-center gap-1 ${
                              studyMode === "flashcard"
                                ? "bg-purple-500/15 border-purple-500 text-purple-500 dark:bg-purple-500/20"
                                : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-955 text-zinc-450 hover:bg-zinc-50"
                            }`}
                          >
                            <span>{studyMode === "list" ? "🃏 Study Cards" : "📝 List View"}</span>
                          </button>
                          {studyMode === "flashcard" && !quizActive && revisionNotes.length > 0 && (
                            <button
                              type="button"
                              onClick={handleStartQuiz}
                              className="rounded px-2.5 py-1.5 border border-purple-500 bg-purple-500 text-white transition-all hover:bg-purple-600 cursor-pointer flex items-center gap-1 shadow-md shadow-purple-500/10"
                            >
                              <span>▶ Start Quiz</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setRevisionFavoriteFilter(!revisionFavoriteFilter)}
                            className={`rounded px-2.5 py-1.5 border transition-all cursor-pointer ${
                              revisionFavoriteFilter
                                ? "bg-orange-550/15 border-orange-500 text-orange-500"
                                : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 text-zinc-450 hover:bg-zinc-50"
                            }`}
                          >
                            ⭐ Favorites Only
                          </button>
                          <button
                            type="button"
                            onClick={() => setRevisionBookmarkFilter(!revisionBookmarkFilter)}
                            className={`rounded px-2.5 py-1.5 border transition-all cursor-pointer ${
                              revisionBookmarkFilter
                                ? "bg-orange-555/15 border-orange-500 text-orange-500"
                                : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 text-zinc-450 hover:bg-zinc-50"
                            }`}
                          >
                            🔖 Bookmarked Only
                          </button>
                        </div>
                      </div>

                      {/* Search Note bar */}
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-450" />
                        <input
                          type="text"
                          value={revisionSearch}
                          onChange={(e) => setRevisionSearch(e.target.value)}
                          placeholder="Search titles, concepts, approaches..."
                          className="w-full rounded-lg border border-zinc-200 bg-white/50 pl-9 pr-4 py-2 text-xs focus:border-orange-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 text-zinc-800 dark:text-white"
                        />
                      </div>
                      
                      {/* Notes cards lists */}
                      {quizActive ? (
                        /* Render Quiz Session Panel */
                        <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5 space-y-4 flex flex-col justify-between min-h-[400px] relative dark:border-purple-500/15">
                          {quizFinished ? (
                            /* Summary screen */
                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-6">
                              <span className="text-4xl animate-bounce">🎉</span>
                              <h4 className="text-sm font-black text-purple-600 dark:text-purple-450 uppercase tracking-widest leading-none">Quiz Completed!</h4>
                              <p className="text-xs text-zinc-650 dark:text-zinc-300 max-w-xs font-semibold mt-1">
                                You correctly recalled {quizScore} out of {revisionNotes.length} concepts!
                              </p>

                              {/* Progress bar */}
                              <div className="w-full max-w-xs bg-zinc-200 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-purple-500 rounded-full transition-all duration-500"
                                  style={{ width: `${(quizScore / revisionNotes.length) * 100}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-black text-zinc-450 dark:text-zinc-500 uppercase leading-none mt-1">
                                Score: {Math.round((quizScore / revisionNotes.length) * 100)}%
                              </span>

                              <div className="flex gap-3 mt-4 w-full max-w-xs justify-center">
                                <button
                                  type="button"
                                  onClick={handleClaimQuizReward}
                                  className="flex-1 rounded-lg bg-orange-500 px-4 py-2.5 text-[10px] font-bold text-white transition-all hover:bg-orange-600 active:scale-95 cursor-pointer shadow-md shadow-orange-500/10"
                                >
                                  Claim +50 XP
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setQuizActive(false);
                                    setQuizFinished(false);
                                  }}
                                  className="flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-[10px] font-bold text-zinc-700 hover:bg-zinc-100 cursor-pointer dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-350 dark:hover:bg-zinc-900"
                                >
                                  Return to Library
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* Active Quiz deck */
                            <div className="flex-1 flex flex-col justify-between space-y-4">
                              {/* Header details */}
                              <div className="space-y-1.5">
                                <div className="flex justify-between items-baseline text-[10px] font-black text-zinc-450 dark:text-zinc-500 uppercase">
                                  <span>Concept Quiz</span>
                                  <span>Card {quizIndex + 1} of {revisionNotes.length}</span>
                                </div>
                                <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-purple-500 rounded-full transition-all duration-300"
                                    style={{ width: `${((quizIndex) / revisionNotes.length) * 100}%` }}
                                  />
                                </div>
                              </div>

                              {/* Centered card viewport */}
                              <div className="flex-1 flex items-center justify-center py-2">
                                <div 
                                  className="h-56 [perspective:1000px] w-full max-w-sm relative cursor-pointer"
                                  onClick={() => setQuizFlipped(!quizFlipped)}
                                >
                                  <motion.div
                                    animate={{ rotateY: quizFlipped ? 180 : 0 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    style={{ transformStyle: "preserve-3d" }}
                                    className="w-full h-full relative"
                                  >
                                    {/* Front */}
                                    <div
                                      style={{ backfaceVisibility: "hidden" }}
                                      className="absolute inset-0 p-5 rounded-xl border border-zinc-200 bg-white shadow-sm flex flex-col justify-between dark:border-zinc-800 dark:bg-zinc-950/95"
                                    >
                                      <div className="space-y-2 text-left">
                                        <div className="flex gap-1">
                                          <span className="text-[9px] font-black tracking-wider uppercase bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded-full inline-block">
                                            Time: {revisionNotes[quizIndex]?.timeComplexity}
                                          </span>
                                          <span className="text-[9px] font-black tracking-wider uppercase bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full inline-block">
                                            Space: {revisionNotes[quizIndex]?.spaceComplexity}
                                          </span>
                                        </div>
                                        <h4 className="text-xs font-bold text-zinc-850 dark:text-zinc-200 line-clamp-2 leading-tight mt-1">{revisionNotes[quizIndex]?.title}</h4>
                                        <div className="text-[9px] text-zinc-400 font-bold mt-1.5">Question / Invariant:</div>
                                        <p className="text-[10px] text-zinc-550 dark:text-zinc-400 line-clamp-4 leading-normal italic mt-0.5">"{revisionNotes[quizIndex]?.notes}"</p>
                                      </div>
                                      <div className="text-[9px] text-center text-purple-500 font-bold border-t border-zinc-100 dark:border-zinc-900 pt-2 leading-none">
                                        🔄 Click card to flip and verify approach
                                      </div>
                                    </div>

                                    {/* Back */}
                                    <div
                                      style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                                      className="absolute inset-0 p-5 rounded-xl border border-purple-500/30 bg-zinc-50/50 shadow-sm flex flex-col justify-between dark:border-purple-550/20 dark:bg-zinc-900/60"
                                    >
                                      <div className="space-y-2.5 overflow-y-auto no-scrollbar h-full text-left">
                                        <div className="flex justify-between items-baseline border-b border-zinc-200/50 pb-1.5 dark:border-zinc-800/50">
                                          <h4 className="text-xs font-bold text-orange-500">{revisionNotes[quizIndex]?.title}</h4>
                                          <span className="text-[8px] font-black text-purple-500 uppercase tracking-widest leading-none">Back Face</span>
                                        </div>

                                        <div className="space-y-1">
                                          <div className="text-[8px] font-black text-purple-500 uppercase tracking-wider">Optimal Scheme</div>
                                          <p className="text-[10px] text-zinc-655 dark:text-zinc-350 leading-relaxed font-semibold">{revisionNotes[quizIndex]?.approach}</p>
                                        </div>

                                        {revisionNotes[quizIndex]?.mistakes && (
                                          <div className="space-y-0.5">
                                            <div className="text-[8px] font-black text-red-500 uppercase tracking-wider">Pitfalls & Mistakes</div>
                                            <p className="text-[10px] text-zinc-500 dark:text-zinc-450 leading-normal italic">"{revisionNotes[quizIndex]?.mistakes}"</p>
                                          </div>
                                        )}
                                      </div>
                                      <div className="text-[9px] text-center text-zinc-400 font-bold border-t border-zinc-200/40 dark:border-zinc-800/40 pt-1.5 leading-none">
                                        🔄 Click to flip back
                                      </div>
                                    </div>
                                  </motion.div>
                                </div>
                              </div>

                              {/* User grading choice */}
                              <div className="flex gap-3 justify-center">
                                <button
                                  type="button"
                                  onClick={() => handleQuizChoice(false)}
                                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] font-black rounded-lg border border-red-500/25 transition-all cursor-pointer flex items-center gap-1"
                                >
                                  <span>❌ Hard (Review Later)</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleQuizChoice(true)}
                                  className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-455 text-[10px] font-black rounded-lg border border-green-500/25 transition-all cursor-pointer flex items-center gap-1"
                                >
                                  <span>✔️ Easy (Got It Right!)</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : studyMode === "flashcard" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[460px] overflow-y-auto no-scrollbar pr-1">
                          {revisionNotes.length > 0 ? (
                            revisionNotes.map((note) => {
                              const isFlipped = !!flippedNotes[note._id];
                              return (
                                <div
                                  key={note._id}
                                  className="h-64 [perspective:1000px] w-full relative cursor-pointer group"
                                  onClick={() => {
                                    setFlippedNotes((prev) => ({
                                      ...prev,
                                      [note._id]: !prev[note._id],
                                    }));
                                  }}
                                >
                                  <motion.div
                                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                    style={{ transformStyle: "preserve-3d" }}
                                    className="w-full h-full relative"
                                  >
                                    {/* Front Side */}
                                    <div
                                      style={{ backfaceVisibility: "hidden" }}
                                      className="absolute inset-0 p-5 rounded-xl border border-zinc-200 bg-white shadow-sm flex flex-col justify-between dark:border-zinc-800 dark:bg-zinc-950/95"
                                    >
                                      <div className="space-y-2">
                                        <div className="flex justify-between items-start">
                                          <div className="flex gap-1.5">
                                            <span className="text-[9px] font-black tracking-wider uppercase bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded-full">
                                              {note.timeComplexity}
                                            </span>
                                            <span className="text-[9px] font-black tracking-wider uppercase bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full">
                                              {note.spaceComplexity}
                                            </span>
                                          </div>
                                          <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Concept</span>
                                        </div>
                                        <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-1 line-clamp-2 leading-tight">{note.title}</h4>
                                        <div className="text-[9px] text-zinc-400 font-bold mt-2">Description Question:</div>
                                        <p className="text-[10px] text-zinc-550 dark:text-zinc-400 line-clamp-4 leading-normal mt-0.5 italic">"{note.notes}"</p>
                                      </div>
                                      <div className="text-[9px] font-bold text-purple-500 flex items-center justify-between mt-2 pt-2 border-t border-zinc-150 dark:border-zinc-900">
                                        <span>🔄 Click card to reveal solution</span>
                                        <span className="text-[8px] text-zinc-400 uppercase tracking-widest font-black">Flashcard</span>
                                      </div>
                                    </div>

                                    {/* Back Side */}
                                    <div
                                      style={{
                                        backfaceVisibility: "hidden",
                                        transform: "rotateY(180deg)",
                                      }}
                                      className="absolute inset-0 p-5 rounded-xl border border-purple-500/30 bg-zinc-50/50 shadow-sm flex flex-col justify-between dark:border-purple-500/20 dark:bg-zinc-900/60"
                                    >
                                      <div className="space-y-2.5 overflow-y-auto no-scrollbar h-full">
                                        <div className="flex justify-between items-baseline border-b border-zinc-200/50 pb-1.5 dark:border-zinc-800/50">
                                          <h4 className="text-xs font-bold text-orange-500">{note.title}</h4>
                                          <span className="text-[9px] font-black text-purple-500 uppercase tracking-wider font-semibold">Solution</span>
                                        </div>

                                        <div className="space-y-1">
                                          <div className="text-[9px] font-black text-purple-500 uppercase tracking-wider">Resolution Approach</div>
                                          <p className="text-[10px] text-zinc-650 dark:text-zinc-350 leading-relaxed font-semibold">{note.approach}</p>
                                        </div>

                                        {note.mistakes && (
                                          <div className="space-y-0.5">
                                            <div className="text-[9px] font-black text-red-500 uppercase tracking-wider">Pitfalls & Mistakes</div>
                                            <p className="text-[10px] text-zinc-500 dark:text-zinc-455 leading-normal italic">"{note.mistakes}"</p>
                                          </div>
                                        )}
                                      </div>

                                      <div className="text-[9px] font-bold text-zinc-400 flex justify-between items-center mt-1 pt-1.5 border-t border-zinc-200/40 dark:border-zinc-800/40">
                                        <span>🔄 Click to flip back</span>
                                        <div className="flex gap-1">
                                          <span className="bg-orange-500/10 text-orange-500 px-1.5 py-0.5 rounded text-[8px]">{note.timeComplexity}</span>
                                          <span className="bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded text-[8px]">{note.spaceComplexity}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-xs text-zinc-450 italic text-center py-8 col-span-2">No matching revision records found.</p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4 max-h-[460px] overflow-y-auto no-scrollbar pr-1">
                          {revisionNotes.length > 0 ? (
                            revisionNotes.map((note) => (
                              <div key={note._id} className="p-5 rounded-xl border border-zinc-200/80 bg-zinc-50/20 dark:border-zinc-850 dark:bg-zinc-950/20 relative flex flex-col justify-between gap-3">
                                <div>
                                  <div className="flex justify-between items-start gap-4">
                                    <h4 className="text-xs font-bold text-orange-500 leading-tight">{note.title}</h4>
                                    
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <button
                                        type="button"
                                        onClick={() => handleToggleFavorite(note._id, note.isFavorite)}
                                        className={`p-1 cursor-pointer transition-colors ${
                                          note.isFavorite ? "text-yellow-500" : "text-zinc-400 hover:text-yellow-500"
                                        }`}
                                      >
                                        ⭐
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleToggleBookmark(note._id, note.isBookmarked)}
                                        className={`p-1 cursor-pointer transition-colors ${
                                          note.isBookmarked ? "text-orange-500" : "text-zinc-400 hover:text-orange-500"
                                        }`}
                                      >
                                        🔖
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteRevisionNote(note._id)}
                                        className="p-1 text-zinc-400 hover:text-red-500 cursor-pointer"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="flex gap-2 mt-2">
                                    <span className="text-[9px] font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded">
                                      Time: {note.timeComplexity}
                                    </span>
                                    <span className="text-[9px] font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded">
                                      Space: {note.spaceComplexity}
                                    </span>
                                  </div>
                                </div>

                                <div className="space-y-2.5 text-[11px] border-t border-zinc-100 dark:border-zinc-850/50 pt-3">
                                  {note.notes && (
                                    <div>
                                      <span className="font-bold block text-zinc-400">Concept Invariant</span>
                                      <p className="text-zinc-650 dark:text-zinc-300 leading-normal">{note.notes}</p>
                                    </div>
                                  )}
                                  {note.approach && (
                                    <div>
                                      <span className="font-bold block text-zinc-400">Optimal Resolution Scheme</span>
                                      <p className="text-zinc-650 dark:text-zinc-300 leading-normal">{note.approach}</p>
                                    </div>
                                  )}
                                  {note.mistakes && (
                                    <div className="bg-red-500/5 border border-red-500/10 p-2 rounded-lg">
                                      <span className="font-bold block text-red-500">Pitfalls & Errors Logged</span>
                                      <p className="text-red-600/90 dark:text-red-400/90 leading-normal">{note.mistakes}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-zinc-450 italic text-center py-8">No matching revision records found.</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* --- 8. AI COACH TAB --- */}
                {activeTab === "ai-coach" && (
                  <div className="space-y-6">
                    {/* Header trigger panel */}
                    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-200/60 bg-white/40 p-5 dark:border-zinc-900 dark:bg-zinc-900/10 backdrop-blur-md">
                      <div>
                        <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Gemini AI Study Coach</h3>
                        <p className="text-xs text-zinc-450 dark:text-zinc-550">Analyze solved counts to generate tailored schedules and predictions</p>
                      </div>

                      <button
                        onClick={handleRunCoachDiagnostic}
                        disabled={runningDiagnostic}
                        className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-orange-600 active:scale-95 disabled:opacity-50 cursor-pointer shadow-lg shadow-orange-500/15"
                      >
                        <Brain className={`h-4 w-4 ${runningDiagnostic ? "animate-bounce" : ""}`} />
                        {runningDiagnostic ? "Analyzing Profile..." : "Run AI Diagnostic"}
                      </button>
                    </div>

                    {runningDiagnostic && (
                      <div className="rounded-2xl border border-zinc-200 bg-white/40 p-8 dark:border-zinc-900 dark:bg-zinc-900/10 backdrop-blur-md flex flex-col items-center justify-center gap-3">
                        <Sparkles className="h-8 w-8 text-orange-500 animate-spin" />
                        <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Synthesizing profile statistics...</h4>
                        <p className="text-[10px] text-zinc-450">Gemini is compiling weak topics and problem mappings</p>
                      </div>
                    )}

                    {!runningDiagnostic && !coachDiagnostic && (
                      <div className="rounded-2xl border border-zinc-200 bg-white/40 p-10 dark:border-zinc-900 dark:bg-zinc-900/10 backdrop-blur-md text-center space-y-3">
                        <div className="text-3xl">🤖</div>
                        <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300">No active AI Diagnostic found</h4>
                        <p className="text-[10px] text-zinc-450 max-w-sm mx-auto">
                          Click "Run AI Diagnostic" above to query Gemini models on your solved counts, ranking, and topic distribution.
                        </p>
                      </div>
                    )}

                    {!runningDiagnostic && coachDiagnostic && (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left column */}
                        <div className="lg:col-span-1 space-y-6">
                          {/* Daily Recommendation */}
                          <div className="rounded-2xl border border-orange-500/25 bg-orange-500/5 p-5 dark:border-orange-500/10 dark:bg-orange-500/[0.015] backdrop-blur-md flex flex-col justify-between gap-3">
                            <div>
                              <span className="text-[9px] font-bold text-orange-500 uppercase tracking-widest block">Daily Recommendation</span>
                              <h4 className="text-xs font-black text-zinc-900 dark:text-white mt-1">Today's Workout Target</h4>
                              <p className="text-xs leading-normal text-zinc-750 dark:text-zinc-300 mt-3 font-semibold">
                                {coachDiagnostic.dailyRecommendation}
                              </p>
                            </div>
                            <span className="text-[9px] font-bold text-orange-500/80 bg-orange-500/10 self-start px-2 py-0.5 rounded uppercase">
                              Active Daily Challenge
                            </span>
                          </div>

                          {/* Contest Rating improvement */}
                          <div className="rounded-2xl border border-zinc-200 bg-white/40 p-5 dark:border-zinc-850 dark:bg-zinc-900/10 backdrop-blur-md space-y-3">
                            <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block">Forecast rating index</span>
                            <h4 className="text-xs font-black text-zinc-900 dark:text-white mt-1">Contest Rating Prediction</h4>
                            
                            <div className="flex items-baseline gap-4 mt-3">
                              <div>
                                <span className="text-xs text-zinc-450 block font-semibold">Current</span>
                                <span className="text-xl font-black text-zinc-800 dark:text-white">{coachDiagnostic.ratingPrediction.current}</span>
                              </div>
                              <div className="text-xl font-bold text-zinc-400">→</div>
                              <div>
                                <span className="text-xs text-zinc-450 block font-semibold">3-Month Forecast</span>
                                <span className="text-xl font-black text-indigo-500">{coachDiagnostic.ratingPrediction.predicted3Months}</span>
                              </div>
                            </div>
                            
                            <div className="text-[10px] leading-relaxed text-zinc-550 dark:text-zinc-450 border-t border-zinc-100 dark:border-zinc-850 pt-3">
                              <span className="font-bold block text-zinc-400">Roadmap Strategy</span>
                              {coachDiagnostic.ratingPrediction.growthStrategy}
                            </div>
                          </div>

                          {/* Weak topics mapped */}
                          <div className="rounded-2xl border border-zinc-200 bg-white/40 p-5 dark:border-zinc-850 dark:bg-zinc-900/10 backdrop-blur-md space-y-3">
                            <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest block">Action priorities</span>
                            <h4 className="text-xs font-black text-zinc-900 dark:text-white mt-1">Identified Weakness Areas</h4>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {coachDiagnostic.weakTopics.map((topic: string, i: number) => (
                                <span key={i} className="text-[9px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded">
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Middle & Right columns */}
                        <div className="lg:col-span-2 space-y-6">
                          {/* Recommended Problems */}
                          <div className="rounded-2xl border border-zinc-200 bg-white/40 p-5 dark:border-zinc-850 dark:bg-zinc-900/10 backdrop-blur-md">
                            <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider mb-4">Recommended Practice Sets</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {coachDiagnostic.problemsRecommended.map((prob: any, i: number) => (
                                <a
                                  key={i}
                                  href={prob.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/20 dark:border-zinc-800 dark:bg-zinc-950/20 hover:border-orange-500/40 hover:bg-orange-500/[0.015] transition-all flex flex-col justify-between text-xs"
                                >
                                  <div>
                                    <span className="font-bold block text-zinc-800 dark:text-zinc-200">{prob.title}</span>
                                    <span className={`inline-block text-[9px] font-bold mt-2 px-1.5 py-0.5 rounded ${
                                      prob.difficulty === "Easy"
                                        ? "bg-green-500/10 text-green-500"
                                        : prob.difficulty === "Medium"
                                        ? "bg-yellow-500/10 text-yellow-500"
                                        : "bg-red-500/10 text-red-500"
                                    }`}>
                                      {prob.difficulty}
                                    </span>
                                  </div>
                                  <span className="text-[9px] font-semibold text-orange-500 mt-3 inline-flex items-center gap-0.5 self-start">
                                    Solve Problem <ArrowUpRight className="h-3 w-3" />
                                  </span>
                                </a>
                              ))}
                            </div>
                          </div>

                          {/* Roadmap & Schedules */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Prep roadmap */}
                            <div className="rounded-2xl border border-zinc-200 bg-white/40 p-5 dark:border-zinc-850 dark:bg-zinc-900/10 backdrop-blur-md space-y-4">
                              <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider">Interview prep roadmap</h4>
                              <div className="space-y-3 text-xs">
                                {coachDiagnostic.interviewRoadmap.map((step: any, i: number) => (
                                  <div key={i} className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                      <div className="h-6 w-6 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 text-[10px] font-bold">
                                        {i + 1}
                                      </div>
                                      {i < coachDiagnostic.interviewRoadmap.length - 1 && (
                                        <div className="w-0.5 bg-zinc-200 dark:bg-zinc-800 flex-1 my-1" />
                                      )}
                                    </div>
                                    <div>
                                      <span className="font-bold text-zinc-800 dark:text-zinc-200 block">{step.week}: {step.focus}</span>
                                      <span className="text-[10px] text-zinc-450 block mt-0.5">Milestone: {step.milestone}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Weekly schedule */}
                            <div className="rounded-2xl border border-zinc-200 bg-white/40 p-5 dark:border-zinc-850 dark:bg-zinc-900/10 backdrop-blur-md space-y-4">
                              <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider">Weekly schedule</h4>
                              <div className="space-y-2.5 text-xs max-h-[220px] overflow-y-auto no-scrollbar">
                                {coachDiagnostic.weeklySchedule.map((sch: any, i: number) => (
                                  <div key={i} className="flex justify-between items-center p-2 rounded-lg border border-zinc-200/50 bg-zinc-50/10 dark:border-zinc-850 dark:bg-zinc-950/20">
                                    <div>
                                      <span className="font-bold text-zinc-800 dark:text-zinc-250 block">{sch.day}</span>
                                      <span className="text-[10px] text-zinc-450 block mt-0.5">{sch.topic}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">
                                      {sch.duration}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* --- 9. GITHUB REPO INTEGRATIONS TAB --- */}
                {activeTab === "github" && (
                  <div className="space-y-6">
                    {!githubConnected ? (
                      /* Connect screen */
                      <div className="rounded-2xl border border-zinc-200 bg-white/40 p-12 dark:border-zinc-900 dark:bg-zinc-900/10 backdrop-blur-md text-center max-w-xl mx-auto space-y-6 flex flex-col items-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 text-white dark:bg-zinc-800 shadow-xl shadow-zinc-950/20">
                          <Code2 className="h-9 w-9" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-base font-black text-zinc-900 dark:text-white">Synchronize Your Code to GitHub</h3>
                          <p className="text-xs text-zinc-450 leading-relaxed max-w-sm mx-auto">
                            Connect your GitHub profile to back up solved LeetCode solutions, revision notes, and templates directly to your repositories.
                          </p>
                        </div>
                        <button
                          onClick={handleConnectGithub}
                          disabled={loadingGithub}
                          className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 text-white hover:bg-zinc-850 px-6 py-3 text-xs font-bold transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-lg shadow-zinc-900/20 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                        >
                          {loadingGithub ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Connecting to GitHub...
                            </>
                          ) : (
                            <>
                              <Code2 className="h-4 w-4" />
                              Connect GitHub Account
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      /* Connected profile screen */
                      <div className="space-y-6">
                        {/* Profile Header */}
                        <div className="rounded-2xl border border-zinc-200 bg-white/40 p-6 dark:border-zinc-900 dark:bg-zinc-900/10 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
                          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                            <img
                              src={githubProfile.user.avatarUrl}
                              alt="GitHub Avatar"
                              className="h-16 w-16 rounded-full object-cover border-2 border-orange-500/20"
                            />
                            <div>
                              <div className="flex items-center gap-2 justify-center md:justify-start">
                                <h3 className="text-base font-black text-zinc-900 dark:text-white">{githubProfile.user.name}</h3>
                                <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-full">
                                  @{githubProfile.user.username}
                                </span>
                              </div>
                              <p className="text-xs text-zinc-450 dark:text-zinc-500 mt-1 max-w-md">{githubProfile.user.bio}</p>
                              
                              <div className="flex gap-4 mt-3 text-[10px] text-zinc-550 dark:text-zinc-450 justify-center md:justify-start font-bold">
                                <span>👥 {githubProfile.user.followers} followers</span>
                                <span>•</span>
                                <span>{githubProfile.user.following} following</span>
                                <span>•</span>
                                <span>📂 {githubProfile.user.publicRepos} public repos</span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={handleDisconnectGithub}
                            className="rounded-lg border border-red-500/25 bg-red-500/5 hover:bg-red-500/10 px-4 py-2 text-xs font-bold text-red-600 dark:text-red-400 cursor-pointer transition-colors"
                          >
                            Disconnect GitHub
                          </button>
                        </div>

                        {/* Middle grid details */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Left Column: Language distribution & Contribution Heatmap */}
                          <div className="lg:col-span-2 space-y-6">
                            
                            {/* GitHub-style Contribution Heatmap */}
                            <div className="rounded-2xl border border-zinc-200 bg-white/40 p-6 dark:border-zinc-900 dark:bg-zinc-900/10 backdrop-blur-md">
                              <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider mb-4">Contribution History</h4>
                              <div className="flex overflow-x-auto pb-2 no-scrollbar">
                                <div className="flex gap-[3px]">
                                  {githubProfile.contributionWeeks.map((week: any, wIndex: number) => (
                                    <div key={wIndex} className="flex flex-col gap-[3px]">
                                      {week.map((day: any, dIndex: number) => {
                                        const shadeClasses = [
                                          "bg-zinc-100 dark:bg-zinc-900/60",
                                          "bg-green-500/20 dark:bg-green-950/40",
                                          "bg-green-500/40 dark:bg-green-800/40",
                                          "bg-green-500/70 dark:bg-green-700/70",
                                          "bg-green-500 dark:bg-green-500"
                                        ];
                                        return (
                                          <div
                                            key={dIndex}
                                            className={`h-[9.5px] w-[9.5px] rounded-[1.5px] ${shadeClasses[day.level]}`}
                                          />
                                        );
                                      })}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <p className="text-[10px] text-zinc-450 mt-3">Solve commits linked from contribution weeks matrix</p>
                            </div>

                            {/* Pinned repos grid */}
                            <div className="space-y-4">
                              <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider">Pinned Repositories</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {githubProfile.pinnedRepos.map((pin: any, i: number) => (
                                  <div key={i} className="rounded-xl border border-zinc-200/80 bg-zinc-50/20 p-4 dark:border-zinc-850 dark:bg-zinc-950/20 flex flex-col justify-between text-xs gap-3">
                                    <div>
                                      <h5 className="font-bold text-zinc-900 dark:text-white truncate">{pin.name}</h5>
                                      <p className="text-[10px] text-zinc-450 mt-1 line-clamp-2 leading-relaxed">{pin.description}</p>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500">
                                      <span className="flex items-center gap-1">⭐ {pin.stars}</span>
                                      <span className="flex items-center gap-1">🍴 {pin.forks}</span>
                                      <span className="bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded text-[8px] uppercase">
                                        {pin.language}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Right Column: Languages & Commits */}
                          <div className="lg:col-span-1 space-y-6">
                            
                            {/* Languages used breakdown */}
                            <div className="rounded-2xl border border-zinc-200 bg-white/40 p-5 dark:border-zinc-850 dark:bg-zinc-900/10 backdrop-blur-md space-y-4">
                              <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider">Languages Distribution</h4>
                              <div className="h-3 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden flex">
                                {githubProfile.languages.map((lang: any, i: number) => (
                                  <div
                                    key={i}
                                    style={{ width: `${lang.percent}%`, backgroundColor: lang.color }}
                                    title={`${lang.name}: ${lang.percent}%`}
                                  />
                                ))}
                              </div>
                              <div className="space-y-2 text-[10px] font-bold text-zinc-550 dark:text-zinc-450 pt-2">
                                {githubProfile.languages.map((lang: any, i: number) => (
                                  <div key={i} className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5">
                                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: lang.color }} />
                                      {lang.name}
                                    </span>
                                    <span>{lang.percent}%</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Recent Commit activity log */}
                            <div className="rounded-2xl border border-zinc-200 bg-white/40 p-5 dark:border-zinc-850 dark:bg-zinc-900/10 backdrop-blur-md space-y-4">
                              <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider">Recent commit feed</h4>
                              <div className="space-y-3.5 text-xs max-h-[220px] overflow-y-auto no-scrollbar">
                                {githubProfile.recentActivity.map((act: any, i: number) => (
                                  <div key={i} className="p-2 border-l-2 border-orange-500 bg-zinc-50/10 dark:bg-zinc-950/20 text-[10px] space-y-1">
                                    <div className="flex justify-between items-baseline">
                                      <span className="font-bold text-zinc-850 dark:text-zinc-200">{act.repo}</span>
                                      <span className="text-[9px] text-zinc-450">{act.time}</span>
                                    </div>
                                    <p className="text-zinc-500 leading-normal">{act.detail}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Public Repos list */}
                        <div className="rounded-2xl border border-zinc-200 bg-white/40 p-6 dark:border-zinc-900 dark:bg-zinc-900/10 backdrop-blur-md">
                          <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider mb-4">All Repositories</h4>
                          <div className="space-y-2.5 max-h-[300px] overflow-y-auto no-scrollbar">
                            {githubProfile.repos.map((repo: any, i: number) => (
                              <div key={i} className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200/50 bg-zinc-50/10 dark:border-zinc-850 dark:bg-zinc-950/20 text-xs">
                                <div>
                                  <span className="font-bold text-zinc-900 dark:text-white">{repo.name}</span>
                                  {repo.description && (
                                    <p className="text-[10px] text-zinc-450 mt-1 line-clamp-1">{repo.description}</p>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-500 shrink-0">
                                  <span>⭐ {repo.stars}</span>
                                  <span className="bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded text-[8px] uppercase">
                                    {repo.language}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* --- 10. SETTINGS CONFIG TAB --- */}
                {activeTab === "settings" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      {/* Left: Profile & Theme settings */}
                      <div className="lg:col-span-2 space-y-6">
                        
                        {/* Profile Settings */}
                        <div className="rounded-2xl border border-zinc-200 bg-white/40 p-6 dark:border-zinc-900 dark:bg-zinc-900/10 backdrop-blur-md space-y-4">
                          <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider">Profile Configuration</h4>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div>
                              <label className="block font-bold text-zinc-550 dark:text-zinc-450 mb-1.5">Display Name</label>
                              <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:border-orange-500 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block font-bold text-zinc-550 dark:text-zinc-455 mb-1.5">Email Address</label>
                              <input
                                type="email"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:border-orange-500 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block font-bold text-zinc-550 dark:text-zinc-450 mb-1.5">LeetCode Username Connection</label>
                            <div className="flex gap-2 text-xs">
                              <input
                                type="text"
                                value={leetcodeUsername}
                                onChange={(e) => setLeetcodeUsername(e.target.value)}
                                placeholder="e.g. vansh-leetcode"
                                className="flex-1 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white focus:border-orange-500 focus:outline-none"
                              />
                              <button
                                onClick={() => triggerFetchProfile(leetcodeUsername)}
                                className="rounded-lg bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600 cursor-pointer shadow-lg shadow-orange-500/10"
                              >
                                Sync Profile
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Theme Selection settings */}
                        <div className="rounded-2xl border border-zinc-200 bg-white/40 p-6 dark:border-zinc-900 dark:bg-zinc-900/10 backdrop-blur-md space-y-4">
                          <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider">Appearance Themes</h4>
                          <div className="space-y-3 text-xs">
                            <label className="block font-bold text-zinc-550 dark:text-zinc-450">Active Layout Theme Mode</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-9 gap-3">
                              {[
                                { id: "light", label: "☀️ Light" },
                                { id: "dark", label: "🌙 Classic Dark" },
                                { id: "sunset", label: "🌆 Sunset Glow" },
                                { id: "forest", label: "🌲 Forest Tech" },
                                { id: "arctic", label: "❄️ Arctic Frost" },
                                { id: "cyberpunk", label: "⚡ Cyberpunk" },
                                { id: "rose", label: "🌹 Midnight Rose" },
                                { id: "ocean", label: "🧭 Deep Ocean" },
                                { id: "sage", label: "🌱 Calming Sage" }
                              ].map((item) => (
                                <button
                                  key={item.id}
                                  onClick={() => setTheme(item.id)}
                                  className={`rounded-lg py-2.5 font-bold transition-all border text-center cursor-pointer ${
                                    theme === item.id
                                      ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/10"
                                      : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-350"
                                  }`}
                                >
                                  {item.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Security settings */}
                        <div className="rounded-2xl border border-zinc-200 bg-white/40 p-6 dark:border-zinc-900 dark:bg-zinc-900/10 backdrop-blur-md space-y-4">
                          <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider">Account Security</h4>
                          <div className="flex items-center justify-between text-xs">
                            <div>
                              <h5 className="font-bold text-zinc-800 dark:text-zinc-200">Change password credentials</h5>
                              <p className="text-[10px] text-zinc-450 mt-0.5">Send validation link to reset passcode credentials</p>
                            </div>
                            <button
                              onClick={handleTriggerPasswordReset}
                              className="rounded-lg border border-zinc-200/80 bg-white px-4 py-2 font-bold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 cursor-pointer transition-colors"
                            >
                              Reset Password
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Right Settings panel */}
                      <div className="lg:col-span-1 space-y-6">
                        {/* Notifications Settings */}
                        <div className="rounded-2xl border border-zinc-200 bg-white/40 p-6 dark:border-zinc-900 dark:bg-zinc-900/10 backdrop-blur-md space-y-4 text-xs">
                          <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider">System Notifications</h4>
                          
                          <div className="space-y-3.5">
                            <label className="flex items-center gap-2.5 font-semibold text-zinc-750 dark:text-zinc-300 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={emailAlerts}
                                onChange={(e) => setEmailAlerts(e.target.checked)}
                                className="h-4 w-4 rounded border-zinc-300 text-orange-500 focus:ring-orange-500/20"
                              />
                              Enable solved digest emails
                            </label>
                            <label className="flex items-center gap-2.5 font-semibold text-zinc-750 dark:text-zinc-300 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={weeklyReports}
                                onChange={(e) => setWeeklyReports(e.target.checked)}
                                className="h-4 w-4 rounded border-zinc-300 text-orange-500 focus:ring-orange-500/20"
                              />
                              Enable weekly coaching reports
                            </label>
                          </div>
                        </div>

                        {/* Practice Targets & Preferences */}
                        <div className="rounded-2xl border border-zinc-200 bg-white/40 p-6 dark:border-zinc-900 dark:bg-zinc-900/10 backdrop-blur-md space-y-4 text-xs">
                          <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider">Practice Targets</h4>
                          
                          <div className="space-y-3.5">
                            <div>
                              <label className="block font-bold text-zinc-550 dark:text-zinc-400 mb-1.5">Daily Solve Target</label>
                              <div className="flex gap-2">
                                {[1, 2, 3, 5, 8].map((num) => (
                                  <button
                                    key={num}
                                    type="button"
                                    onClick={() => handleUpdateDailyGoal(num)}
                                    className={`rounded-lg px-3 py-1.5 font-bold transition-all border text-center cursor-pointer flex-1 ${
                                      dailyGoalTarget === num
                                        ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/10"
                                        : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-350 bg-white dark:bg-zinc-950"
                                    }`}
                                  >
                                    {num} {num === 1 ? "Prob" : "Probs"}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="block font-bold text-zinc-550 dark:text-zinc-400 mb-1.5">Target Difficulty Focus</label>
                              <select
                                value={defaultDifficulty}
                                onChange={(e) => handleUpdateDifficulty(e.target.value)}
                                className="w-full rounded-lg border border-zinc-250 bg-white dark:border-zinc-800 dark:bg-zinc-950 px-3 py-2 text-zinc-800 dark:text-white focus:border-orange-500 focus:outline-none"
                              >
                                <option value="easy">Easy Mode (Foundation)</option>
                                <option value="medium">Medium Mode (Interview Standard)</option>
                                <option value="hard">Hard Mode (Advanced Algorithms)</option>
                                <option value="mixed">Mixed Mode (Full Range)</option>
                              </select>
                            </div>

                            <div>
                              <label className="block font-bold text-zinc-555 dark:text-zinc-400 mb-1.5">Coaching Reminders</label>
                              <select
                                value={studyReminder}
                                onChange={(e) => handleUpdateReminder(e.target.value)}
                                className="w-full rounded-lg border border-zinc-250 bg-white dark:border-zinc-800 dark:bg-zinc-955 px-3 py-2 text-zinc-800 dark:text-white focus:border-orange-500 focus:outline-none"
                              >
                                <option value="daily">Daily Alerts</option>
                                <option value="weekly">Weekly Summary only</option>
                                <option value="none">No Alerts (Manual tracking)</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Export & Actions settings */}
                        <div className="rounded-2xl border border-zinc-200 bg-white/40 p-6 dark:border-zinc-900 dark:bg-zinc-900/10 backdrop-blur-md space-y-4 text-xs">
                          <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider">Data Operations</h4>
                          
                          <div className="space-y-2.5">
                            <button
                              onClick={handleExportDataJSON}
                              className="w-full rounded-lg border border-zinc-200 bg-white/50 dark:border-zinc-800 dark:bg-zinc-950/20 py-2.5 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer transition-colors"
                            >
                              Download Data Export (JSON)
                            </button>
                            
                            <button
                              onClick={() => setDeleteConfirmOpen(true)}
                              className="w-full rounded-lg border border-red-500/20 bg-red-500/5 py-2.5 font-bold text-red-600 dark:text-red-400 hover:bg-red-500/10 cursor-pointer transition-colors"
                            >
                              Delete Account Permanently
                            </button>
                          </div>

                          {deleteConfirmOpen && (
                            <div className="border border-red-500/25 bg-red-500/5 p-4 rounded-xl space-y-3 mt-4">
                              <p className="text-[10px] text-red-700 dark:text-red-400 leading-normal font-semibold">
                                This action is irreversible. All goals lists and revision notes databases caches will be destroyed.
                              </p>
                              <div className="flex gap-2">
                                <button
                                  onClick={handleDeleteAccountFinal}
                                  className="rounded bg-red-600 text-white font-bold px-3 py-1.5 text-[10px] hover:bg-red-700 cursor-pointer"
                                >
                                  Yes, Delete
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmOpen(false)}
                                  className="rounded border border-zinc-250 bg-white dark:border-zinc-800 dark:bg-zinc-950 font-bold px-3 py-1.5 text-[10px] hover:bg-zinc-50 cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  </div>
                )}

                {/* --- 11. ADMIN DASHBOARD TAB --- */}
                {activeTab === "admin" && (
                  <div className="space-y-6">
                    {/* Database stats overview cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div className="rounded-xl border border-zinc-200/80 bg-white/40 p-5 dark:border-zinc-850 dark:bg-zinc-900/10 backdrop-blur-md">
                        <span className="text-[9px] font-bold text-orange-500 uppercase tracking-widest block">Cache Records</span>
                        <div className="text-2xl font-black text-zinc-900 dark:text-white mt-1">1,248</div>
                        <p className="text-[10px] text-zinc-450 mt-1">Cached Leetcode Profiles</p>
                      </div>
                      <div className="rounded-xl border border-zinc-200/80 bg-white/40 p-5 dark:border-zinc-850 dark:bg-zinc-900/10 backdrop-blur-md">
                        <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest block">Cache Hit Rate</span>
                        <div className="text-2xl font-black text-zinc-900 dark:text-white mt-1">94.6%</div>
                        <p className="text-[10px] text-zinc-450 mt-1">MongoDB index mapping hit rate</p>
                      </div>
                      <div className="rounded-xl border border-zinc-200/80 bg-white/40 p-5 dark:border-zinc-850 dark:bg-zinc-900/10 backdrop-blur-md">
                        <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest block">Active Subscriptions</span>
                        <div className="text-2xl font-black text-zinc-900 dark:text-white mt-1">84</div>
                        <p className="text-[10px] text-zinc-450 mt-1">Active billing customer records</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Left: User list & management */}
                      <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white/40 p-6 dark:border-zinc-900 dark:bg-zinc-900/10 backdrop-blur-md space-y-4">
                        <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider">Registered User Accounts</h4>
                        
                        <div className="overflow-x-auto pb-2 text-xs">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-zinc-200 dark:border-zinc-850 text-zinc-450 text-[10px] uppercase font-bold">
                                <th className="py-2">User Details</th>
                                <th className="py-2">LeetCode Link</th>
                                <th className="py-2">Level / XP</th>
                                <th className="py-2">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850/50">
                              <tr>
                                <td className="py-3">
                                  <span className="font-bold block text-zinc-800 dark:text-zinc-200">Vansh Gupta</span>
                                  <span className="text-[10px] text-zinc-450">vansh@leetinsight.com</span>
                                </td>
                                <td className="py-3 font-semibold text-orange-500">gupta-codes</td>
                                <td className="py-3 font-bold">Lvl 12 (3,240 XP)</td>
                                <td className="py-3">
                                  <span className="bg-emerald-500/10 text-emerald-500 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">Active</span>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-3">
                                  <span className="font-bold block text-zinc-800 dark:text-zinc-200">Sarah Jenkins</span>
                                  <span className="text-[10px] text-zinc-450">sarah.j@gmail.com</span>
                                </td>
                                <td className="py-3 font-semibold text-orange-500">sarah_codes</td>
                                <td className="py-3 font-bold">Lvl 8 (1,850 XP)</td>
                                <td className="py-3">
                                  <span className="bg-emerald-500/10 text-emerald-500 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">Active</span>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-3">
                                  <span className="font-bold block text-zinc-800 dark:text-zinc-200">Alex Rivera</span>
                                  <span className="text-[10px] text-zinc-450">alex.r@outlook.com</span>
                                </td>
                                <td className="py-3 font-semibold text-orange-500">rivera_alex</td>
                                <td className="py-3 font-bold">Lvl 1 (120 XP)</td>
                                <td className="py-3">
                                  <span className="bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">Inactive</span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Right: Feedback & Issues reports feed */}
                      <div className="lg:col-span-1 rounded-2xl border border-zinc-200 bg-white/40 p-5 dark:border-zinc-850 dark:bg-zinc-900/10 backdrop-blur-md space-y-4">
                        <h4 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider">Developer Feedback & Bugs Feed</h4>
                        
                        <div className="space-y-3.5 text-xs max-h-[300px] overflow-y-auto no-scrollbar">
                          <div className="p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/10 dark:border-zinc-800/80 dark:bg-zinc-950/20 space-y-1">
                            <div className="flex justify-between items-baseline">
                              <span className="font-bold text-zinc-850 dark:text-zinc-200">Sarah Jenkins</span>
                              <span className="text-[9px] text-zinc-450">4 hrs ago</span>
                            </div>
                            <p className="text-[10px] text-zinc-500 leading-normal">"The topic analysis recommends binary search even though accuracy rate is at 90%. Is this normal?"</p>
                          </div>
                          
                          <div className="p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/10 dark:border-zinc-800/80 dark:bg-zinc-950/20 space-y-1">
                            <div className="flex justify-between items-baseline">
                              <span className="font-bold text-zinc-850 dark:text-zinc-200">Alex Rivera</span>
                              <span className="text-[9px] text-zinc-450">1 day ago</span>
                            </div>
                            <p className="text-[10px] text-zinc-500 leading-normal">"Database sync is fast! Verified that goals claims update XP level in real-time."</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Premium Floating Quick Actions Menu */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 no-print">
        {/* Particles container */}
        <div className="relative w-full h-0">
          <AnimatePresence>
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                animate={{ opacity: 0, scale: 0.2, x: p.x, y: p.y }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute h-2.5 w-2.5 rounded-full pointer-events-none shadow-sm"
                style={{ backgroundColor: p.color, bottom: "12px", right: "12px" }}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Quick Action Buttons list */}
        <AnimatePresence>
          {fabOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
                hidden: {
                  transition: {
                    staggerChildren: 0.05,
                    staggerDirection: -1,
                  },
                },
              }}
              className="flex flex-col items-end gap-2.5 mb-2"
            >
              {[
                {
                  label: "Sync LeetCode",
                  icon: RefreshCw,
                  onClick: () => {
                    handleManualSync();
                  },
                  color: "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20",
                  iconClass: syncing ? "animate-spin" : "",
                },
                {
                  label: "Set New Goal",
                  icon: Plus,
                  onClick: () => {
                    setActiveTab("goals");
                    setFabOpen(false);
                  },
                  color: "bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20",
                },
                {
                  label: "Ask AI Coach",
                  icon: Brain,
                  onClick: () => {
                    setActiveTab("ai-coach");
                    setFabOpen(false);
                  },
                  color: "bg-purple-500 hover:bg-purple-600 text-white shadow-purple-500/20",
                },
                {
                  label: "Cycle Theme",
                  icon: Sparkles,
                  onClick: handleCycleTheme,
                  color: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20",
                },
              ].map((item, index) => {
                const ActionIcon = item.icon;
                return (
                  <motion.div
                    key={index}
                    variants={{
                      visible: { opacity: 1, x: 0, scale: 1 },
                      hidden: { opacity: 0, x: 20, scale: 0.8 },
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="flex items-center gap-2 group"
                  >
                    <span className="rounded-lg bg-zinc-900/90 px-2.5 py-1 text-[10px] font-bold text-zinc-100 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity shadow-md pointer-events-none dark:bg-zinc-800/95 dark:text-zinc-200">
                      {item.label}
                    </span>
                    <button
                      onClick={item.onClick}
                      className={`flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer ${item.color}`}
                      title={item.label}
                    >
                      <ActionIcon className={`h-4.5 w-4.5 ${item.iconClass || ""}`} />
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Trigger FAB */}
        <button
          onClick={() => setFabOpen(!fabOpen)}
          className={`relative flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-xl transition-all hover:scale-105 active:scale-95 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 cursor-pointer ${
            fabOpen ? "rotate-45" : ""
          }`}
          style={{
            boxShadow: "0 10px 25px -5px hsl(var(--primary) / 0.25), 0 8px 10px -6px hsl(var(--primary) / 0.25)",
          }}
          title="Quick Actions"
        >
          {/* Pulsing indicator */}
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
          </span>
          
          <Plus className="h-5 w-5 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
}
