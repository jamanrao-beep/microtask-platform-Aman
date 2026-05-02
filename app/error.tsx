'use client'
// app/error.tsx
import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error) }, [error])
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <AlertTriangle size={28} className="text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-500 text-sm mb-6">{error.message || 'An unexpected error occurred.'}</p>
        <button
          onClick={reset}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
