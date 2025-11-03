import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

interface Prize {
  label: string;
  color: string;
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    const { prize }: { prize: Prize } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!prize?.label || !prize?.color) {
      return NextResponse.json({ error: 'Invalid prize data' }, { status: 400 });
    }

    // Fetch detailed user info from Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = {
      id: user.id,
      username: user.username || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous',
      image_url: user.imageUrl || null,
      email: user.emailAddresses[0]?.emailAddress || null,
    };

    // Check if user has already spun
    const { data: existingSpin } = await supabase
      .from('spins')
      .select('id')
      .eq('user->>id', userId)
      .maybeSingle();

    if (existingSpin) {
      return NextResponse.json({ error: 'User has already spun the wheel' }, { status: 400 });
    }

    // Save the spin with full user object
    const { data, error } = await supabase
      .from('spins')
      .insert({
        user_id: userId,
        user: userData,
        prize_label: prize.label,
        prize_color: prize.color,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving spin:', error);
      return NextResponse.json({ error: 'Failed to save spin' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      spin: data,
    });

  } catch (error) {
    console.error('Error in spin save:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
