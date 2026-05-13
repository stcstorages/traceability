'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    toast.success('Logged out successfully')
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1 text-blue-200 hover:text-white text-sm transition-colors"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </button>
  )
}
