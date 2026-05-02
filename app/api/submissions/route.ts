// app/api/submissions/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = session.user as any
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')

  const where: any = {}
  if (user.role !== 'ADMIN') where.userId = user.id
  if (status) where.status = status

  const submissions = await prisma.submission.findMany({
    where,
    include: { task: true, user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(submissions)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = session.user as any
  const { taskId, proof } = await req.json()

  if (!taskId || !proof) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  // Check task exists and is active
  const task = await prisma.task.findUnique({ where: { id: taskId } })
  if (!task || task.status !== 'ACTIVE') {
    return NextResponse.json({ error: 'Task not available' }, { status: 400 })
  }

  // Check not already submitted
  const existing = await prisma.submission.findFirst({
    where: { taskId, userId: user.id, status: { not: 'REJECTED' } },
  })
  if (existing) return NextResponse.json({ error: 'Already submitted' }, { status: 400 })

  const [submission] = await prisma.$transaction([
    prisma.submission.create({
      data: { taskId, userId: user.id, proof, status: 'PENDING' },
    }),
    prisma.task.update({
      where: { id: taskId },
      data: { completedQty: { increment: 1 } },
    }),
    prisma.wallet.upsert({
      where: { userId: user.id },
      create: { userId: user.id, pending: task.reward, approved: 0, withdrawn: 0 },
      update: { pending: { increment: task.reward } },
    }),
  ])

  return NextResponse.json(submission, { status: 201 })
}
