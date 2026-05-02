// components/Sidebar.tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, ClipboardList, CheckSquare, DollarSign,
  Users, LogOut, Zap, PlusSquare, UserCircle, BarChart2, UploadCloud
} from 'lucide-react'

const workerNav = [
  { label: 'Dashboard', href: '/worker/dashboard', icon: LayoutDashboard },
  { label: 'Browse Tasks', href: '/worker/tasks', icon: ClipboardList },
  { label: 'My Submissions', href: '/worker/submissions', icon: CheckSquare },
  { label: 'Earnings', href: '/worker/earnings', icon: DollarSign },
  { label: 'Profile', href: '/worker/profile', icon: UserCircle },
]

const adminNav = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Tasks', href: '/admin/tasks', icon: ClipboardList },
  { label: 'Add Task', href: '/admin/tasks/new', icon: PlusSquare },
  { label: 'Bulk Upload', href: '/admin/tasks/bulk', icon: UploadCloud },
  { label: 'Submissions', href: '/admin/submissions', icon: CheckSquare },
  { label: 'Workers', href: '/admin/workers', icon: Users },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
]

export function Sidebar({ role, name, email }: { role: 'ADMIN' | 'WORKER'; name: string; email: string }) {
  const pathname = usePathname()
  const nav = role === 'ADMIN' ? adminNav : workerNav

  return (
    <aside className="w-60 shrink-0 bg-gray-900 text-white flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold">TaskPro</p>
            <p className="text-xs text-gray-400">{role === 'ADMIN' ? 'Admin Panel' : 'Worker Portal'}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                active ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-gray-800">
        <div className="px-3 py-2 mb-1">
          <p className="text-sm font-medium text-white truncate">{name}</p>
          <p className="text-xs text-gray-400 truncate">{email}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors w-full"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
