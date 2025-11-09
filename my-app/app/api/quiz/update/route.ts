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

    if (!quizId || !questions || !Array.isArray(questions)) {
      return NextResponse.json(
        { error: "Missing or invalid quizId/questions" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_KEY!
    );

    // 1️⃣ Fetch quiz & verify ownership
    const { data: quiz, error: fetchError } = await supabase
      .from("quizzes")
      .select("id, created_by")
      .eq("id", quizId)
      .single();

    if (fetchError || !quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Parse created_by JSON safely
    let createdBy;
    try {
      createdBy = quiz.created_by;
    } catch {
      return NextResponse.json(
        { error: "Invalid created_by format" },
        { status: 500 }
      );
    }

    // Verify ownership
    // if (createdBy.userId !== userId) {
    //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    // }

    // 2️⃣ Prepare questions for insertion
    const formattedQuestions = questions.map((q: any) => ({
      id: q.id,
      quizId,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      image: q.image || null,
      duration: q.duration || 30,
      responses: q.responses || [],
    }));

    // 3️⃣ Upsert (insert or update existing questions)
    const { data: insertedQuestions, error: insertError } = await supabase
      .from("questions")
      .upsert(formattedQuestions, { onConflict: "id" })
      .select("id");

    if (insertError) {
      console.log("insertError", insertError)
      return NextResponse.json(
        { error: "Failed to insert questions", details: insertError.message },
        { status: 500 }
      );
    }

    // 4️⃣ Update quiz row with question IDs
    const questionIds = insertedQuestions.map((q: any) => q.id);

    const { error: updateError } = await supabase
      .from("quizzes")
      .update({ questions: JSON.stringify(questionIds) })
      .eq("id", quizId);

    if (updateError) {
        console.log("error", updateError);
      return NextResponse.json(

        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Questions synced and linked successfully",
      questionIds,
    });
  } catch (err: any) {
    console.error("❌ Error updating quiz:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
