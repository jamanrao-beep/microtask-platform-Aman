// app/admin/dashboard/page.tsx
import { prisma } from '@/lib/prisma'
import { StatCard, Card, Badge } from '@/components/ui'
import { formatCurrency, formatDate, STATUS_COLORS, TASK_TYPE_LABELS } from '@/lib/utils'
import { ClipboardList, Users, CheckSquare, Clock, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const [taskCount, workerCount, subTotal, pendingCount, approvedCount, recentSubs, topTasks] = await Promise.all([
    prisma.task.count(),
    prisma.user.count({ where: { role: 'WORKER' } }),
    prisma.submission.count(),
    prisma.submission.count({ where: { status: 'PENDING' } }),
    prisma.submission.count({ where: { status: 'APPROVED' } }),
    prisma.submission.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: { task: true, user: { select: { name: true } } },
    }),
    prisma.task.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { completedQty: 'desc' },
      take: 4,
    }),
  ])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Platform Dashboard</h1>
        <p className="text-gray-500 mt-1">Live overview of all activity</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Tasks" value={taskCount} icon={<ClipboardList size={18} />} color="indigo" />
        <StatCard label="Active Workers" value={workerCount} icon={<Users size={18} />} color="blue" />
        <StatCard label="Pending Review" value={pendingCount} sub="Needs action" icon={<Clock size={18} />} color="yellow" />
        <StatCard label="Approved" value={approvedCount} sub="All time" icon={<CheckSquare size={18} />} color="green" />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Recent submissions */}
        <Card className="col-span-2">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Submissions</h2>
            <Link href="/admin/submissions" className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
              Review all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentSubs.map(sub => (
              <div key={sub.id} className="px-5 py-3.5 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{sub.task.title}</p>
                  <p className="text-xs text-gray-400">by {sub.user.name} · {formatDate(sub.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3 ml-4 shrink-0">
                  <span className="text-sm font-medium text-gray-600">{formatCurrency(sub.task.reward)}</span>
                  <Badge className={STATUS_COLORS[sub.status]}>{sub.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Active tasks progress */}
        <Card className="p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={16} /> Task Progress
          </h2>
          <div className="space-y-4">
            {topTasks.map(task => {
              const pct = Math.min(Math.round((task.completedQty / task.requiredQty) * 100), 100)
              return (
                <div key={task.id}>
                  <div className="flex justify-between mb-1.5">
                    <p className="text-xs font-medium text-gray-700 truncate max-w-[160px]">{task.title}</p>
                    <p className="text-xs text-gray-400">{pct}%</p>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{task.completedQty} / {task.requiredQty}</p>
                </div>
              )
            })}
          </div>
          <Link href="/admin/tasks" className="flex items-center justify-center gap-1 text-sm text-indigo-600 hover:underline mt-5">
            Manage tasks <ArrowRight size={14} />
          </Link>
        </Card>
      </div>
    </div>
  )
}
