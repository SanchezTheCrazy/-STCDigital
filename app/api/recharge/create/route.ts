import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase.server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      phone,
      carrier,
      value,
      cost,
      customerPrice,
      email,
    } = body

    if (
      !phone ||
      !carrier ||
      !value ||
      !cost ||
      !customerPrice ||
      !email
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const digits = phone.replace(/\D/g, '')

    const poekiRes = await fetch(
      'https://poeki.store/api/orders',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          type: 'RECHARGE',
          cartItems: [],
          rechargeData: {
            carrierId: carrier.toLowerCase(),
            valueId: String(value),
            phoneNumber: digits,
            operatorName: carrier,
            value,
            cost,
          },
        }),
      }
    )

    const data = await poekiRes.json()

    if (!poekiRes.ok) {
      return NextResponse.json(
        {
          error: 'Poeki create failed',
          details: data,
        },
        { status: 502 }
      )
    }

    const profit = Number(
      (customerPrice - cost).toFixed(2)
    )

    const { data: row } = await supabaseServer
      .from('orders')
      .insert({
        provider_order_id: data.orderId,
        email,
        phone: digits,
        carrier,
        value,
        provider_cost: cost,
        customer_price: customerPrice,
        profit,
        pix_code: data.pix_code,
        status: data.status,
      })
      .select()
      .single()

    return NextResponse.json({
      success: true,
      orderId: data.orderId,
      pix_code: data.pix_code,
      status: data.status,
      payment_method: data.payment_method,
      total_amount: data.total_amount,
      dbId: row?.id ?? null,
    })
  } catch (err) {
    console.error('[create] error:', err)

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