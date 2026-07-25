import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username") || "gupta-codes";

  // Detailed mock GitHub profile statistics for display
  const mockProfile = {
    user: {
      username: username,
      name: "Vansh Gupta",
      bio: "Full Stack Engineer & Algorithm Enthusiast | Developer of LeetInsight",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80",
      followers: 142,
      following: 89,
      publicRepos: 24,
      starsCount: 88,
      forksCount: 22,
    },
    pinnedRepos: [
      { name: "LeetInsight", description: "AI-powered analytics and preparation tracker dashboard for LeetCode developers.", stars: 45, forks: 8, language: "TypeScript" },
      { name: "dsa-in-typescript", description: "Clean implementations and complexity notes for 100+ standard algorithms.", stars: 28, forks: 10, language: "TypeScript" },
      { name: "react-turbopack-starter", description: "Modern React template compiling with Turbopack developer tool suites.", stars: 15, forks: 4, language: "JavaScript" }
    ],
    repos: [
      { name: "LeetInsight", description: "AI-powered analytics and preparation tracker dashboard for LeetCode developers.", stars: 45, forks: 8, language: "TypeScript", url: "https://github.com/gupta-codes/LeetInsight" },
      { name: "dsa-in-typescript", description: "Clean implementations and complexity notes for 100+ standard algorithms.", stars: 28, forks: 10, language: "TypeScript", url: "https://github.com/gupta-codes/dsa-in-typescript" },
      { name: "react-turbopack-starter", description: "Modern React template compiling with Turbopack developer tool suites.", stars: 15, forks: 4, language: "JavaScript", url: "https://github.com/gupta-codes/react-turbopack-starter" },
      { name: "mongodb-pooling", description: "MongoClient global promise pooling for high-performance Next.js HMR reloads.", stars: 8, forks: 2, language: "TypeScript", url: "https://github.com/gupta-codes/mongodb-pooling" },
      { name: "recharts-custom-themes", description: "Clean responsive custom theme layers for dashboard chart blocks.", stars: 5, forks: 1, language: "CSS", url: "https://github.com/gupta-codes/recharts-custom-themes" }
    ],
    languages: [
      { name: "TypeScript", percent: 68, color: "#3178c6" },
      { name: "JavaScript", percent: 22, color: "#f1e05a" },
      { name: "CSS", percent: 8, color: "#563d7c" },
      { name: "HTML", percent: 2, color: "#e34c26" }
    ],
    recentActivity: [
      { type: "Commit", repo: "LeetInsight", detail: "Committed 'Implement MongoDB goals caching schema' to main", time: "2 hours ago" },
      { type: "Branch", repo: "LeetInsight", detail: "Created branch 'feature/ai-coach-integration'", time: "1 day ago" },
      { type: "Star", repo: "recharts/recharts", detail: "Starred recharts/recharts repository", time: "3 days ago" },
      { type: "Commit", repo: "dsa-in-typescript", detail: "Committed 'Refactored DoublyLinkedList swap implementation'", time: "5 days ago" }
    ],
    contributionWeeks: Array.from({ length: 53 }, (_, wIndex) => 
      Array.from({ length: 7 }, (_, dIndex) => {
        const rand = Math.random();
        let level = 0;
        if (rand > 0.9) level = 4;
        else if (rand > 0.75) level = 3;
        else if (rand > 0.5) level = 2;
        else if (rand > 0.3) level = 1;
        return { level };
      })
    )
  };

  return NextResponse.json(mockProfile);
}
