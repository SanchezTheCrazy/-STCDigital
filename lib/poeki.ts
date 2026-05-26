import type { PoekiStatus } from '@/types'

const BASE_URL = process.env.POEKI_BASE_URL
const TOKEN = process.env.POEKI_BEARER_TOKEN

if (!BASE_URL || !TOKEN) {
  throw new Error(
    'Missing required env vars: POEKI_BASE_URL or POEKI_BEARER_TOKEN'
  )
}

function headers() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${TOKEN}`,
  }
}

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit,
  timeout = 15000
) {
  const controller = new AbortController()

  const timeoutId = setTimeout(() => {
    controller.abort()
  }, timeout)

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    })
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Poeki request timeout')
    }

    throw err
  } finally {
    clearTimeout(timeoutId)
  }
}

export interface PoekiCreatePayload {
  email: string
  type: 'RECHARGE'
  cartItems: []
  rechargeData: {
    carrierId: string
    valueId: string
    phoneNumber: string
    operatorName: string
    value: number
    cost: number
  }
}

export interface PoekiCreateResponse {
  success: boolean
  orderId: string
  pix_code: string
  status: PoekiStatus
  payment_method: string
  total_amount: number
}

export interface PoekiStatusResponse {
  orderId: string
  status: PoekiStatus
  pix_code: string
}

export async function poekiCreateOrder(
  payload: PoekiCreatePayload
): Promise<PoekiCreateResponse> {
  const res = await fetchWithTimeout(
    `${BASE_URL}/api/orders`,
    {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(payload),
      cache: 'no-store',
    },
    15000
  )

  if (!res.ok) {
    const text = await res.text()

    throw new Error(
      `Poeki create failed (${res.status}): ${text}`
    )
  }

  const data = await res.json()

  if (
    !data ||
    !data.success ||
    !data.orderId ||
    !data.pix_code ||
    !data.status
  ) {
    throw new Error(
      'Invalid response from Poeki create order endpoint'
    )
  }

  return data as PoekiCreateResponse
}

export async function poekiGetStatus(
  orderId: string
): Promise<PoekiStatusResponse> {
  const res = await fetchWithTimeout(
    `${BASE_URL}/api/orders/${orderId}`,
    {
      method: 'GET',
      headers: headers(),
      cache: 'no-store',
    },
    15000
  )

  if (!res.ok) {
    const text = await res.text()

    throw new Error(
      `Poeki status failed (${res.status}): ${text}`
    )
  }

  const data = await res.json()

  if (!data || !data.orderId || !data.status) {
    throw new Error(
      'Invalid response from Poeki status endpoint'
    )
  }

  return data as PoekiStatusResponse
}