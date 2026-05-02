// app/worker/earnings/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/utils'
import { WithdrawButton } from './WithdrawButton'
import { TrendingUp, Lock, CheckCircle, ArrowDownCircle } from 'lucide-react'

export default async function WorkerEarningsPage() {
  const session = await getServerSession(authOptions)
  const userId = (session!.user as any).id

  const [wallet, approved] = await Promise.all([
    prisma.wallet.findUnique({ where: { userId } }),
    prisma.submission.findMany({
      where: { userId, status: 'APPROVED' },
      include: { task: true },
      orderBy: { updatedAt: 'desc' },
    }),
  ])

  const w = wallet ?? { pending: 0, approved: 0, withdrawn: 0 }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Earnings & Wallet</h1>
        <p className="text-gray-500 mt-1">Track income and withdraw funds</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-50 rounded-lg"><CheckCircle size={18} className="text-emerald-600" /></div>
            <p className="text-sm font-medium text-gray-500">Available</p>
          </div>
          <p className="text-3xl font-bold text-emerald-600">{formatCurrency(w.approved)}</p>
          <p className="text-xs text-gray-400 mt-1">Ready to withdraw</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-yellow-50 rounded-lg"><Lock size={18} className="text-yellow-600" /></div>
            <p className="text-sm font-medium text-gray-500">Pending</p>
          </div>
          <p className="text-3xl font-bold text-yellow-600">{formatCurrency(w.pending)}</p>
          <p className="text-xs text-gray-400 mt-1">Awaiting review</p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-indigo-50 rounded-lg"><TrendingUp size={18} className="text-indigo-600" /></div>
            <p className="text-sm font-medium text-gray-500">Total Earned</p>
          </div>
          <p className="text-3xl font-bold text-indigo-600">{formatCurrency(w.approved + w.withdrawn)}</p>
          <p className="text-xs text-gray-400 mt-1">All time</p>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Approved Earnings History</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {approved.length === 0 ? (
              <p className="p-8 text-center text-gray-400 text-sm">No approved earnings yet</p>
            ) : approved.map(sub => (
              <div key={sub.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{sub.task.title}</p>
                  <p className="text-xs text-gray-400">{formatDate(sub.updatedAt)}</p>
                </div>
                <span className="text-sm font-bold text-emerald-600">+{formatCurrency(sub.task.reward)}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 h-fit">
          <h2 className="font-semibold text-gray-900 mb-4">Withdraw</h2>
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <p className="text-xs text-gray-500 mb-1">Balance to withdraw</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(w.approved)}</p>
          </div>
          <WithdrawButton balance={w.approved} />
          <p className="text-xs text-gray-400 mt-3 text-center">Minimum withdrawal: $5.00</p>
          {w.withdrawn > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <ArrowDownCircle size={14} />
                Total withdrawn: <span className="font-medium">{formatCurrency(w.withdrawn)}</span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
