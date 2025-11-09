import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth(); // get current Clerk user
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { roomId, password } = await req.json();

    if (!roomId || !password)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_KEY!
    );

    // Step 1: Find the room
    const { data: room, error } = await supabase
      .from("quizzes")
      .select("*")
      .eq("id", roomId)
      .single();

    if (error || !room)
      return NextResponse.json({ error: "Room not found" }, { status: 404 });

    // Step 2: Check password
    if (room.password !== password)
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });

    // Step 3: Get user details from Clerk
    const user = await currentUser();
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const userObj = {
      userId,
      username: user.username || user.firstName || "Anonymous",
      image: user.imageUrl || "",
      score: 0,
    };

    // Step 4: Check if user already joined
    const users: any[] = room.users || [];
    const alreadyJoined = users.some((u) => u.userId === userId);


    if (alreadyJoined) {
      return NextResponse.json({ message: "Already joined", room });
    }

    // Step 5: Push user object into users array
    const updatedUsers = [...users, userObj];

    const { error: updateError } = await supabase
      .from("quizzes")
      .update({ users: updatedUsers })
      .eq("id", roomId);

    if (updateError)
      return NextResponse.json(
        { error: updateError.message },
        { status: 400 }
      );

    const accessToken = Math.random().toString(36).substring(2);

    return NextResponse.json({
      message: "Joined successfully",
      room: { ...room, users: updatedUsers },
      accessToken
    });
  } catch (err: any) {
    console.error("Error joining room:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


