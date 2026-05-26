import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { phone } = body as {
      phone: string
    }

    if (!phone) {
      return NextResponse.json(
        { error: 'Missing phone' },
        { status: 400 }
      )
    }

    const digits = phone.replace(/\D/g, '')

    // Detect operator
    const detectRes = await fetch(
      'https://poeki.store/api/recarga/detect-operator',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: digits,
        }),
      }
    )

    const detectData = await detectRes.json()

    if (!detectRes.ok) {
      return NextResponse.json(
        {
          error: 'Failed detecting operator',
          details: detectData,
        },
        { status: 502 }
      )
    }

    const carrierId =
      detectData?.carrierId ||
      detectData?.operator ||
      detectData?.carrier ||
      null

    if (!carrierId) {
      return NextResponse.json(
        { error: 'Carrier not found' },
        { status: 404 }
      )
    }

    // Check phone / get plans
    const plansRes = await fetch(
      'https://poeki.store/api/recarga/check-phone',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: digits,
          carrierId,
        }),
      }
    )

    const plansData = await plansRes.json()

    if (!plansRes.ok) {
      return NextResponse.json(
        {
          error: 'Failed fetching plans',
          details: plansData,
        },
        { status: 502 }
      )
    }

    return NextResponse.json({
      success: true,
      carrier: carrierId.toUpperCase(),
      carrierId,
      plans:
        plansData?.values ||
        plansData?.plans ||
        plansData?.data ||
        [],
    })
  } catch (err) {
    console.error('[detect] error:', err)

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