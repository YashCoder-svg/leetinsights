import { NextRequest, NextResponse } from "next/server";
import { getLeetCodeProfileData } from "@/services/leetcode";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "Query parameter 'username' is required." },
      { status: 400 }
    );
  }

  try {
    const data = await getLeetCodeProfileData(username);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`[API ROUTE ERROR] Failed to load user: ${username}:`, error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve LeetCode profile statistics." },
      { status: 500 }
    );
  }
}
