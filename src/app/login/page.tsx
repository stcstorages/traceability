'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { ScanLine, Shield } from 'lucide-react'

export default function LoginPage() {
  const [staffId, setStaffId] = useState('')
  const [loading, setLoading] = useState(false)
  const [scanMode, setScanMode] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [])

  async function handleLogin(id: string) {
    if (!id.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staff_id: id.trim().toUpperCase() }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Login failed')
        setStaffId('')
        inputRef.current?.focus()
        return
      }
      toast.success(`Welcome, ${data.user.full_name}!`)
      router.push('/')
      router.refresh()
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleLogin(staffId)
  }

  function handleScanInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setStaffId(val)
    if (scanMode && val.length >= 6) {
      setTimeout(() => handleLogin(val), 100)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
            <Shield className="w-8 h-8 text-blue-700" />
          </div>
          <h1 className="text-2xl font-bold text-white">Axle Assembly</h1>
          <p className="text-blue-200 text-sm mt-1">Traceability System</p>
        </div>

        <div className="card">
          <div className="text-center mb-6">
            <ScanLine className="w-10 h-10 text-blue-600 mx-auto mb-2" />
            <h2 className="text-lg font-semibold text-gray-800">Scan your staff badge</h2>
            <p className="text-gray-500 text-sm mt-1">
              Point your QR scanner at your staff ID badge
            </p>
          </div>

          <div className="space-y-4">
            <input
              ref={inputRef}
              type="text"
              value={staffId}
              onChange={handleScanInput}
              onKeyDown={handleKeyDown}
              placeholder="Staff ID will appear here..."
              className="input-field text-center text-lg tracking-widest font-mono"
              disabled={loading}
              autoComplete="off"
            />

            <button
              onClick={() => handleLogin(staffId)}
              disabled={loading || !staffId.trim()}
              className="btn-primary w-full py-3 text-base"
            >
              {loading ? 'Verifying...' : 'Login'}
            </button>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
              <input
                type="checkbox"
                checked={scanMode}
                onChange={e => setScanMode(e.target.checked)}
                className="rounded"
              />
              Auto-login on scan
            </label>
          </div>
        </div>

        <div className="mt-6 card bg-blue-800 border-blue-700">
          <p className="text-blue-200 text-xs text-center font-medium mb-2">
            Test accounts (manual entry)
          </p>
          <div className="grid grid-cols-2 gap-2">
            {['OPR001','OPR002','QC001','SUP001'].map(id => (
              <button
                key={id}
                onClick={() => { setStaffId(id); handleLogin(id) }}
                className="text-xs bg-blue-700 hover:bg-blue-600 text-white rounded px-2 py-1.5 transition-colors"
              >
                {id}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
