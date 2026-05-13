import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { LogOut, Factory } from 'lucide-react'
import LogoutButton from '@/components/LogoutButton'

export default async function OperatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect('/login')

  const allowedRoles = ['OPERATOR', 'SUPERVISOR', 'ADMIN']
  if (!allowedRoles.includes(session.roles?.name || '')) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-700 text-white px-4 py-3 flex items-center justify-between shadow">
        <div className="flex items-center gap-2">
          <Factory className="w-5 h-5" />
          <span className="font-semibold text-sm">Axle Traceability</span>
          <span className="text-blue-300 text-xs">— Operator</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-blue-100">{session.full_name}</span>
          <LogoutButton />
        </div>
      </header>
      <main className="max-w-2xl mx-auto p-4">
        {children}
      </main>
    </div>
  )
}
