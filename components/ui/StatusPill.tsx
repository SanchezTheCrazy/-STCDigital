'use client'

import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/types'

interface StatusPillProps {
  status: OrderStatus
}

const STATUS_MAP: Record<OrderStatus, { label: string; className: string }> = {
  concluido: {
    label: '● Concluído',
    className: 'bg-[#0a1f0f] text-[#22c55e] border border-[rgba(34,197,94,0.2)]',
  },
  processando: {
    label: '● Processando',
    className: 'bg-[#0a1525] text-[#3b82f6] border border-[rgba(59,130,246,0.2)]',
  },
  aguardando: {
    label: '● Aguardando',
    className: 'bg-[#1c1500] text-[#f59e0b] border border-[rgba(245,158,11,0.2)]',
  },
  falhou: {
    label: '● Falhou',
    className: 'bg-[#1f0a0a] text-[#ef4444] border border-[rgba(239,68,68,0.2)]',
  },
}

export function StatusPill({ status }: StatusPillProps) {
  const { label, className } = STATUS_MAP[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.65rem] font-bold font-[Syne]',
        className
      )}
    >
      {label}
    </span>
  )
}
