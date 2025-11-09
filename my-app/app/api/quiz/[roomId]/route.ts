import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ roomId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { roomId } = await context.params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  );

  // Step 1: Fetch the quiz
  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select("*")
    .eq("id", roomId)
    .single();

  if (quizError || !quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  // Step 2: Fetch all questions belonging to this quiz
  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("*")
    .eq("quizId", roomId);

  if (questionsError) {
    console.log("question error", questionsError);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }

  // Step 3: Merge quiz + questions (same old format)
  const room = {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    created_by: quiz.created_by,
    created_at: quiz.created_at,
    users:quiz.users,
    questions: questions.map((q) => ({
      id: q.id,
      image: q.image,
      options: q.options,
      duration: q.duration,
      question: q.question,
      correctIndex: q.correctIndex,
    })),
  };

  return NextResponse.json({ room });
}
