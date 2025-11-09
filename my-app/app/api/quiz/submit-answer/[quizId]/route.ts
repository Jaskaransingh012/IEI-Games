import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(req: Request,   context: { params: Promise<{ quizId: string }> }) {

    try {
        const { userId } = await auth();

        if (!userId)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { quizId } = await context.params;

        const { points } = await req.json();

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_KEY!
        );
        


        const { data: quizData, error: fetchError } = await supabase
            .from("quizzes")
            .select("users") // your column name here
            .eq("id", quizId)
            .single();

        if (fetchError || !quizData)
            throw new Error(fetchError?.message || "Quiz not found");

        console.log("before",quizData.users);
        const updatedPlayers = quizData.users.map((player: any) => {
            if (player.userId === userId) {
                console.log(player.score);
                console.log("points", points);
                return { ...player, score: player.score + points };
            }
            return player;
        });
        console.log("after",updatedPlayers);

        const { error: updateError } = await supabase
            .from("quizzes")
            .update({ users: updatedPlayers })
            .eq("id", quizId);


        if (updateError) throw new Error(updateError.message);

        return NextResponse.json({ success: true, message: "Score updated successfully" });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: "Failed to update score" }, { status: 500 });
    }

}