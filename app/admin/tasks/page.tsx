// app/admin/tasks/page.tsx
import { prisma } from '@/lib/prisma'
import { Card, Badge } from '@/components/ui'
import Link from 'next/link'
import { formatCurrency, formatDate, TASK_TYPE_LABELS, TASK_TYPE_COLORS, STATUS_COLORS } from '@/lib/utils'
import { PlusCircle, Users } from 'lucide-react'
import { TaskActions } from './TaskActions'

export default async function AdminTasksPage() {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { submissions: true } } },
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-500 mt-1">{tasks.length} total tasks</p>
        </div>
        <Link
          href="/admin/tasks/new"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <PlusCircle size={16} />
          New Task
        </Link>
      </div>

      <Card>
        <div className="divide-y divide-gray-50">
          {tasks.map(task => {
            const pct = Math.min(Math.round((task.completedQty / task.requiredQty) * 100), 100)
            return (
              <div key={task.id} className="p-5 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge className={TASK_TYPE_COLORS[task.type]}>{TASK_TYPE_LABELS[task.type]}</Badge>
                    <Badge className={STATUS_COLORS[task.status]}>{task.status}</Badge>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">{task.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{task.description}</p>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span className="flex items-center gap-1"><Users size={11} /> {task.completedQty} done</span>
                        <span>{task.requiredQty} needed</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-lg font-bold text-emerald-600">{formatCurrency(task.reward)}</p>
                  <p className="text-xs text-gray-400">{task._count.submissions} submissions</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(task.createdAt)}</p>
                  <TaskActions taskId={task.id} status={task.status} />
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
