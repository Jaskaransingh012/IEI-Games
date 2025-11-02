import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: Request,
  { params }: { params: { roomId: string } }
) {
  const { userId } = await auth(); // Get Clerk user
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { roomId } = params;

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  );

  const { data: room, error } = await supabase
    .from("quiz")
    .select("*")
    .eq("id", roomId)
    .single();

  if (error || !room)
    return NextResponse.json({ error: "Room not found" }, { status: 404 });

  return NextResponse.json({ room });
}
