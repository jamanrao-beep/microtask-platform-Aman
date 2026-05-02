// app/admin/submissions/ReviewActions.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { Check, X } from 'lucide-react'

export function ReviewActions({ submissionId }: { submissionId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState('')
  const [done, setDone] = useState(false)

  async function review(status: 'APPROVED' | 'REJECTED', note?: string) {
    setLoading(status)
    await fetch(`/api/submissions/${submissionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note }),
    })
    setDone(true)
    setLoading('')
    router.refresh()
  }

  if (done) return <p className="text-xs text-gray-400 mt-2">Reviewed</p>

  return (
    <div className="flex gap-2 mt-2">
      <Button
        size="sm"
        variant="danger"
        onClick={() => review('REJECTED', 'Proof does not meet requirements.')}
        loading={loading === 'REJECTED'}
      >
        <X size={13} /> Reject
      </Button>
      <Button
        size="sm"
        variant="success"
        onClick={() => review('APPROVED')}
        loading={loading === 'APPROVED'}
      >
        <Check size={13} /> Approve
      </Button>
    </div>
  )
}
