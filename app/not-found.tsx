// app/not-found.tsx
import Link from 'next/link'
import { Zap } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Zap size={32} className="text-indigo-600" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-gray-500 mb-8">This page doesn't exist.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
