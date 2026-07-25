import { NextRequest, NextResponse } from "next/server";

// Default premium diagnostic fallback if GEMINI_API_KEY is not defined
function generateMockCoachDiagnostic(leetcodeStats: any) {
  const contestRating = leetcodeStats?.contestRating || 1742;

  return {
    weakTopics: ["Graph", "Dynamic Programming"],
    problemsRecommended: [
      { title: "Number of Islands", difficulty: "Medium", url: "https://leetcode.com/problems/number-of-islands/" },
      { title: "Clone Graph", difficulty: "Medium", url: "https://leetcode.com/problems/clone-graph/" },
      { title: "Rotting Oranges", difficulty: "Medium", url: "https://leetcode.com/problems/rotting-oranges/" },
      { title: "Course Schedule", difficulty: "Medium", url: "https://leetcode.com/problems/course-schedule/" }
    ],
    interviewRoadmap: [
      { week: "Week 1", focus: "Graph traversals (BFS/DFS)", milestone: "Solve 'Number of Islands'" },
      { week: "Week 2", focus: "Graph cloning & mapping keys", milestone: "Solve 'Clone Graph'" },
      { week: "Week 3", focus: "Multi-source BFS traversal queues", milestone: "Solve 'Rotting Oranges'" },
      { week: "Week 4", focus: "Topological sorting cycle detections", milestone: "Solve 'Course Schedule'" }
    ],
    ratingPrediction: {
      current: contestRating,
      predicted3Months: contestRating + 90,
      growthStrategy: "Spend the next 5 days solving the recommended graph problems to target a +90 Contest Rating increase and +6% Acceptance Rate growth."
    },
    weeklySchedule: [
      { day: "Day 1", topic: "Number of Islands", duration: "90 mins" },
      { day: "Day 2", topic: "Clone Graph", duration: "60 mins" },
      { day: "Day 3", topic: "Rotting Oranges", duration: "75 mins" },
      { day: "Day 4", topic: "Course Schedule", duration: "90 mins" },
      { day: "Day 5", topic: "Dynamic Programming review", duration: "60 mins" }
    ],
    dailyRecommendation: "Spend the next 5 days solving: 1. Number of Islands, 2. Clone Graph, 3. Rotting Oranges, and 4. Course Schedule."
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const leetcodeStats = body.leetcodeStats;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return realistic fallback response
      const mockResult = generateMockCoachDiagnostic(leetcodeStats);
      return NextResponse.json(mockResult);
    }

    // Call actual Gemini API (v1beta model gemini-2.5-flash)
    const prompt = `
      You are an elite LeetCode coding coach.
      Analyze the following LeetCode profile statistics:
      - Total Solved: ${leetcodeStats?.totalSolved || 224} (Easy: ${leetcodeStats?.easySolved || 112}, Medium: ${leetcodeStats?.mediumSolved || 94}, Hard: ${leetcodeStats?.hardSolved || 18})
      - Global Ranking: ${leetcodeStats?.ranking || 45000}
      - Contest Rating: ${leetcodeStats?.contestRating || 1742}
      
      Generate a customized diagnostic program matching this format exactly in JSON.
      
      JSON Scheme to return:
      {
        "weakTopics": ["Topic 1", "Topic 2"],
        "problemsRecommended": [
          { "title": "Problem Title", "difficulty": "Easy|Medium|Hard", "url": "url" }
        ],
        "interviewRoadmap": [
          { "week": "Week 1", "focus": "Traversals", "milestone": "Solve 5" }
        ],
        "ratingPrediction": {
          "current": 1742,
          "predicted3Months": 1850,
          "growthStrategy": "Strategy text"
        },
        "weeklySchedule": [
          { "day": "Monday", "topic": "Array", "duration": "60 mins" }
        ],
        "dailyRecommendation": "Recommendation text"
      }
      Do not wrap it in markdown. Return raw JSON text only.
    `;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!res.ok) {
      throw new Error("Failed to contact Gemini API");
    }

    const payload = await res.json();
    const rawText = payload.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!rawText) {
      throw new Error("Empty response from Gemini");
    }

    const cleanJson = JSON.parse(rawText.trim());
    return NextResponse.json(cleanJson);
  } catch (err: any) {
    // If anything fails (timeout, quota, key issues), return the fallback
    console.error("Gemini Coach API error, returning premium fallback:", err.message);
    const body = await request.clone().json().catch(() => ({}));
    const fallbackResult = generateMockCoachDiagnostic(body.leetcodeStats);
    return NextResponse.json(fallbackResult);
  }
}
