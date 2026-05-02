'use client'
// app/admin/tasks/[id]/edit/EditTaskForm.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input, Textarea, Select, Button, Card } from '@/components/ui'
import type { Task } from '@prisma/client'

export function EditTaskForm({ task }: { task: Task }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: task.title,
    description: task.description,
    type: task.type,
    reward: String(task.reward),
    requiredQty: String(task.requiredQty),
    instructions: task.instructions,
    proofType: task.proofType,
    status: task.status,
  })

  const update = (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        reward: parseFloat(form.reward),
        requiredQty: parseInt(form.requiredQty),
      }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Update failed'); setLoading(false); return }
    router.push('/admin/tasks')
    router.refresh()
  }

  return (
    <Card className="p-6">
      <form onSubmit={submit} className="space-y-5">
        <Input label="Task Title" value={form.title} onChange={update('title')} required />
        <Textarea label="Short Description" value={form.description} onChange={update('description')} rows={2} required />
        <div className="grid grid-cols-2 gap-4">
          <Select label="Task Type" value={form.type} onChange={update('type')}>
            <option value="SURVEY">Survey</option>
            <option value="REDDIT_POST">Reddit Post</option>
            <option value="REDDIT_UPVOTE">Reddit Upvote</option>
            <option value="DATA_COLLECTION">Data Collection</option>
            <option value="SOCIAL_MEDIA">Social Media</option>
            <option value="APP_REVIEW">App Review</option>
            <option value="CONTENT_WRITING">Content Writing</option>
          </Select>
          <Select label="Proof Type" value={form.proofType} onChange={update('proofType')}>
            <option value="SCREENSHOT">Screenshot</option>
            <option value="URL">URL Link</option>
            <option value="TEXT">Text/Data</option>
          </Select>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Input label="Reward ($)" type="number" min="0.01" step="0.01" value={form.reward} onChange={update('reward')} required />
          <Input label="Required Qty" type="number" min="1" value={form.requiredQty} onChange={update('requiredQty')} required />
          <Select label="Status" value={form.status} onChange={update('status')}>
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
            <option value="COMPLETED">Completed</option>
          </Select>
        </div>
        <Textarea label="Instructions" value={form.instructions} onChange={update('instructions')} rows={6} required />
        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" size="lg" onClick={() => router.push('/admin/tasks')}>Cancel</Button>
          <Button type="submit" size="lg" loading={loading} className="flex-1">Save Changes</Button>
        </div>
      </form>
    </Card>
  )
}
