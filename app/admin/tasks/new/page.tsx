// app/admin/tasks/new/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input, Textarea, Select, Button, Card } from '@/components/ui'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewTaskPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'SURVEY',
    reward: '',
    requiredQty: '',
    instructions: '',
    proofType: 'SCREENSHOT',
  })

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        reward: parseFloat(form.reward),
        requiredQty: parseInt(form.requiredQty),
      }),
    })

    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Failed to create task'); setLoading(false); return }

    router.push('/admin/tasks')
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <Link href="/admin/tasks" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft size={14} /> Back to tasks
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
        <p className="text-gray-500 mt-1">Workers will see this and submit proofs</p>
      </div>

      <Card className="p-6">
        <form onSubmit={submit} className="space-y-5">
          <Input label="Task Title" id="title" value={form.title} onChange={update('title')} placeholder="e.g. Complete Product Satisfaction Survey" required />
          <Textarea label="Short Description" id="desc" value={form.description} onChange={update('description')} placeholder="Brief description shown on the task card..." rows={2} required />

          <div className="grid grid-cols-2 gap-4">
            <Select label="Task Type" id="type" value={form.type} onChange={update('type')}>
              <option value="SURVEY">Survey</option>
              <option value="REDDIT_POST">Reddit Post</option>
              <option value="REDDIT_UPVOTE">Reddit Upvote</option>
              <option value="DATA_COLLECTION">Data Collection</option>
              <option value="SOCIAL_MEDIA">Social Media</option>
              <option value="APP_REVIEW">App Review</option>
              <option value="CONTENT_WRITING">Content Writing</option>
            </Select>
            <Select label="Proof Type" id="proofType" value={form.proofType} onChange={update('proofType')}>
              <option value="SCREENSHOT">Screenshot</option>
              <option value="URL">URL Link</option>
              <option value="TEXT">Text/Data</option>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Reward per completion ($)"
              id="reward"
              type="number"
              min="0.01"
              step="0.01"
              value={form.reward}
              onChange={update('reward')}
              placeholder="0.75"
              required
            />
            <Input
              label="Required quantity"
              id="qty"
              type="number"
              min="1"
              value={form.requiredQty}
              onChange={update('requiredQty')}
              placeholder="500"
              required
            />
          </div>

          <Textarea
            label="Step-by-step Instructions"
            id="instructions"
            value={form.instructions}
            onChange={update('instructions')}
            placeholder="1. Go to the survey link&#10;2. Complete all questions&#10;3. Take a screenshot of confirmation&#10;4. Submit as proof"
            rows={6}
            required
          />

          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Link href="/admin/tasks">
              <Button type="button" variant="secondary" size="lg">Cancel</Button>
            </Link>
            <Button type="submit" size="lg" loading={loading} className="flex-1">
              Create Task
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
