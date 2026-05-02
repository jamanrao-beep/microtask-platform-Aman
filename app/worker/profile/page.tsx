// app/worker/profile/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/utils'
import { User, Mail, Calendar, Award } from 'lucide-react'

export default async function WorkerProfilePage() {
  const session = await getServerSession(authOptions)
  const userId = (session!.user as any).id

  const [user, wallet, subStats] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.wallet.findUnique({ where: { userId } }),
    prisma.submission.groupBy({
      by: ['status'],
      where: { userId },
      _count: true,
    }),
  ])

  const stats = Object.fromEntries(subStats.map(s => [s.status, s._count]))
  const totalSubmissions = subStats.reduce((acc, s) => acc + s._count, 0)

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">Your account details and stats</p>
      </div>

      <Card className="p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-indigo-700">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-500 text-sm">Worker Account</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <User size={16} className="text-gray-400" /> {user?.name}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Mail size={16} className="text-gray-400" /> {user?.email}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Calendar size={16} className="text-gray-400" /> Joined {formatDate(user?.createdAt!)}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-5">
          <p className="text-sm text-gray-500 mb-1">Total Earned</p>
          <p className="text-2xl font-bold text-emerald-600">{formatCurrency((wallet?.approved ?? 0) + (wallet?.withdrawn ?? 0))}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm text-gray-500 mb-1">Total Submissions</p>
          <p className="text-2xl font-bold text-gray-900">{totalSubmissions}</p>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Award size={16} /> Submission Breakdown</h3>
        <div className="space-y-3">
          {[
            { label: 'Approved', key: 'APPROVED', color: 'bg-emerald-500' },
            { label: 'Pending', key: 'PENDING', color: 'bg-yellow-500' },
            { label: 'Rejected', key: 'REJECTED', color: 'bg-red-500' },
          ].map(({ label, key, color }) => {
            const count = stats[key] ?? 0
            const pct = totalSubmissions ? Math.round((count / totalSubmissions) * 100) : 0
            return (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-medium">{count} ({pct}%)</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
