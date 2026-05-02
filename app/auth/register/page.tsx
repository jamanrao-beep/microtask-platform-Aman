// app/auth/register/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { Zap } from 'lucide-react'
import { Input, Button } from '@/components/ui'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Registration failed'); setLoading(false); return }

    await signIn('credentials', { email: form.email, password: form.password, redirect: false })
    router.push('/worker/dashboard')
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
          <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
          <p className="text-gray-500 text-sm mt-1">Start earning in minutes</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Full name" id="name" value={form.name} onChange={update('name')} placeholder="Priya Sharma" required />
            <Input label="Email" type="email" id="email" value={form.email} onChange={update('email')} placeholder="you@example.com" required />
            <Input label="Password" type="password" id="password" value={form.password} onChange={update('password')} placeholder="Min 6 characters" minLength={6} required />
            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
            <Button type="submit" className="w-full" loading={loading} size="lg">Create account</Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-indigo-600 hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
