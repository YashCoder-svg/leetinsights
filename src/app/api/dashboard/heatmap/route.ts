import { NextRequest, NextResponse } from "next/server";
import { clientPromise } from "@/lib/mongodb";

const memoryHeatmap = new Map<string, any[]>();

// Utility to generate default activity values for display
function generateDefaultActivityLogs(username: string) {
  const list = [];
  const today = new Date();
  const days = 371; // 53 weeks

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(today.getDate() - (days - 1 - i));
    const dateStr = date.toISOString().split("T")[0];

    // Seed realistic activity distribution: mostly 0s, some 1-2s, few 3-4s
    const rand = Math.random();
    let count = 0;
    if (rand > 0.85) {
      count = 3 + Math.floor(Math.random() * 3); // 3-5
    } else if (rand > 0.6) {
      count = 1 + Math.floor(Math.random() * 2); // 1-2
    }

    list.push({
      username,
      date: dateStr,
      count,
    });
  }
  return list;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username")?.toLowerCase();
  const filter = searchParams.get("filter") || "year"; // month | year | all

  if (!username) {
    return NextResponse.json({ error: "Username query parameter is required" }, { status: 400 });
  }

  try {
    let logs: any[] = [];

    if (clientPromise) {
      const client = await clientPromise;
      const db = client.db();

      const existingCount = await db.collection("activity_logs").countDocuments({ username });
      if (existingCount === 0) {
        const seedLogs = generateDefaultActivityLogs(username);
        await db.collection("activity_logs").insertMany(seedLogs);
      }

      logs = await db.collection("activity_logs").find({ username }).toArray();
    } else {
      // Memory Fallback
      let storedLogs = memoryHeatmap.get(username);
      if (!storedLogs) {
        storedLogs = generateDefaultActivityLogs(username);
        memoryHeatmap.set(username, storedLogs);
      }
      logs = storedLogs;
    }

    // Filter logic
    const today = new Date();
    let limitDays = 371;

    if (filter === "month") {
      limitDays = 30;
    } else if (filter === "year") {
      limitDays = 365;
    } else {
      limitDays = 371; // default to full map
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(today.getDate() - limitDays);

    const filteredLogs = logs.filter((log) => {
      const logDate = new Date(log.date);
      return logDate >= cutoffDate;
    });

    // Format output mapping: date -> count
    const formattedLogs = filteredLogs.map((log) => ({
      date: log.date,
      count: log.count,
    }));

    return NextResponse.json(formattedLogs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load activity logs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const username = body.username?.toLowerCase();
    const dateStr = body.date || new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const solveCount = body.count || 1;

    if (!username) {
      return NextResponse.json({ error: "Username parameter is required" }, { status: 400 });
    }

    if (clientPromise) {
      const client = await clientPromise;
      const db = client.db();

      await db.collection("activity_logs").updateOne(
        { username, date: dateStr },
        { $inc: { count: solveCount } },
        { upsert: true }
      );
      
      return NextResponse.json({ success: true, date: dateStr, countAdded: solveCount });
    } else {
      // Memory fallback updates
      let storedLogs = memoryHeatmap.get(username);
      if (!storedLogs) {
        storedLogs = generateDefaultActivityLogs(username);
      }

      const logIndex = storedLogs.findIndex((l) => l.date === dateStr);
      if (logIndex !== -1) {
        storedLogs[logIndex].count += solveCount;
      } else {
        storedLogs.push({ username, date: dateStr, count: solveCount });
      }

      memoryHeatmap.set(username, storedLogs);
      return NextResponse.json({ success: true, date: dateStr, countAdded: solveCount });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to log activity" }, { status: 500 });
  }
}
