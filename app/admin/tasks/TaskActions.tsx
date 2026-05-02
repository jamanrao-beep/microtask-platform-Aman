// app/admin/tasks/TaskActions.tsx
'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui'
import Link from 'next/link'
import { Edit2 } from 'lucide-react'

export function TaskActions({ taskId, status }: { taskId: string; status: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState('')

  async function update(data: object) {
    setLoading(JSON.stringify(data))
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    router.refresh()
    setLoading('')
  }

  async function del() {
    if (!confirm('Delete this task and all its submissions?')) return
    setLoading('delete')
    await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })
    router.refresh()
    setLoading('')
  }

  return (
    <div className="flex items-center gap-1.5 mt-2 justify-end flex-wrap">
      <Link href={`/admin/tasks/${taskId}`}>
        <Button size="sm" variant="ghost">View</Button>
      </Link>
      <Link href={`/admin/tasks/${taskId}/edit`}>
        <Button size="sm" variant="secondary"><Edit2 size={12} /> Edit</Button>
      </Link>
      {status === 'ACTIVE' ? (
        <Button size="sm" variant="secondary" onClick={() => update({ status: 'PAUSED' })} loading={loading === '{"status":"PAUSED"}'}>Pause</Button>
      ) : status === 'PAUSED' ? (
        <Button size="sm" variant="success" onClick={() => update({ status: 'ACTIVE' })} loading={loading === '{"status":"ACTIVE"}'}>Activate</Button>
      ) : null}
      <Button size="sm" variant="danger" onClick={del} loading={loading === 'delete'}>Delete</Button>
    </div>
  )
}
