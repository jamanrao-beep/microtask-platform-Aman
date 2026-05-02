// app/worker/tasks/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, Badge } from '@/components/ui'
import { formatCurrency, TASK_TYPE_LABELS, TASK_TYPE_COLORS } from '@/lib/utils'
import { TaskSubmitButton } from './TaskSubmitButton'
import { Users, Target } from 'lucide-react'

export default async function WorkerTasksPage() {
  const session = await getServerSession(authOptions)
  const userId = (session!.user as any).id

  const [tasks, mySubmissions] = await Promise.all([
    prisma.task.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.submission.findMany({
      where: { userId, status: { not: 'REJECTED' } },
      select: { taskId: true },
    }),
  ])

  const submittedTaskIds = new Set(mySubmissions.map(s => s.taskId))

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Available Tasks</h1>
        <p className="text-gray-500 mt-1">{tasks.length} tasks available — pick what suits you</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tasks.map(task => {
          const done = submittedTaskIds.has(task.id)
          const progress = Math.round((task.completedQty / task.requiredQty) * 100)

          return (
            <Card key={task.id} className={done ? 'opacity-60' : ''}>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={TASK_TYPE_COLORS[task.type]}>
                        {TASK_TYPE_LABELS[task.type]}
                      </Badge>
                      <Badge className="bg-gray-100 text-gray-600">
                        Proof: {task.proofType}
                      </Badge>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">{task.title}</h3>
                    <p className="text-sm text-gray-500">{task.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-2xl font-bold text-emerald-600">{formatCurrency(task.reward)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">per completion</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                    <span className="flex items-center gap-1"><Users size={12} /> {task.completedQty} completed</span>
                    <span className="flex items-center gap-1"><Target size={12} /> {task.requiredQty} needed · {progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-indigo-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>

                <details className="mt-4 group">
                  <summary className="text-sm text-indigo-600 cursor-pointer hover:text-indigo-800 font-medium list-none flex items-center gap-1">
                    📋 View instructions
                  </summary>
                  <div className="mt-3 bg-gray-50 rounded-lg p-4">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{task.instructions}</pre>
                  </div>
                </details>

                <div className="mt-4 flex items-center justify-end">
                  {done ? (
                    <span className="text-sm text-gray-400 bg-gray-100 px-4 py-2 rounded-lg">Already submitted</span>
                  ) : (
                    <TaskSubmitButton task={{ id: task.id, title: task.title, proofType: task.proofType, reward: task.reward }} />
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
