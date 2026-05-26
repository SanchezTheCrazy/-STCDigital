import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Carrier, RechargeValue, PoekiStatus, OrderStatus } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }
  return raw
}

export function detectCarrier(phone: string): Carrier {
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 11) return null
  const prefix = parseInt(digits.slice(2, 4))

  // TIM: 97,98,99 / Claro: 95,96 / Vivo: 91-94 / Oi: 90
  if ([97, 98, 99].includes(prefix)) return 'TIM'
  if ([95, 96].includes(prefix)) return 'Claro'
  if ([91, 92, 93, 94].includes(prefix)) return 'Vivo'
  if (prefix === 90) return 'Oi'

  // Fallback deterministic by DDD parity
  const ddd = parseInt(digits.slice(0, 2))
  const carriers: Carrier[] = ['TIM', 'Claro', 'Vivo']
  return carriers[ddd % 3]
}

export const CARRIER_COLORS: Record<string, string> = {
  TIM: '#00a8e0',
  Claro: '#e02020',
  Vivo: '#9b2bd4',
  Oi: '#ffb300',
}

// carrierId and valueId must match what Poeki provider expects.
// cost = provider cost (what you pay); price = customer price (what they pay).
export const RECHARGE_VALUES: RechargeValue[] = [
  { recharge: 10, price: 10, carrierId: 'tim', valueId: '10', cost: 7 },
  { recharge: 15, price: 15, carrierId: 'tim', valueId: '15', cost: 10 },
  { recharge: 20, price: 14, carrierId: 'tim', valueId: '20', cost: 11 },
  { recharge: 30, price: 22, carrierId: 'tim', valueId: '30', cost: 16 },
  { recharge: 50, price: 36, carrierId: 'tim', valueId: '50', cost: 26 },
]

// Returns RECHARGE_VALUES filtered/adjusted for the detected carrier
export function getValuesForCarrier(carrier: Carrier): RechargeValue[] {
  if (!carrier) return []
  const id = carrier.toLowerCase()
  return RECHARGE_VALUES.map((v) => ({ ...v, carrierId: id }))
}

// Maps Poeki statuses to internal OrderStatus
export function mapPoekiStatus(status: PoekiStatus): OrderStatus {
  switch (status) {
    case 'COMPLETED':
      return 'concluido'
    case 'PROCESSING':
    case 'PAID':
      return 'processando'
    case 'CREATED':
    case 'PENDING':
      return 'aguardando'
    case 'FAILED':
      return 'falhou'
    default:
      return 'aguardando'
  }
}
