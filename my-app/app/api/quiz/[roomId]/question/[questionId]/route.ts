import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ roomId: string; questionId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { roomId:quizId, questionId } = await context.params;

    if (!quizId || !questionId) {
      return NextResponse.json(
        { error: "Missing quizId or questionId" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_KEY!
    );

    // 1️⃣ Fetch the question
    const { data: questionData, error } = await supabase
      .from("questions")
      .select("*")
      .eq("id", questionId)
      .eq("quizId", quizId)
      .single();

    if (error || !questionData)
      throw new Error(error?.message || "Question not found");

    // 2️⃣ Parse responses safely
    const responses =
      typeof questionData.responses === "string"
        ? JSON.parse(questionData.responses || "[]")
        : questionData.responses || [];

    // 3️⃣ Prepare response
    const question = {
      id: questionData.id,
      quizId: questionData.quizId,
      title: questionData.title,
      image: questionData.image,
      options: questionData.options,
      duration: questionData.duration,
      correctIndex: questionData.correctIndex, // include this if you need admin check
      responses, // 👈 main thing you wanted
    };

    return NextResponse.json({ success: true, question });
  } catch (err: any) {
    console.error("❌ Error fetching question:", err.message);
    return NextResponse.json(
      { error: err.message || "Failed to fetch question" },
      { status: 500 }
    );
  }
}
