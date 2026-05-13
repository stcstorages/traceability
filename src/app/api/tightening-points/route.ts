import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const model_id = searchParams.get('model_id')

  if (!model_id) {
    return NextResponse.json({ error: 'model_id required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tightening_points')
    .select('*')
    .eq('model_id', model_id)
    .eq('is_active', true)
    .order('sequence_order')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}
