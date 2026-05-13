import { NextRequest, NextResponse } from 'next/server'
import { getUserByStaffId, setSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { staff_id } = await request.json()

    if (!staff_id || typeof staff_id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid staff ID' },
        { status: 400 }
      )
    }

    const user = await getUserByStaffId(staff_id.trim().toUpperCase())

    if (!user) {
      return NextResponse.json(
        { error: 'Staff ID not found or account inactive' },
        { status: 401 }
      )
    }

    await setSession(user)

    return NextResponse.json({ success: true, user })
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}
