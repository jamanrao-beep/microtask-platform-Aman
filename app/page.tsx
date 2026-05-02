// app/page.tsx
import Link from 'next/link'
import { Zap, CheckCircle, DollarSign, Users, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white">
      <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <Zap size={16} />
          </div>
          <span className="font-bold text-lg">TaskPro</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="text-sm text-gray-300 hover:text-white transition-colors px-4 py-2">Sign in</Link>
          <Link href="/auth/register" className="text-sm bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg transition-colors font-medium">Get started</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-sm text-indigo-300 mb-6">
          <Zap size={14} />
          22,000+ tasks completed daily
        </div>
        <h1 className="text-5xl font-bold leading-tight mb-6">
          Complete microtasks.<br />
          <span className="text-indigo-400">Get paid fast.</span>
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Surveys, Reddit posts, data collection and more. Earn from anywhere — withdrawals every week.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/auth/register" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-8 py-3.5 rounded-xl font-semibold text-base transition-colors">
            Start Earning <ArrowRight size={18} />
          </Link>
          <Link href="/auth/login" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 px-8 py-3.5 rounded-xl font-semibold text-base transition-colors border border-white/10">
            Sign in
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-20">
          {[
            { icon: CheckCircle, label: '6 Task Types', sub: 'Surveys, Reddit, Data & more', color: 'text-emerald-400' },
            { icon: DollarSign, label: '$0.25–$2.00', sub: 'Per task reward', color: 'text-indigo-400' },
            { icon: Users, label: '4,500+ Workers', sub: 'Active earners', color: 'text-purple-400' },
          ].map(({ icon: Icon, label, sub, color }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
              <Icon size={28} className={`${color} mx-auto mb-3`} />
              <p className="font-bold text-lg">{label}</p>
              <p className="text-gray-400 text-sm mt-1">{sub}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white/5 border border-white/10 rounded-2xl p-8 text-left">
          <p className="text-gray-400 text-sm font-medium mb-4 uppercase tracking-wider">Demo credentials</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
              <p className="text-indigo-300 text-sm font-medium mb-2">👷 Worker</p>
              <p className="text-sm text-gray-300">worker@taskpro.com</p>
              <p className="text-sm text-gray-300">worker123</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
              <p className="text-purple-300 text-sm font-medium mb-2">⚙️ Admin</p>
              <p className="text-sm text-gray-300">admin@taskpro.com</p>
              <p className="text-sm text-gray-300">admin123</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
