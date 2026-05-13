import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const line_id = searchParams.get('line_id')

  const supabase = await createClient()

  let query = supabase
    .from('axle_models')
    .select('*, production_lines(*)')
    .eq('is_active', true)
    .order('model_code')

  if (line_id) query = query.eq('line_id', line_id)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
