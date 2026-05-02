// app/api/submissions/[id]/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { status, note } = await req.json()
  if (!['APPROVED', 'REJECTED'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const submission = await prisma.submission.findUnique({
    where: { id: params.id },
    include: { task: true },
  })
  if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const updated = await prisma.submission.update({
    where: { id: params.id },
    data: { status, note },
  })

  // Update wallet: move from pending to approved (or remove from pending if rejected)
  if (status === 'APPROVED') {
    await prisma.wallet.update({
      where: { userId: submission.userId },
      data: {
        pending: { decrement: submission.task.reward },
        approved: { increment: submission.task.reward },
      },
    })
  } else if (status === 'REJECTED') {
    await prisma.wallet.update({
      where: { userId: submission.userId },
      data: { pending: { decrement: submission.task.reward } },
    })
  }

  return NextResponse.json(updated)
}
