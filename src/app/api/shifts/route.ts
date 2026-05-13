import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const line_id = searchParams.get('line_id')

  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  let query = supabase
    .from('shifts')
    .select('*, production_lines(*)')
    .eq('shift_date', today)
    .eq('status', 'OPEN')

  if (line_id) query = query.eq('line_id', line_id)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { line_id, shift_code } = await request.json()
  if (!line_id || !shift_code) {
    return NextResponse.json({ error: 'line_id and shift_code required' }, { status: 400 })
  }

  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data: existing } = await supabase
    .from('shifts')
    .select('id')
    .eq('line_id', line_id)
    .eq('shift_date', today)
    .eq('shift_code', shift_code)
    .single()

  if (existing) {
    const { data, error } = await supabase
      .from('shifts')
      .select('*, production_lines(*)')
      .eq('id', existing.id)
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data })
  }

  const { data, error } = await supabase
    .from('shifts')
    .insert({
      line_id,
      shift_date: today,
      shift_code,
      started_at: new Date().toISOString(),
      status: 'OPEN',
    })
    .select('*, production_lines(*)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
