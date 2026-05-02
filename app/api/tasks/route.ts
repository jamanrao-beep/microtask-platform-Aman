// app/api/tasks/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')

  const tasks = await prisma.task.findMany({
    where: status ? { status: status as any } : undefined,
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { submissions: true } } },
  })

  return NextResponse.json(tasks)
}

const taskSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  type: z.enum(['SURVEY', 'REDDIT_POST', 'REDDIT_UPVOTE', 'DATA_COLLECTION', 'SOCIAL_MEDIA', 'APP_REVIEW', 'CONTENT_WRITING']),
  reward: z.number().positive(),
  requiredQty: z.number().int().positive(),
  instructions: z.string().min(10),
  proofType: z.enum(['SCREENSHOT', 'URL', 'TEXT']),
})

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const data = taskSchema.parse(body)
    const task = await prisma.task.create({ data })
    return NextResponse.json(task, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }
}
