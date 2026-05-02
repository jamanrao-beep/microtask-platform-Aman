// app/api/earnings/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = session.user as any

  if (user.role === 'ADMIN') {
    // Admin gets platform stats
    const [totalTasks, totalWorkers, totalSubmissions, pending, approved] = await Promise.all([
      prisma.task.count(),
      prisma.user.count({ where: { role: 'WORKER' } }),
      prisma.submission.count(),
      prisma.submission.count({ where: { status: 'PENDING' } }),
      prisma.submission.count({ where: { status: 'APPROVED' } }),
    ])
    return NextResponse.json({ totalTasks, totalWorkers, totalSubmissions, pending, approved })
  }

  const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } })
  return NextResponse.json(wallet ?? { pending: 0, approved: 0, withdrawn: 0 })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = session.user as any
  const { action } = await req.json()

  if (action === 'withdraw') {
    const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } })
    if (!wallet || wallet.approved < 5) {
      return NextResponse.json({ error: 'Minimum withdrawal is $5.00' }, { status: 400 })
    }
    const updated = await prisma.wallet.update({
      where: { userId: user.id },
      data: { withdrawn: { increment: wallet.approved }, approved: 0 },
    })
    return NextResponse.json(updated)
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
