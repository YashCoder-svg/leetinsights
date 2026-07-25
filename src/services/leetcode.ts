import { clientPromise } from "@/lib/mongodb";

// LeetCode GraphQL Endpoint
const LEETCODE_GQL_URL = "https://leetcode.com/graphql";

// Simple in-memory fallback cache to use if MongoDB is not configured
const inMemoryCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 Hours

// Queries definition
const PROFILE_QUERY = `
  query userProblemsSolved($username: String!) {
    allQuestionsCount {
      difficulty
      count
    }
    matchedUser(username: $username) {
      profile {
        realName
        userAvatar
        ranking
      }
      submitStats {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
        totalSubmissionNum {
          difficulty
          count
          submissions
        }
      }
    }
  }
`;

const CONTEST_QUERY = `
  query userContestRankingInfo($username: String!) {
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
      totalParticipants
      topPercentage
    }
    userContestRankingHistory(username: $username) {
      attended
      rating
      ranking
      contest {
        title
        startTime
      }
    }
  }
`;

const RECENT_SUB_QUERY = `
  query userRecentSubmissions($username: String!, $limit: Int!) {
    recentSubmissionList(username: $username, limit: $limit) {
      title
      titleSlug
      timestamp
      statusDisplay
      lang
    }
  }
`;

async function fetchFromLeetCodeAPI(query: string, variables: Record<string, any>) {
  const response = await fetch(LEETCODE_GQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  if (result.errors) {
    throw new Error(result.errors[0]?.message || "GraphQL query error");
  }

  return result.data;
}

export interface LeetCodeProfileData {
  username: string;
  realName: string | null;
  avatar: string | null;
  ranking: number | null;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalSolved: number;
  acceptanceRate: number;
  contestRating: number | null;
  contestGlobalRank: number | null;
  contestHistory: any[];
  recentSubmissions: any[];
  updatedAt: string;
}

export async function getLeetCodeProfileData(username: string): Promise<LeetCodeProfileData> {
  const formattedUsername = username.trim();
  
  // 1. Try checking Cache
  const cachedData = await getCache(formattedUsername);
  if (cachedData) {
    const isStale = new Date().getTime() - new Date(cachedData.updatedAt).getTime() > CACHE_TTL_MS;
    if (!isStale) {
      console.log(`[CACHE] Returning fresh cached data for: ${formattedUsername}`);
      return cachedData;
    }
    console.log(`[CACHE] Stale cache found for: ${formattedUsername}. Fetching fresh...`);
  }

  // 2. Fetch fresh data from LeetCode
  try {
    console.log(`[LEETCODE API] Requesting statistics for: ${formattedUsername}`);
    const [profileRes, contestRes, recentRes] = await Promise.all([
      fetchFromLeetCodeAPI(PROFILE_QUERY, { username: formattedUsername }),
      fetchFromLeetCodeAPI(CONTEST_QUERY, { username: formattedUsername }),
      fetchFromLeetCodeAPI(RECENT_SUB_QUERY, { username: formattedUsername, limit: 12 }),
    ]);

    const matchedUser = profileRes?.matchedUser;
    if (!matchedUser) {
      throw new Error(`User "${formattedUsername}" not found on LeetCode.`);
    }

    // Process Solved difficulty metrics
    const acStats = matchedUser.submitStats?.acSubmissionNum || [];
    const totalStats = matchedUser.submitStats?.totalSubmissionNum || [];

    const easySolved = acStats.find((s: any) => s.difficulty === "Easy")?.count || 0;
    const mediumSolved = acStats.find((s: any) => s.difficulty === "Medium")?.count || 0;
    const hardSolved = acStats.find((s: any) => s.difficulty === "Hard")?.count || 0;
    const totalSolved = acStats.find((s: any) => s.difficulty === "All")?.count || 0;

    // Calculate Acceptance Rate
    const totalAcceptedSubmissions = acStats.find((s: any) => s.difficulty === "All")?.submissions || 0;
    const totalSubmissions = totalStats.find((s: any) => s.difficulty === "All")?.submissions || 0;
    const acceptanceRate = totalSubmissions > 0 
      ? Math.round((totalAcceptedSubmissions / totalSubmissions) * 10000) / 100 
      : 0;

    // Process Contest Ranking info
    const contestRating = contestRes?.userContestRanking?.rating 
      ? Math.round(contestRes.userContestRanking.rating) 
      : null;
    const contestGlobalRank = contestRes?.userContestRanking?.globalRanking || null;
    
    // Sort and filter active contest histories
    const contestHistory = (contestRes?.userContestRankingHistory || [])
      .filter((h: any) => h.attended)
      .map((h: any) => ({
        contestTitle: h.contest?.title || "Contest",
        rating: Math.round(h.rating),
        ranking: h.ranking,
        date: new Date((h.contest?.startTime || 0) * 1000).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        })
      }));

    // Process Recent submissions
    const recentSubmissions = (recentRes?.recentSubmissionList || []).map((sub: any) => ({
      title: sub.title,
      difficulty: "Medium", // placeholder as default submissions API doesn't specify difficulty
      time: formatTimestamp(sub.timestamp),
      lang: sub.lang,
      status: sub.statusDisplay,
    }));

    const resultPayload: LeetCodeProfileData = {
      username: formattedUsername,
      realName: matchedUser.profile?.realName || null,
      avatar: matchedUser.profile?.userAvatar || null,
      ranking: matchedUser.profile?.ranking || null,
      easySolved,
      mediumSolved,
      hardSolved,
      totalSolved,
      acceptanceRate,
      contestRating,
      contestGlobalRank,
      contestHistory,
      recentSubmissions,
      updatedAt: new Date().toISOString(),
    };

    // 3. Save to Cache
    await setCache(formattedUsername, resultPayload);
    return resultPayload;

  } catch (error: any) {
    console.error(`[LEETCODE API ERROR] Failed for: ${formattedUsername}.`, error);

    // 4. Stale-While-Revalidate fallback: Return cache on API error if available
    if (cachedData) {
      console.warn(`[LEETCODE API] Returning stale cache fallback due to error for: ${formattedUsername}`);
      return cachedData;
    }

    throw error;
  }
}

// Cache helper functions
async function getCache(username: string): Promise<LeetCodeProfileData | null> {
  const key = username.toLowerCase();
  
  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db();
      const document = await db.collection("leetcode_cache").findOne({ username: key });
      return document ? (document as unknown as LeetCodeProfileData) : null;
    } catch (error) {
      console.error("[DATABASE CACHE READ ERROR] Failed: ", error);
    }
  }

  // Fallback memory cache
  const inMemory = inMemoryCache.get(key);
  if (inMemory) {
    return inMemory.data;
  }

  return null;
}

async function setCache(username: string, data: LeetCodeProfileData): Promise<void> {
  const key = username.toLowerCase();
  
  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db();
      await db.collection("leetcode_cache").updateOne(
        { username: key },
        { $set: { ...data, username: key } },
        { upsert: true }
      );
      console.log(`[DATABASE CACHE WRITE] Cached username: ${key}`);
      return;
    } catch (error) {
      console.error("[DATABASE CACHE WRITE ERROR] Failed: ", error);
    }
  }

  // Fallback memory cache write
  inMemoryCache.set(key, { data, timestamp: Date.now() });
  console.log(`[MEMORY CACHE WRITE] Cached username: ${key}`);
}

// Relative timestamp formatter
function formatTimestamp(timestampStr: string): string {
  const timestamp = parseInt(timestampStr, 10) * 1000;
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}
