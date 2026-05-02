// app/admin/analytics/page.tsx
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, DollarSign, Users, CheckSquare } from 'lucide-react'

export default async function AdminAnalyticsPage() {
  const [
    tasksByType,
    submissionsByStatus,
    topWorkers,
    dailyStats,
    totalPaidOut,
  ] = await Promise.all([
    prisma.task.groupBy({ by: ['type'], _count: true, _sum: { completedQty: true } }),
    prisma.submission.groupBy({ by: ['status'], _count: true }),
    prisma.submission.groupBy({
      by: ['userId'],
      where: { status: 'APPROVED' },
      _count: true,
      orderBy: { _count: { userId: 'desc' } },
      take: 5,
    }),
    prisma.submission.findMany({
      where: { status: 'APPROVED' },
      select: { createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
    prisma.wallet.aggregate({ _sum: { withdrawn: true, approved: true } }),
  ])

  // Enrich top workers with names
  const workerIds = topWorkers.map(w => w.userId)
  const workerUsers = await prisma.user.findMany({
    where: { id: { in: workerIds } },
    select: { id: true, name: true, email: true },
  })
  const workerMap = Object.fromEntries(workerUsers.map(u => [u.id, u]))

  const statusMap = Object.fromEntries(submissionsByStatus.map(s => [s.status, s._count]))
  const totalSubs = submissionsByStatus.reduce((a, s) => a + s._count, 0)
  const approvalRate = totalSubs ? Math.round(((statusMap['APPROVED'] ?? 0) / totalSubs) * 100) : 0

  const TASK_TYPE_LABELS: Record<string, string> = {
    SURVEY: 'Survey', REDDIT_POST: 'Reddit Post', REDDIT_UPVOTE: 'Reddit Upvote',
    DATA_COLLECTION: 'Data Collection', SOCIAL_MEDIA: 'Social Media',
    APP_REVIEW: 'App Review', CONTENT_WRITING: 'Content Writing',
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1">Platform-wide performance overview</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-2"><TrendingUp size={16} className="text-indigo-500" /><p className="text-xs text-gray-500 font-medium">Approval Rate</p></div>
          <p className="text-3xl font-bold text-indigo-600">{approvalRate}%</p>
          <p className="text-xs text-gray-400 mt-1">{statusMap['APPROVED'] ?? 0} of {totalSubs} submissions</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-2"><DollarSign size={16} className="text-emerald-500" /><p className="text-xs text-gray-500 font-medium">Total Paid Out</p></div>
          <p className="text-3xl font-bold text-emerald-600">{formatCurrency(totalPaidOut._sum.withdrawn ?? 0)}</p>
          <p className="text-xs text-gray-400 mt-1">withdrawn by workers</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-2"><CheckSquare size={16} className="text-orange-500" /><p className="text-xs text-gray-500 font-medium">Pending Queue</p></div>
          <p className="text-3xl font-bold text-orange-600">{statusMap['PENDING'] ?? 0}</p>
          <p className="text-xs text-gray-400 mt-1">awaiting review</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-2"><Users size={16} className="text-purple-500" /><p className="text-xs text-gray-500 font-medium">Balances Held</p></div>
          <p className="text-3xl font-bold text-purple-600">{formatCurrency(totalPaidOut._sum.approved ?? 0)}</p>
          <p className="text-xs text-gray-400 mt-1">approved, not withdrawn</p>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Tasks by type */}
        <Card className="p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Tasks by Type</h2>
          <div className="space-y-3">
            {tasksByType.map(t => (
              <div key={t.type} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{TASK_TYPE_LABELS[t.type] ?? t.type}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${Math.min(100, ((t._sum.completedQty ?? 0) / 500) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-20 text-right">{t._count} tasks · {t._sum.completedQty ?? 0} done</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Submission status pie */}
        <Card className="p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Submission Status Breakdown</h2>
          <div className="space-y-4">
            {[
              { key: 'APPROVED', label: 'Approved', color: 'bg-emerald-500' },
              { key: 'PENDING', label: 'Pending', color: 'bg-yellow-500' },
              { key: 'REJECTED', label: 'Rejected', color: 'bg-red-500' },
            ].map(({ key, label, color }) => {
              const count = statusMap[key] ?? 0
              const pct = totalSubs ? Math.round((count / totalSubs) * 100) : 0
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-600 font-medium">{label}</span>
                    <span className="text-gray-500">{count} <span className="text-gray-300">({pct}%)</span></span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className={`h-2 ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Top workers */}
      <Card>
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Top Workers by Approved Tasks</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {topWorkers.map((w, i) => {
            const u = workerMap[w.userId]
            return (
              <div key={w.userId} className="px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-300 w-5">#{i + 1}</span>
                  <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-bold">
                    {u?.name?.charAt(0) ?? '?'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{u?.name ?? 'Unknown'}</p>
                    <p className="text-xs text-gray-400">{u?.email}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-emerald-600">{w._count} approved tasks</span>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
