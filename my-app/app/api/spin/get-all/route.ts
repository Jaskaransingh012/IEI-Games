import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from('spins')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch spins' }, { status: 500 });
  }

  return NextResponse.json({ spins: data });
}
