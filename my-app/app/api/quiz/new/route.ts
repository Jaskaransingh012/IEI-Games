import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  );

  const { title, description, created_by: user, password } = await req.json();

  if (!title || !description || !user || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { image, userId: userUserId, username: userUsername } = user;

  const { data: quiz, error } = await supabase
    .from("quizzes")
    .insert({ title, description, created_by: { image, userId: userUserId, username: userUsername },password })
    .select("id, title, description, created_by, created_at")
    .single();

  if (error || !quiz) {
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 404 });
  }

  return NextResponse.json({ quiz });
}
