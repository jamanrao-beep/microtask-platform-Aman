// app/admin/submissions/page.tsx
import { prisma } from '@/lib/prisma'
import { Card, Badge } from '@/components/ui'
import { formatCurrency, formatDate, STATUS_COLORS, TASK_TYPE_LABELS, TASK_TYPE_COLORS } from '@/lib/utils'
import { ReviewActions } from './ReviewActions'

export default async function AdminSubmissionsPage({ searchParams }: { searchParams: { status?: string } }) {
  const statusFilter = searchParams.status

  const submissions = await prisma.submission.findMany({
    where: statusFilter ? { status: statusFilter as any } : undefined,
    include: { task: true, user: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const counts = {
    all: await prisma.submission.count(),
    pending: await prisma.submission.count({ where: { status: 'PENDING' } }),
    approved: await prisma.submission.count({ where: { status: 'APPROVED' } }),
    rejected: await prisma.submission.count({ where: { status: 'REJECTED' } }),
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Submissions Review</h1>
        <p className="text-gray-500 mt-1">Approve or reject worker submissions</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {[
          { label: 'All', value: '', count: counts.all },
          { label: 'Pending', value: 'PENDING', count: counts.pending },
          { label: 'Approved', value: 'APPROVED', count: counts.approved },
          { label: 'Rejected', value: 'REJECTED', count: counts.rejected },
        ].map(({ label, value, count }) => {
          const active = (statusFilter ?? '') === value
          return (
            <a
              key={value}
              href={value ? `?status=${value}` : '/admin/submissions'}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${active ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-500'}`}>{count}</span>
            </a>
          )
        })}
      </div>

      <Card>
        <div className="divide-y divide-gray-50">
          {submissions.length === 0 ? (
            <p className="p-12 text-center text-gray-400">No submissions found</p>
          ) : submissions.map(sub => (
            <div key={sub.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={TASK_TYPE_COLORS[sub.task.type]}>{TASK_TYPE_LABELS[sub.task.type]}</Badge>
                    <Badge className={STATUS_COLORS[sub.status]}>{sub.status}</Badge>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{sub.task.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    by <span className="font-medium text-gray-600">{sub.user.name}</span> ({sub.user.email}) · {formatDate(sub.createdAt)}
                  </p>
                  <div className="mt-3 bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="text-xs text-gray-500 font-medium mb-1">Submitted proof:</p>
                    <p className="text-sm text-gray-700 break-all">{sub.proof}</p>
                  </div>
                  {sub.note && (
                    <p className="text-xs text-orange-600 mt-2 bg-orange-50 rounded-lg px-3 py-1.5">Note: {sub.note}</p>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-lg font-bold text-emerald-600">{formatCurrency(sub.task.reward)}</p>
                  {sub.status === 'PENDING' && (
                    <ReviewActions submissionId={sub.id} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
