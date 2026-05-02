// app/worker/tasks/TaskSubmitButton.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Textarea } from '@/components/ui'
import { X, Upload } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export function TaskSubmitButton({ task }: {
  task: { id: string; title: string; proofType: string; reward: number }
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [proof, setProof] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function submit() {
    if (!proof.trim()) { setError('Please provide proof'); return }
    setLoading(true)
    setError('')

    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId: task.id, proof }),
    })
    const data = await res.json()

    if (!res.ok) { setError(data.error || 'Submission failed'); setLoading(false); return }

    setSuccess(true)
    setTimeout(() => { setOpen(false); setSuccess(false); setProof(''); router.refresh() }, 1800)
    setLoading(false)
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} size="md">
        <Upload size={15} />
        Submit Proof
      </Button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-semibold text-gray-900">Submit Proof</h2>
                <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{task.title}</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={16} /></button>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 mb-5">
              <p className="text-sm text-emerald-700">
                Reward: <span className="font-bold">{formatCurrency(task.reward)}</span> — added to your wallet once approved
              </p>
            </div>

            {task.proofType === 'URL' && (
              <Input
                label="Proof URL"
                type="url"
                value={proof}
                onChange={e => setProof(e.target.value)}
                placeholder="https://reddit.com/r/example/..."
                error={error}
              />
            )}
            {task.proofType === 'TEXT' && (
              <Textarea
                label="Proof Text"
                value={proof}
                onChange={e => setProof(e.target.value)}
                placeholder="Paste your collected data here..."
                rows={5}
                error={error}
              />
            )}
            {task.proofType === 'SCREENSHOT' && (
              <Textarea
                label="Screenshot description / link"
                value={proof}
                onChange={e => setProof(e.target.value)}
                placeholder="Paste screenshot URL or describe what your screenshot shows..."
                rows={4}
                error={error}
              />
            )}

            {success && (
              <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm text-emerald-700">
                ✅ Submitted! Pending admin review.
              </div>
            )}

            <div className="flex gap-3 mt-5">
              <Button variant="secondary" className="flex-1" onClick={() => setOpen(false)}>Cancel</Button>
              <Button className="flex-1" loading={loading} onClick={submit} disabled={success}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
