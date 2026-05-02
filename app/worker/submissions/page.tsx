// app/worker/submissions/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, Badge } from '@/components/ui'
import { formatCurrency, formatDate, STATUS_COLORS, TASK_TYPE_LABELS, TASK_TYPE_COLORS } from '@/lib/utils'

export default async function WorkerSubmissionsPage() {
  const session = await getServerSession(authOptions)
  const userId = (session!.user as any).id

  const submissions = await prisma.submission.findMany({
    where: { userId },
    include: { task: true },
    orderBy: { createdAt: 'desc' },
  })

  const counts = {
    total: submissions.length,
    approved: submissions.filter(s => s.status === 'APPROVED').length,
    pending: submissions.filter(s => s.status === 'PENDING').length,
    rejected: submissions.filter(s => s.status === 'REJECTED').length,
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Submissions</h1>
        <p className="text-gray-500 mt-1">Track all your submitted proofs</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', value: counts.total, color: 'bg-gray-100 text-gray-700' },
          { label: 'Approved', value: counts.approved, color: 'bg-emerald-100 text-emerald-700' },
          { label: 'Pending', value: counts.pending, color: 'bg-yellow-100 text-yellow-700' },
          { label: 'Rejected', value: counts.rejected, color: 'bg-red-100 text-red-700' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl px-5 py-4 ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <Card>
        <div className="divide-y divide-gray-50">
          {submissions.length === 0 ? (
            <p className="p-12 text-center text-gray-400">No submissions yet</p>
          ) : submissions.map(sub => (
            <div key={sub.id} className="p-5 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={TASK_TYPE_COLORS[sub.task.type]}>{TASK_TYPE_LABELS[sub.task.type]}</Badge>
                </div>
                <p className="text-sm font-semibold text-gray-900">{sub.task.title}</p>
                <p className="text-xs text-gray-400 mt-1">Submitted {formatDate(sub.createdAt)}</p>
                {sub.note && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-1.5 mt-2">
                    ⚠️ {sub.note}
                  </p>
                )}
                <div className="mt-2 bg-gray-50 rounded-lg px-3 py-2">
                  <p className="text-xs text-gray-500 font-medium mb-0.5">Proof submitted:</p>
                  <p className="text-xs text-gray-600 truncate">{sub.proof}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-base font-bold text-gray-900">{formatCurrency(sub.task.reward)}</p>
                <Badge className={`mt-1 ${STATUS_COLORS[sub.status]}`}>{sub.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
