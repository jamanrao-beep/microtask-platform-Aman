// app/auth/login/page.tsx
'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Zap } from 'lucide-react'
import { Input, Button } from '@/components/ui'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await signIn('credentials', { email, password, redirect: false })

    if (res?.error) {
      setError('Invalid email or password')
      setLoading(false)
      return
    }

    // Redirect based on role — fetch session to get role
    const sessionRes = await fetch('/api/auth/session')
    const session = await sessionRes.json()
    const role = session?.user?.role

    router.push(role === 'ADMIN' ? '/admin/dashboard' : '/worker/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">TaskPro</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <Input
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
            <Button type="submit" className="w-full" loading={loading} size="lg">
              Sign in
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">Quick demo</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setEmail('worker@taskpro.com'); setPassword('worker123') }}
                className="text-xs px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors font-medium"
              >
                👷 Worker demo
              </button>
              <button
                onClick={() => { setEmail('admin@taskpro.com'); setPassword('admin123') }}
                className="text-xs px-3 py-2 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors font-medium"
              >
                ⚙️ Admin demo
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          No account?{' '}
          <Link href="/auth/register" className="text-indigo-600 hover:underline font-medium">Create one free</Link>
        </p>
      </div>
    </div>
  )
}
