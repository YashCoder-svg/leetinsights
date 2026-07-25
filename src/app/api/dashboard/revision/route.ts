import { NextRequest, NextResponse } from "next/server";
import { clientPromise } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const memoryRevision = new Map<string, any[]>();

function generateDefaultNotes(username: string) {
  return [
    {
      _id: "000000000000000000000001",
      username,
      title: "LRU Cache (Medium)",
      notes: "Using a Doubly Linked List and a Hash Map to support O(1) operations.",
      approach: "Keep head as Most Recently Used (MRU) and tail as Least Recently Used (LRU). Hash Map stores key -> Node references. Move Node to head on get/put.",
      mistakes: "Forget to remove from hash map when capacity overflows and tail is deleted.",
      timeComplexity: "O(1)",
      spaceComplexity: "O(N)",
      isBookmarked: true,
      isFavorite: true,
      createdAt: new Date(),
    },
    {
      _id: "000000000000000000000002",
      username,
      title: "Kth Largest Element (Medium)",
      notes: "Using a Min-Heap of size K.",
      approach: "Maintain a Min-Heap of size K. For each element in the list, push it. If size exceeds K, pop the min. The top element is the Kth largest.",
      mistakes: "Using a Max-Heap instead of a Min-Heap, which increases sorting time to O(N log N).",
      timeComplexity: "O(N log K)",
      spaceComplexity: "O(K)",
      isBookmarked: false,
      isFavorite: true,
      createdAt: new Date(),
    },
    {
      _id: "000000000000000000000003",
      username,
      title: "Two Sum (Easy)",
      notes: "Using a Hash Map to store value-to-index mappings for single-pass O(N) lookup.",
      approach: "Iterate through elements, compute complement (target - current). Check if complement exists in Hash Map. If yes, return index pairs. Otherwise, add current element and index.",
      mistakes: "Adding the element to the map before checking, which can match the element with itself.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(N)",
      isBookmarked: true,
      isFavorite: false,
      createdAt: new Date(),
    },
    {
      _id: "000000000000000000000004",
      username,
      title: "Merge Intervals (Medium)",
      notes: "Sort intervals by start time, then merge overlapping ranges in a single pass.",
      approach: "Sort the intervals list by starting time. Initialize 'merged' list with first interval. For each subsequent interval, if its start <= end of last merged, merge them by updating end time. Otherwise, append it.",
      mistakes: "Forgetting to sort intervals first, or failing to handle intervals that touch at bounds.",
      timeComplexity: "O(N log N)",
      spaceComplexity: "O(N)",
      isBookmarked: false,
      isFavorite: false,
      createdAt: new Date(),
    },
    {
      _id: "000000000000000000000005",
      username,
      title: "Binary Tree BFS (Medium)",
      notes: "Using a Queue to traverse tree levels one-by-one (BFS).",
      approach: "Use a Queue. While queue is not empty, count elements currently in queue (level size). Pop that many elements, append their values to level list, and push child nodes.",
      mistakes: "Forgetting to record the queue size at the start of the level loop, leading to nodes from different levels mixing.",
      timeComplexity: "O(N)",
      spaceComplexity: "O(N)",
      isBookmarked: true,
      isFavorite: true,
      createdAt: new Date(),
    },
  ];
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username")?.toLowerCase();
  const search = searchParams.get("search") || "";
  const favorite = searchParams.get("favorite") === "true";
  const bookmark = searchParams.get("bookmark") === "true";

  if (!username) {
    return NextResponse.json({ error: "Username query parameter is required" }, { status: 400 });
  }

  try {
    let notesList: any[] = [];

    if (clientPromise) {
      const client = await clientPromise;
      const db = client.db();

      const existingCount = await db.collection("revision_notes").countDocuments({ username });
      if (existingCount === 0) {
        const seedNotes = generateDefaultNotes(username);
        await db.collection("revision_notes").insertMany(seedNotes as any);
      }

      // Build MongoDB query
      const query: Record<string, any> = { username };
      if (favorite) query.isFavorite = true;
      if (bookmark) query.isBookmarked = true;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { notes: { $regex: search, $options: "i" } },
          { approach: { $regex: search, $options: "i" } },
        ];
      }

      notesList = await db.collection("revision_notes").find(query).sort({ createdAt: -1 }).toArray();
    } else {
      // Memory Fallback
      let storedNotes = memoryRevision.get(username);
      if (!storedNotes) {
        storedNotes = generateDefaultNotes(username);
        memoryRevision.set(username, storedNotes);
      }

      notesList = [...storedNotes];

      // Filters
      if (favorite) notesList = notesList.filter((n) => n.isFavorite);
      if (bookmark) notesList = notesList.filter((n) => n.isBookmarked);
      if (search) {
        const q = search.toLowerCase();
        notesList = notesList.filter(
          (n) =>
            n.title.toLowerCase().includes(q) ||
            n.notes.toLowerCase().includes(q) ||
            n.approach.toLowerCase().includes(q)
        );
      }
    }

    return NextResponse.json(notesList);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load revision notes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const username = body.username?.toLowerCase();
    const action = body.action || "save";

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    if (clientPromise) {
      const client = await clientPromise;
      const db = client.db();

      if (action === "save") {
        const noteId = body._id;
        const payload = {
          username,
          title: body.title,
          notes: body.notes || "",
          approach: body.approach || "",
          mistakes: body.mistakes || "",
          timeComplexity: body.timeComplexity || "O(N)",
          spaceComplexity: body.spaceComplexity || "O(1)",
          isBookmarked: !!body.isBookmarked,
          isFavorite: !!body.isFavorite,
          createdAt: new Date(),
        };

        if (noteId) {
          await db.collection("revision_notes").updateOne(
            { _id: new ObjectId(noteId) },
            { $set: payload }
          );
          return NextResponse.json({ ...payload, _id: noteId });
        } else {
          const res = await db.collection("revision_notes").insertOne(payload);
          return NextResponse.json({ ...payload, _id: res.insertedId });
        }
      }

      if (action === "toggle_favorite") {
        const { noteId, isFavorite } = body;
        await db.collection("revision_notes").updateOne(
          { _id: new ObjectId(noteId) },
          { $set: { isFavorite } }
        );
        return NextResponse.json({ success: true });
      }

      if (action === "toggle_bookmark") {
        const { noteId, isBookmarked } = body;
        await db.collection("revision_notes").updateOne(
          { _id: new ObjectId(noteId) },
          { $set: { isBookmarked } }
        );
        return NextResponse.json({ success: true });
      }

      if (action === "delete") {
        const { noteId } = body;
        await db.collection("revision_notes").deleteOne({ _id: new ObjectId(noteId) });
        return NextResponse.json({ success: true });
      }
    } else {
      // Memory Fallback Operations
      let storedNotes = memoryRevision.get(username) || [];

      if (action === "save") {
        const noteId = body._id;
        const payload = {
          _id: noteId || `mem_note_${Date.now()}`,
          username,
          title: body.title,
          notes: body.notes || "",
          approach: body.approach || "",
          mistakes: body.mistakes || "",
          timeComplexity: body.timeComplexity || "O(N)",
          spaceComplexity: body.spaceComplexity || "O(1)",
          isBookmarked: !!body.isBookmarked,
          isFavorite: !!body.isFavorite,
          createdAt: new Date(),
        };

        if (noteId) {
          storedNotes = storedNotes.map((n) => (n._id === noteId ? payload : n));
        } else {
          storedNotes.push(payload);
        }

        memoryRevision.set(username, storedNotes);
        return NextResponse.json(payload);
      }

      if (action === "toggle_favorite") {
        const { noteId, isFavorite } = body;
        storedNotes = storedNotes.map((n) => (n._id === noteId ? { ...n, isFavorite } : n));
        memoryRevision.set(username, storedNotes);
        return NextResponse.json({ success: true });
      }

      if (action === "toggle_bookmark") {
        const { noteId, isBookmarked } = body;
        storedNotes = storedNotes.map((n) => (n._id === noteId ? { ...n, isBookmarked } : n));
        memoryRevision.set(username, storedNotes);
        return NextResponse.json({ success: true });
      }

      if (action === "delete") {
        const { noteId } = body;
        storedNotes = storedNotes.filter((n) => n._id !== noteId);
        memoryRevision.set(username, storedNotes);
        return NextResponse.json({ success: true });
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process revision action" }, { status: 500 });
  }
}
