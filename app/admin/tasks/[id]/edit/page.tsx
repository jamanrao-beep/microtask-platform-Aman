// app/admin/tasks/[id]/edit/page.tsx
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { EditTaskForm } from './EditTaskForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function EditTaskPage({ params }: { params: { id: string } }) {
  const task = await prisma.task.findUnique({ where: { id: params.id } })
  if (!task) notFound()

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <Link href="/admin/tasks" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft size={14} /> Back to tasks
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Task</h1>
        <p className="text-gray-500 mt-1 text-sm">{task.title}</p>
      </div>
      <EditTaskForm task={task} />
    </div>
  )
}
