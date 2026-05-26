import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { MetricGrid } from '@/components/admin/MetricGrid'
import { OrdersTable } from '@/components/admin/OrdersTable'
import type { DashboardMetrics, Order } from '@/types'

// Static demo data matching the HTML exactly.
// Replace with real Supabase calls once DB is ready.
const DEMO_METRICS: DashboardMetrics = {
  totalRevenue: 4872,
  totalProfit: 1340,
  ordersToday: 47,
  revenueToday: 618,
  completed: 312,
  pending: 8,
}

const DEMO_ORDERS: Order[] = [
  {
    id: '1',
    ref: 'STC-A1B2',
    phone: '(71) 98321-7654',
    carrier: 'TIM',
    amount: 20,
    price: 14,
    profit: 3.0,
    status: 'concluido',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    ref: 'STC-C3D4',
    phone: '(11) 97654-3210',
    carrier: 'Claro',
    amount: 30,
    price: 22,
    profit: 5.5,
    status: 'processando',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    ref: 'STC-E5F6',
    phone: '(21) 99876-5432',
    carrier: 'Vivo',
    amount: 50,
    price: 36,
    profit: 8.5,
    status: 'aguardando',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    ref: 'STC-G7H8',
    phone: '(85) 98123-4567',
    carrier: 'TIM',
    amount: 15,
    price: 15,
    profit: null,
    status: 'falhou',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    ref: 'STC-I9J0',
    phone: '(31) 99234-5678',
    carrier: 'Vivo',
    amount: 100,
    price: 72,
    profit: 17.0,
    status: 'concluido',
    createdAt: new Date().toISOString(),
  },
]

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#0d0d0d]">
      <AdminTopbar />

      <div className="px-6 pt-5 pb-0 bg-[#0d0d0d]">
        <div className="font-[Syne] font-extrabold text-[1.2rem] text-[#f0f0f0]">Dashboard</div>
        <div className="text-[0.75rem] text-[#6b6b6b] mb-4">Visão geral do negócio</div>
      </div>

      <MetricGrid metrics={DEMO_METRICS} />
      <OrdersTable orders={DEMO_ORDERS} />
    </main>
  )
}
