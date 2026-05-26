import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase.server'

const POEKI_BASE_URL =
  process.env.POEKI_BASE_URL || 'https://poeki.store'

export async function GET(
  _req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params

    if (!orderId) {
      return NextResponse.json(
        { error: 'Missing orderId' },
        { status: 400 }
      )
    }

    const response = await fetch(
      `${POEKI_BASE_URL}/api/orders/${orderId}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        cache: 'no-store',
      }
    )

    const poekiRes = await response
      .json()
      .catch(() => null)

    if (!response.ok || !poekiRes) {
      return NextResponse.json(
        {
          error: `Poeki status failed (${response.status})`,
        },
        { status: 502 }
      )
    }

    const status =
      poekiRes.fulfillment_status ||
      poekiRes.status ||
      'UNKNOWN'

    // sync db
    await supabaseServer
      .from('orders')
      .update({
        status,
        external_order_id:
          poekiRes.external_order_id ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('provider_order_id', orderId)

    return NextResponse.json({
      orderId,
      status,
      fulfillment_status:
        poekiRes.fulfillment_status,
      payment_status: poekiRes.status,
      pix_code: poekiRes.pix_code,
      external_order_id:
        poekiRes.external_order_id,
      admin_notes: poekiRes.admin_notes,
    })
  } catch (err) {
    console.error('[status] error:', err)

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Internal error',
      },
      { status: 500 }
    )
  }
}