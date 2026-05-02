// app/api/tasks/bulk/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/tasks/bulk  — body: { tasks: [...] }
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { tasks } = await req.json()
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return NextResponse.json({ error: 'No tasks provided' }, { status: 400 })
  }

  const created = await prisma.task.createMany({
    data: tasks.map((t: any) => ({
      title: t.title,
      description: t.description,
      type: t.type ?? 'SURVEY',
      reward: parseFloat(t.reward) || 0.5,
      requiredQty: parseInt(t.requiredQty) || 100,
      instructions: t.instructions ?? 'Complete the task and submit proof.',
      proofType: t.proofType ?? 'SCREENSHOT',
    })),
  })

  return NextResponse.json({ created: created.count }, { status: 201 })
}
