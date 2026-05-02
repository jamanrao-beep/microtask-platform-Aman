// components/ui/index.tsx
'use client'
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success'
    size?: 'sm' | 'md' | 'lg'
    loading?: boolean
  }
>(({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-400',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500',
  }
  const sizes = { sm: 'px-3 py-1.5 text-sm gap-1.5', md: 'px-4 py-2 text-sm gap-2', lg: 'px-6 py-3 text-base gap-2' }

  return (
    <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} disabled={disabled || loading} {...props}>
      {loading && <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
      {children}
    </button>
  )
})
Button.displayName = 'Button'

export function Badge({ children, className, variant = 'gray' }: { children: React.ReactNode; className?: string; variant?: string }) {
  const variants: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-700',
    green: 'bg-emerald-100 text-emerald-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    blue: 'bg-blue-100 text-blue-800',
    orange: 'bg-orange-100 text-orange-800',
    purple: 'bg-purple-100 text-purple-800',
    pink: 'bg-pink-100 text-pink-800',
  }
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variants[variant] || variant, className)}>
      {children}
    </span>
  )
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('bg-white rounded-xl border border-gray-200 shadow-sm', className)}>{children}</div>
}

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        ref={ref}
        id={id}
        className={cn('w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors', error && 'border-red-400 focus:ring-red-400', className)}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
)
Input.displayName = 'Input'

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>}
      <textarea
        ref={ref}
        id={id}
        className={cn('w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none', error && 'border-red-400', className)}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
)
Textarea.displayName = 'Textarea'

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }>(
  ({ className, label, id, children, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>}
      <select
        ref={ref}
        id={id}
        className={cn('w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white', className)}
        {...props}
      >
        {children}
      </select>
    </div>
  )
)
Select.displayName = 'Select'

export function StatCard({ label, value, sub, icon, color = 'indigo' }: { label: string; value: string | number; sub?: string; icon?: React.ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-600',
    green: 'bg-emerald-50 text-emerald-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
  }
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
        {icon && <div className={cn('p-2.5 rounded-lg', colors[color])}>{icon}</div>}
      </div>
    </Card>
  )
}
