import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ quizId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { quizId } = await context.params;
    const { points, questionId, responseIndex } = await req.json();

    if (!questionId || responseIndex === undefined) {
      return NextResponse.json(
        { error: "Missing questionId or responseIndex" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_KEY!
    );

    // 1️⃣ Fetch question data (also get correctIndex)
    const { data: questionData, error: questionError } = await supabase
      .from("questions")
      .select("id, quizId, responses, correctIndex")
      .eq("id", questionId)
      .eq("quizId", quizId)
      .single();

    if (questionError || !questionData)
      throw new Error(questionError?.message || "Question not found");

    // 2️⃣ Parse responses safely
    let responses =
      typeof questionData.responses === "string"
        ? JSON.parse(questionData.responses || "[]")
        : questionData.responses || [];

    // 3️⃣ Prevent duplicate submissions
    const alreadySubmitted = responses.some(
      (r: any) => r.userId === userId
    );
    if (alreadySubmitted) {
      return NextResponse.json(
        { error: "You have already submitted this question" },
        { status: 400 }
      );
    }

    // 4️⃣ Evaluate correctness
    const isCorrect = responseIndex === questionData.correctIndex;
    const responseStatus = isCorrect ? "correct" : "wrong";

    // 5️⃣ Add user’s response object
    const newResponse = {
      userId,
      responseIndex,
      response: responseStatus,
      submittedAt: new Date().toISOString(),
    };
    responses.push(newResponse);

    // 6️⃣ Update question’s responses
    const { error: updateQuestionError } = await supabase
      .from("questions")
      .update({ responses })
      .eq("id", questionId);

    if (updateQuestionError) throw new Error(updateQuestionError.message);

    // 7️⃣ Fetch quiz users
    const { data: quizData, error: quizError } = await supabase
      .from("quizzes")
      .select("users")
      .eq("id", quizId)
      .single();

    if (quizError || !quizData)
      throw new Error(quizError?.message || "Quiz not found");

    let users =
      typeof quizData.users === "string"
        ? JSON.parse(quizData.users || "[]")
        : quizData.users || [];

    // 8️⃣ Update user’s score only if correct
    const updatedUsers = users.map((player: any) =>
      player.userId === userId
        ? {
            ...player,
            score: (player.score || 0) + (isCorrect ? points : 0),
          }
        : player
    );

    const { error: updateQuizError } = await supabase
      .from("quizzes")
      .update({ users: updatedUsers })
      .eq("id", quizId);

    if (updateQuizError) throw new Error(updateQuizError.message);

    // ✅ Done
    return NextResponse.json({
      success: true,
      message: `Response recorded (${responseStatus}) & score updated`,
      correct: isCorrect,
    });
  } catch (err: any) {
    console.error("❌ Error:", err.message);
    return NextResponse.json(
      { error: err.message || "Failed to submit response" },
      { status: 500 }
    );
  }
}
