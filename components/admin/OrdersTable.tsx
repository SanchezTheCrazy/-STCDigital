'use client'

import { StatusPill } from '@/components/ui/StatusPill'
import { formatCurrency } from '@/lib/utils'
import type { Order } from '@/types'

interface OrdersTableProps {
  orders: Order[]
}

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <div className="bg-[#0d0d0d] border-t border-[#1c1c1c]">
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#1c1c1c]">
        <div className="font-[Syne] font-bold text-[0.85rem] text-[#f0f0f0]">
          📦 Pedidos recentes
        </div>
        <div className="text-[0.7rem] text-[#6b6b6b]">20 últimos</div>
      </div>
      <div className="overflow-x-auto">
        {/* Header row */}
        <div className="grid grid-cols-[80px_100px_50px_70px_50px_auto] gap-2 items-center px-6 py-2.5 bg-[#111] text-[#6b6b6b] text-[0.65rem] uppercase tracking-[0.08em] font-[Syne] font-bold border-b border-[#1c1c1c]">
          <span>Pedido</span>
          <span>Número</span>
          <span>Op.</span>
          <span>Valor</span>
          <span>Lucro</span>
          <span>Status</span>
        </div>

        {orders.map((order, i) => (
          <div
            key={order.id ?? order.ref}
            className={`grid grid-cols-[80px_100px_50px_70px_50px_auto] gap-2 items-center px-6 py-2.5 border-b border-[#111] text-[0.75rem] ${
              i % 2 === 1 ? 'bg-[#0d0d0d]' : 'bg-transparent'
            }`}
          >
            <span className="font-[DM_Mono,monospace] text-[0.65rem] text-[#b8b8b8]">
              {order.ref}
            </span>
            <span className="text-[#b8b8b8]">{order.phone}</span>
            <span className="text-[#b8b8b8]">{order.carrier}</span>
            <span className="font-[Syne] font-bold text-[#f0f0f0]">
              {formatCurrency(order.amount)}
            </span>
            <span className="font-[Syne] font-semibold text-[#22c55e]">
              {order.profit != null ? formatCurrency(order.profit) : '—'}
            </span>
            <StatusPill status={order.status} />
          </div>
        ))}
      </div>
    </div>
  )
}
