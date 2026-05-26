export type Carrier = 'TIM' | 'Claro' | 'Vivo' | 'Oi' | null

export type OrderStatus = 'concluido' | 'processando' | 'aguardando' | 'falhou'

// Maps Poeki provider statuses → internal
export type PoekiStatus =
  | 'CREATED'
  | 'PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'

export interface RechargeValue {
  recharge: number
  price: number
  carrierId: string   // e.g. "tim", "claro", "vivo"
  valueId: string     // e.g. "20"
  cost: number        // provider cost in reais
}

export interface Order {
  id: string
  ref: string
  phone: string
  carrier: string
  amount: number
  price: number
  profit: number | null
  status: OrderStatus
  createdAt: string
}

// Supabase row shape
export interface DBOrder {
  id: string
  provider_order_id: string
  email: string
  phone: string
  carrier: string
  value: number
  provider_cost: number
  customer_price: number
  profit: number
  pix_code: string
  status: PoekiStatus
  created_at: string
}

export interface RechargeWidgetState {
  step: 1 | 2 | 3 | 4 | 5
  phone: string
  carrier: Carrier
  selectedValue: RechargeValue | null
  pixCode: string | null
  orderId: string | null
}

export interface DashboardMetrics {
  totalRevenue: number
  totalProfit: number
  ordersToday: number
  revenueToday: number
  completed: number
  pending: number
}

// API response shapes
export interface CreateRechargeResponse {
  success: boolean
  orderId: string
  pix_code: string
  status: PoekiStatus
  payment_method: string
  total_amount: number  // cents
}

export interface StatusResponse {
  orderId: string
  status: PoekiStatus
  pix_code: string
}
