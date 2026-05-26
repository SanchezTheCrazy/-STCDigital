import { supabase } from '@/lib/supabase'
import type { Order, OrderStatus, DashboardMetrics } from '@/types'

export async function createOrder(data: {
  phone: string
  carrier: string
  amount: number
  price: number
}): Promise<Order | null> {
  const ref = `STC-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
  const profit = parseFloat(((data.amount - data.price) * 0.85).toFixed(2))

  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      ref,
      phone: data.phone,
      carrier: data.carrier,
      amount: data.amount,
      price: data.price,
      profit,
      status: 'aguardando',
    })
    .select()
    .single()

  if (error) {
    console.error('createOrder error:', error)
    return null
  }

  return order as Order
}

export async function getOrderByRef(ref: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('ref', ref)
    .single()

  if (error) return null
  return data as Order
}

export async function getRecentOrders(limit = 20): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return []
  return (data ?? []) as Order[]
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const { data: allOrders } = await supabase.from('orders').select('*')

  const orders = (allOrders ?? []) as Order[]
  const today = new Date().toISOString().slice(0, 10)

  const todayOrders = orders.filter((o) => o.createdAt?.slice(0, 10) === today)

  return {
    totalRevenue: orders.reduce((s, o) => s + (o.price ?? 0), 0),
    totalProfit: orders
      .filter((o) => o.status === 'concluido')
      .reduce((s, o) => s + (o.profit ?? 0), 0),
    ordersToday: todayOrders.length,
    revenueToday: todayOrders.reduce((s, o) => s + (o.price ?? 0), 0),
    completed: orders.filter((o) => o.status === 'concluido').length,
    pending: orders.filter((o) => o.status === 'aguardando').length,
  }
}
