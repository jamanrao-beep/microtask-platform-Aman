// app/worker/earnings/WithdrawButton.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { formatCurrency } from '@/lib/utils'

export function WithdrawButton({ balance }: { balance: number }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  async function withdraw() {
    setLoading(true)
    const res = await fetch('/api/earnings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'withdraw' }),
    })
    const data = await res.json()
    if (!res.ok) { setMsg(data.error); setLoading(false); return }
    setMsg(`✅ ${formatCurrency(balance)} withdrawn successfully!`)
    setLoading(false)
    router.refresh()
  }

  return (
    <>
      <Button
        variant="success"
        className="w-full"
        disabled={balance < 5}
        loading={loading}
        onClick={withdraw}
      >
        Withdraw {balance >= 5 ? formatCurrency(balance) : '(min $5)'}
      </Button>
      {msg && <p className="text-xs text-center mt-2 text-emerald-600">{msg}</p>}
    </>
  )
}
