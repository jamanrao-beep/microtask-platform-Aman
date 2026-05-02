// app/worker/dashboard/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { StatCard, Card, Badge } from '@/components/ui'
import { formatCurrency, formatDate, STATUS_COLORS, TASK_TYPE_LABELS } from '@/lib/utils'
import { DollarSign, Clock, CheckCircle, ListTodo, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default async function WorkerDashboard() {
  const session = await getServerSession(authOptions)
  const userId = (session!.user as any).id

  const [wallet, submissions, activeTasks] = await Promise.all([
    prisma.wallet.findUnique({ where: { userId } }),
    prisma.submission.findMany({
      where: { userId },
      include: { task: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.task.count({ where: { status: 'ACTIVE' } }),
  ])

  const totalEarned = (wallet?.approved ?? 0) + (wallet?.withdrawn ?? 0)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {session?.user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-gray-500 mt-1">Here's your earnings summary</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Available Balance"
          value={formatCurrency(wallet?.approved ?? 0)}
          sub="Ready to withdraw"
          icon={<DollarSign size={18} />}
          color="green"
        />
        <StatCard
          label="Pending Review"
          value={formatCurrency(wallet?.pending ?? 0)}
          sub="Awaiting admin approval"
          icon={<Clock size={18} />}
          color="yellow"
        />
        <StatCard
          label="Total Earned"
          value={formatCurrency(totalEarned)}
          sub="All time"
          icon={<CheckCircle size={18} />}
          color="indigo"
        />
        <StatCard
          label="Active Tasks"
          value={activeTasks}
          sub="Available to complete"
          icon={<ListTodo size={18} />}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Recent submissions */}
        <Card className="col-span-2">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Submissions</h2>
            <Link href="/worker/submissions" className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {submissions.length === 0 ? (
              <p className="p-8 text-center text-gray-400 text-sm">No submissions yet. <Link href="/worker/tasks" className="text-indigo-600 hover:underline">Browse tasks →</Link></p>
            ) : submissions.map(sub => (
              <div key={sub.id} className="px-5 py-3.5 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{sub.task.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(sub.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3 ml-4 shrink-0">
                  <span className="text-sm font-semibold text-gray-700">{formatCurrency(sub.task.reward)}</span>
                  <Badge className={STATUS_COLORS[sub.status]}>{sub.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick actions */}
        <Card className="p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/worker/tasks" className="flex items-center justify-between p-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors">
              <span className="text-sm font-medium text-indigo-700">Browse Tasks</span>
              <ArrowRight size={14} className="text-indigo-500" />
            </Link>
            <Link href="/worker/earnings" className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors">
              <span className="text-sm font-medium text-emerald-700">Withdraw Earnings</span>
              <ArrowRight size={14} className="text-emerald-500" />
            </Link>
            <Link href="/worker/submissions" className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <span className="text-sm font-medium text-gray-700">My Submissions</span>
              <ArrowRight size={14} className="text-gray-400" />
            </Link>
          </div>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-xl">
            <p className="text-xs font-medium text-amber-800 mb-1">💡 Tip</p>
            <p className="text-xs text-amber-700">Tasks with URL or Text proof get approved faster than screenshots.</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
