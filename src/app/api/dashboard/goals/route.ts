import { NextRequest, NextResponse } from "next/server";
import { clientPromise } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Fallback in-memory database if MongoDB is not connected
const memoryProgress = new Map<string, any>();
const memoryGoals = new Map<string, any[]>();

function generateDefaultGoals(username: string) {
  return [
    {
      username,
      text: "Solve 5 array hashing LeetCode questions",
      completed: false,
      xpReward: 25,
      createdAt: new Date(),
    },
    {
      username,
      text: "Master Binary Tree BFS level order traversals",
      completed: false,
      xpReward: 50,
      createdAt: new Date(),
    },
    {
      username,
      text: "Draft complexity revision note for LRU Cache",
      completed: true,
      xpReward: 30,
      createdAt: new Date(),
    },
  ];
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username")?.toLowerCase();

  if (!username) {
    return NextResponse.json({ error: "Username query parameter is required" }, { status: 400 });
  }

  try {
    if (clientPromise) {
      const client = await clientPromise;
      const db = client.db();

      // Retrieve User Progress
      let progress: any = await db.collection("user_progress").findOne({ username });
      if (!progress) {
        progress = {
          username,
          xp: 0,
          level: 1,
          streak: 0,
          lastActiveDate: null,
          badges: ["Welcome Coder"],
        };
        await db.collection("user_progress").insertOne(progress);
      }

      // Retrieve User Goals
      let goals = await db.collection("goals").find({ username }).toArray();
      if (goals.length === 0) {
        const seedGoals = generateDefaultGoals(username);
        await db.collection("goals").insertMany(seedGoals as any);
        goals = await db.collection("goals").find({ username }).toArray();
      }

      return NextResponse.json({ progress, goals });
    } else {
      // Memory Fallback
      let progress = memoryProgress.get(username);
      if (!progress) {
        progress = {
          username,
          xp: 0,
          level: 1,
          streak: 0,
          lastActiveDate: null,
          badges: ["Welcome Coder"],
        };
        memoryProgress.set(username, progress);
      }

      let goals = memoryGoals.get(username);
      if (!goals || goals.length === 0) {
        goals = generateDefaultGoals(username).map((g, idx) => ({
          ...g,
          _id: `mem_goal_${Date.now()}_${idx}`,
        }));
        memoryGoals.set(username, goals);
      }
      return NextResponse.json({ progress, goals });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load goals" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const username = body.username?.toLowerCase();
    const action = body.action;

    if (!username || !action) {
      return NextResponse.json({ error: "Username and action parameter are required" }, { status: 400 });
    }

    if (clientPromise) {
      const client = await clientPromise;
      const db = client.db();

      if (action === "create") {
        const newGoal = {
          username,
          text: body.text,
          completed: false,
          xpReward: body.xpReward || 25,
          createdAt: new Date(),
        };
        const res = await db.collection("goals").insertOne(newGoal);
        return NextResponse.json({ ...newGoal, _id: res.insertedId });
      }

      if (action === "complete") {
        const goalId = body.goalId;
        if (!goalId) {
          return NextResponse.json({ error: "goalId is required" }, { status: 400 });
        }

        // Find the goal and mark completed
        const goal = await db.collection("goals").findOne({ _id: new ObjectId(goalId) });
        if (!goal) {
          return NextResponse.json({ error: "Goal not found" }, { status: 404 });
        }
        if (goal.completed) {
          return NextResponse.json({ error: "Goal already completed" }, { status: 400 });
        }

        await db.collection("goals").updateOne({ _id: new ObjectId(goalId) }, { $set: { completed: true } });

        // Update User Progress
        let progress: any = await db.collection("user_progress").findOne({ username });
        if (!progress) {
          progress = { username, xp: 0, level: 1, streak: 0, lastActiveDate: null, badges: ["Welcome Coder"] };
        }

        const xpGained = goal.xpReward || 25;
        let newXp = (progress.xp || 0) + xpGained;
        let newLevel = progress.level || 1;
        const newBadges = [...(progress.badges || ["Welcome Coder"])];

        // XP Level progression threshold: level * 100
        const xpRequiredForNextLevel = newLevel * 100;
        if (newXp >= xpRequiredForNextLevel) {
          newXp -= xpRequiredForNextLevel;
          newLevel += 1;
          newBadges.push(`Level ${newLevel} Achiever`);
        }

        // Streak updates
        const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        let newStreak = progress.streak || 0;

        if (progress.lastActiveDate) {
          const lastActive = new Date(progress.lastActiveDate);
          const today = new Date(todayStr);
          const diffTime = Math.abs(today.getTime() - lastActive.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            newStreak += 1;
          } else if (diffDays > 1) {
            newStreak = 1;
          }
        } else {
          newStreak = 1;
        }

        if (newStreak >= 7 && !newBadges.includes("Streak Master")) {
          newBadges.push("Streak Master");
        }
        if (newLevel >= 5 && !newBadges.includes("Apprentice Coder")) {
          newBadges.push("Apprentice Coder");
        }

        const updatedProgress = {
          ...progress,
          xp: newXp,
          level: newLevel,
          streak: newStreak,
          lastActiveDate: todayStr,
          badges: Array.from(new Set(newBadges)), // unique badges
        };

        await db.collection("user_progress").updateOne(
          { username },
          { $set: updatedProgress },
          { upsert: true }
        );

        return NextResponse.json({ success: true, progress: updatedProgress });
      }

      if (action === "update_progress") {
        const progressVal = body.progress;
        if (!progressVal) {
          return NextResponse.json({ error: "progress is required" }, { status: 400 });
        }
        await db.collection("user_progress").updateOne(
          { username },
          { $set: progressVal },
          { upsert: true }
        );
        return NextResponse.json({ success: true, progress: progressVal });
      }

      if (action === "delete") {
        const goalId = body.goalId;
        if (!goalId) {
          return NextResponse.json({ error: "goalId is required" }, { status: 400 });
        }
        await db.collection("goals").deleteOne({ _id: new ObjectId(goalId) });
        return NextResponse.json({ success: true });
      }
    } else {
      // Memory Fallback Operations
      const userGoals = memoryGoals.get(username) || [];

      if (action === "create") {
        const newGoal = {
          _id: `mem_${Date.now()}`,
          username,
          text: body.text,
          completed: false,
          xpReward: body.xpReward || 25,
          createdAt: new Date(),
        };
        userGoals.push(newGoal);
        memoryGoals.set(username, userGoals);
        return NextResponse.json(newGoal);
      }

      if (action === "complete") {
        const goalId = body.goalId;
        const goalIndex = userGoals.findIndex((g) => g._id === goalId);

        if (goalIndex === -1) {
          return NextResponse.json({ error: "Goal not found" }, { status: 404 });
        }
        if (userGoals[goalIndex].completed) {
          return NextResponse.json({ error: "Goal already completed" }, { status: 400 });
        }

        userGoals[goalIndex].completed = true;
        memoryGoals.set(username, userGoals);

        let progress = memoryProgress.get(username) || {
          username,
          xp: 0,
          level: 1,
          streak: 0,
          lastActiveDate: null,
          badges: ["Welcome Coder"],
        };

        const xpGained = userGoals[goalIndex].xpReward || 25;
        let newXp = (progress.xp || 0) + xpGained;
        let newLevel = progress.level || 1;
        const newBadges = [...(progress.badges || ["Welcome Coder"])];

        const xpRequired = newLevel * 100;
        if (newXp >= xpRequired) {
          newXp -= xpRequired;
          newLevel += 1;
          newBadges.push(`Level ${newLevel} Achiever`);
        }

        const todayStr = new Date().toISOString().split("T")[0];
        let newStreak = progress.streak || 0;

        if (progress.lastActiveDate) {
          const lastActive = new Date(progress.lastActiveDate);
          const today = new Date(todayStr);
          const diffTime = Math.abs(today.getTime() - lastActive.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 1) {
            newStreak += 1;
          } else if (diffDays > 1) {
            newStreak = 1;
          }
        } else {
          newStreak = 1;
        }

        if (newStreak >= 7 && !newBadges.includes("Streak Master")) {
          newBadges.push("Streak Master");
        }
        if (newLevel >= 5 && !newBadges.includes("Apprentice Coder")) {
          newBadges.push("Apprentice Coder");
        }

        const updatedProgress = {
          ...progress,
          xp: newXp,
          level: newLevel,
          streak: newStreak,
          lastActiveDate: todayStr,
          badges: Array.from(new Set(newBadges)),
        };

        memoryProgress.set(username, updatedProgress);
        return NextResponse.json({ success: true, progress: updatedProgress });
      }

      if (action === "update_progress") {
        const progressVal = body.progress;
        if (!progressVal) {
          return NextResponse.json({ error: "progress is required" }, { status: 400 });
        }
        memoryProgress.set(username, progressVal);
        return NextResponse.json({ success: true, progress: progressVal });
      }

      if (action === "delete") {
        const goalId = body.goalId;
        const updated = userGoals.filter((g) => g._id !== goalId);
        memoryGoals.set(username, updated);
        return NextResponse.json({ success: true });
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process goal action" }, { status: 500 });
  }
}
