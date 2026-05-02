// app/admin/workers/page.tsx
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Users } from 'lucide-react'

export default async function AdminWorkersPage() {
  const workers = await prisma.user.findMany({
    where: { role: 'WORKER' },
    include: {
      wallet: true,
      _count: { select: { submissions: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="p-2.5 bg-indigo-50 rounded-xl"><Users size={20} className="text-indigo-600" /></div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workers</h1>
          <p className="text-gray-500 text-sm">{workers.length} registered workers</p>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Worker</th>
                <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Submissions</th>
                <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Pending</th>
                <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Balance</th>
                <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Withdrawn</th>
                <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {workers.map(w => (
                <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm font-bold">
                        {w.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{w.name}</p>
                        <p className="text-xs text-gray-400">{w.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right text-sm text-gray-600">{w._count.submissions}</td>
                  <td className="px-5 py-4 text-right text-sm font-medium text-yellow-600">{formatCurrency(w.wallet?.pending ?? 0)}</td>
                  <td className="px-5 py-4 text-right text-sm font-medium text-emerald-600">{formatCurrency(w.wallet?.approved ?? 0)}</td>
                  <td className="px-5 py-4 text-right text-sm text-gray-500">{formatCurrency(w.wallet?.withdrawn ?? 0)}</td>
                  <td className="px-5 py-4 text-right text-xs text-gray-400">{formatDate(w.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
