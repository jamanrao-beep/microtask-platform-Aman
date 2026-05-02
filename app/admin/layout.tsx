// app/admin/layout.tsx
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { Sidebar } from '@/components/Sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login')
  if ((session.user as any).role !== 'ADMIN') redirect('/worker/dashboard')

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        role="ADMIN"
        name={session.user?.name || ''}
        email={session.user?.email || ''}
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
