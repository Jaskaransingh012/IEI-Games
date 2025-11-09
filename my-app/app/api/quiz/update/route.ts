import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { quizId, questions } = await req.json();

    if (!quizId || !questions) {
      return NextResponse.json({ error: "Missing roomId or questions" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_KEY!
    );

    // Check ownership of the quiz before allowing update
    const { data: quiz, error: fetchError } = await supabase
      .from("quizzes")
      .select("id, created_by")
      .eq("id", quizId)
      .single();
    
    console.log(quiz);

    if (fetchError || !quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    if (quiz.created_by.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { error: updateError } = await supabase
      .from("quizzes")
      .update({ questions })
      .eq("id", quizId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Questions updated successfully" });
  } catch (err: any) {
    console.error("Error updating quiz:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
