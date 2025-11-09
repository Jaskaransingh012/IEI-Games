import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: Request
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  );

  const { data: quizzes, error } = await supabase
    .from("quizzes")
    .select("id, title, description, created_by, created_at")
    .order("created_at", { ascending: false });

  if (error || !quizzes) {
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 404 });
  }

  return NextResponse.json({ quizzes });

}