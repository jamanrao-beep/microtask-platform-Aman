// app/admin/tasks/[id]/page.tsx
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Card, Badge } from '@/components/ui'
import { formatCurrency, formatDate, TASK_TYPE_LABELS, TASK_TYPE_COLORS, STATUS_COLORS } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft, Edit2, Users, Target, DollarSign } from 'lucide-react'
import { ReviewActions } from '../../submissions/ReviewActions'

export default async function TaskDetailPage({ params }: { params: { id: string } }) {
  const task = await prisma.task.findUnique({
    where: { id: params.id },
    include: {
      submissions: {
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })
  if (!task) notFound()

  const pct = Math.min(Math.round((task.completedQty / task.requiredQty) * 100), 100)
  const totalPaid = task.submissions.filter(s => s.status === 'APPROVED').length * task.reward

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/admin/tasks" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft size={14} /> Back to tasks
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={TASK_TYPE_COLORS[task.type]}>{TASK_TYPE_LABELS[task.type]}</Badge>
              <Badge className={STATUS_COLORS[task.status]}>{task.status}</Badge>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
            <p className="text-gray-500 mt-1">{task.description}</p>
          </div>
          <Link
            href={`/admin/tasks/${task.id}/edit`}
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Edit2 size={14} /> Edit
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1"><Users size={15} className="text-indigo-500" /><p className="text-xs text-gray-500">Completions</p></div>
          <p className="text-2xl font-bold">{task.completedQty} <span className="text-gray-400 text-base font-normal">/ {task.requiredQty}</span></p>
          <div className="mt-2 h-1.5 bg-gray-100 rounded-full"><div className="h-1.5 bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} /></div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1"><DollarSign size={15} className="text-emerald-500" /><p className="text-xs text-gray-500">Reward</p></div>
          <p className="text-2xl font-bold text-emerald-600">{formatCurrency(task.reward)}</p>
          <p className="text-xs text-gray-400 mt-1">per submission</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1"><Target size={15} className="text-orange-500" /><p className="text-xs text-gray-500">Total Paid Out</p></div>
          <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalPaid)}</p>
          <p className="text-xs text-gray-400 mt-1">approved rewards</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-500 mb-1">Proof Type</p>
          <p className="text-2xl font-bold">{task.proofType}</p>
          <p className="text-xs text-gray-400 mt-1">submission format</p>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="p-5 mb-6">
        <h2 className="font-semibold text-gray-900 mb-3">Instructions</h2>
        <pre className="text-sm text-gray-600 whitespace-pre-wrap font-sans leading-relaxed bg-gray-50 rounded-lg p-4">{task.instructions}</pre>
      </Card>

      {/* Submissions */}
      <Card>
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">All Submissions ({task.submissions.length})</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {task.submissions.length === 0 ? (
            <p className="p-10 text-center text-gray-400 text-sm">No submissions yet</p>
          ) : task.submissions.map(sub => (
            <div key={sub.id} className="p-5 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{sub.user.name} <span className="text-gray-400 font-normal">({sub.user.email})</span></p>
                <p className="text-xs text-gray-400 mt-0.5">{formatDate(sub.createdAt)}</p>
                <div className="mt-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                  <p className="text-xs text-gray-500 font-medium mb-0.5">Proof:</p>
                  <p className="text-sm text-gray-700 break-all">{sub.proof}</p>
                </div>
                {sub.note && <p className="text-xs text-orange-600 mt-2 bg-orange-50 rounded px-3 py-1.5">⚠️ {sub.note}</p>}
              </div>
              <div className="text-right shrink-0">
                <Badge className={STATUS_COLORS[sub.status]}>{sub.status}</Badge>
                {sub.status === 'PENDING' && <ReviewActions submissionId={sub.id} />}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
