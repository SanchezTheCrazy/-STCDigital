'use client'

import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/utils'
import type { DashboardMetrics } from '@/types'

interface MetricGridProps {
  metrics: DashboardMetrics
}

const METRICS_CONFIG = (m: DashboardMetrics) => [
  {
    label: 'Receita total',
    value: formatCurrency(m.totalRevenue),
    className: 'bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.15)]',
    labelColor: 'text-[#c9a84c]',
    valueColor: 'text-[#c9a84c]',
  },
  {
    label: 'Lucro total',
    value: formatCurrency(m.totalProfit),
    className: 'bg-[#0a1f0f] border border-[rgba(34,197,94,0.15)]',
    labelColor: 'text-[#22c55e]',
    valueColor: 'text-[#22c55e]',
  },
  {
    label: 'Pedidos hoje',
    value: String(m.ordersToday),
    className: 'bg-[#0a1525] border border-[rgba(59,130,246,0.15)]',
    labelColor: 'text-[#3b82f6]',
    valueColor: 'text-[#3b82f6]',
  },
  {
    label: 'Receita hoje',
    value: formatCurrency(m.revenueToday),
    className: 'bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.15)]',
    labelColor: 'text-[#c9a84c]',
    valueColor: 'text-[#c9a84c]',
  },
  {
    label: 'Concluídos',
    value: String(m.completed),
    className: 'bg-[#0a1f0f] border border-[rgba(34,197,94,0.15)]',
    labelColor: 'text-[#22c55e]',
    valueColor: 'text-[#22c55e]',
  },
  {
    label: 'Pendentes',
    value: String(m.pending),
    className: 'bg-[#1c1500] border border-[rgba(245,158,11,0.15)]',
    labelColor: 'text-[#f59e0b]',
    valueColor: 'text-[#f59e0b]',
  },
]

export function MetricGrid({ metrics }: MetricGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2 p-6 bg-[#0d0d0d]">
      {METRICS_CONFIG(metrics).map((m, i) => (
        <motion.div
          key={m.label}
          className={`rounded-2xl p-3.5 ${m.className}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
        >
          <div
            className={`text-[0.65rem] tracking-[0.1em] uppercase font-[Syne] font-bold mb-1.5 ${m.labelColor}`}
          >
            {m.label}
          </div>
          <div className={`font-[Syne] text-[1.4rem] font-extrabold ${m.valueColor}`}>
            {m.value}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
