import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ hasSpun: false }, { status: 200 });
    }

    // Check if user has already spun
    const { data: spin, error } = await supabase
      .from('spins')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking spin:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ 
      hasSpun: !!spin,
      prize: spin ? {
        label: spin.prize_label,
        color: spin.prize_color
      } : null
    });

  } catch (error) {
    console.error('Error in spin check:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

