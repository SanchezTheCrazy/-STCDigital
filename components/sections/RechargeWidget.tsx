'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepIndicator } from '@/components/ui/StepIndicator'
import { StatusPill } from '@/components/ui/StatusPill'
import {
  formatPhone,
  CARRIER_COLORS,
  formatCurrency,
} from '@/lib/utils'
import type { Carrier, RechargeValue, PoekiStatus } from '@/types'

const TOTAL_STEPS = 5
const POLL_INTERVAL_MS = 5000
const PIX_EXPIRY_SECONDS = 30 * 60 // 30 min

// ─── Sub-components (UI unchanged) ───────────────────────────────

function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="p-6">{children}</div>
}

function CardHead({ icon, title, sub }: { icon: string; title: string; sub: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-10 h-10 rounded-xl bg-[#1c1c1c] border border-[#2e2e2e] flex items-center justify-center text-lg shrink-0">
        {icon}
      </div>
      <div>
        <div className="font-[Syne] font-bold text-[0.95rem] text-[#f0f0f0]">{title}</div>
        <div className="text-[0.72rem] text-[#6b6b6b]">{sub}</div>
      </div>
    </div>
  )
}

// Step 1
function Step1Phone({
  phone,
  setPhone,
  carrier,
  onNext,
}: {
  phone: string
  setPhone: (v: string) => void
  carrier: Carrier
  onNext: () => void
}) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 11)
    const formatted = raw.length === 11 ? formatPhone(raw) : e.target.value
    setPhone(formatted)
  }

  return (
    <>
      <CardHead icon="📱" title="Número do celular" sub="Com DDD, somente números" />
      <input
        className="input-field"
        placeholder="(00) 00000-0000"
        value={phone}
        onChange={handleChange}
      />
      {carrier && (
        <div className="flex items-center justify-between bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl px-3.5 py-2.5 mt-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: CARRIER_COLORS[carrier] }} />
            <div>
              <div className="font-[Syne] font-bold text-[0.85rem] text-[#f0f0f0]">{carrier}</div>
              <div className="text-[0.75rem] text-[#6b6b6b]">Operadora detectada</div>
            </div>
          </div>
          <span className="text-[0.7rem] text-[#22c55e] bg-[#0a1f0f] border border-[rgba(34,197,94,0.2)] rounded-full px-2 py-0.5">
            ✓ Confirmado
          </span>
        </div>
      )}
      <button className="btn-gold w-full justify-center mt-4 py-3" disabled={!carrier} onClick={onNext}>
        Continuar →
      </button>
    </>
  )
}

// Step 2
function Step2Value({
  plans,
  carrier,
  phone,
  selected,
  setSelected,
  onBack,
  onNext,
  loading,
}: {
  plans: RechargeValue[]
  carrier: Carrier
  phone: string
  selected: RechargeValue | null
  setSelected: (v: RechargeValue) => void
  onBack: () => void
  onNext: () => void
  loading: boolean
}) {
  const values = plans

  return (
    <>
      <CardHead
        icon="🏷"
        title="Escolha o valor"
        sub={
          <>
            Recarga para{' '}
            <span style={{ color: carrier ? CARRIER_COLORS[carrier] : '#b8b8b8' }}>{carrier}</span>{' '}
            · {phone}
          </>
        }
      />
      <div className="grid grid-cols-2 gap-2 mb-4">
        {values.map((v) => {
          const isSelected = selected?.recharge === v.recharge
          return (
            <div
              key={v.recharge}
              onClick={() => setSelected(v)}
              className={`rounded-xl p-3.5 border cursor-pointer transition-all duration-150 ${
                isSelected
                  ? 'border-[rgba(201,168,76,0.6)] bg-[rgba(201,168,76,0.05)] shadow-[0_0_0_1px_rgba(201,168,76,0.2)]'
                  : 'border-[#2e2e2e] bg-[#1c1c1c] hover:border-[#3a3a3a]'
              }`}
            >
              <div className="font-[Syne] font-extrabold text-[1.25rem] text-[#f0f0f0]">
                {formatCurrency(v.recharge)}
              </div>
              <div className="text-[0.72rem] text-[#6b6b6b] mt-0.5">
                Você paga <span className="text-[#b8b8b8]">{formatCurrency(v.price)}</span>
              </div>
              {isSelected && (
                <div className="flex justify-end mt-1">
                  <div className="w-4 h-4 rounded-full bg-[#c9a84c] flex items-center justify-center text-[9px] text-[#080808] font-bold">✓</div>
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className="flex gap-2">
        <button className="btn-sec px-4 py-3" onClick={onBack} disabled={loading}>←</button>
        <button
          className="btn-gold flex-1 justify-center py-3"
          disabled={!selected || loading}
          onClick={onNext}
        >
          {loading ? 'Gerando PIX...' : 'Continuar →'}
        </button>
      </div>
    </>
  )
}

// Step 3 — PIX (real pix_code, real countdown, real polling indicator)
function Step3Pix({
  selected,
  pixCode,
  onCopy,
  copied,
  poekiStatus,
}: {
  selected: RechargeValue
  pixCode: string
  onCopy: () => void
  copied: boolean
  poekiStatus: PoekiStatus
}) {
  const [seconds, setSeconds] = useState(PIX_EXPIRY_SECONDS)

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [])

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  const statusLabel: Record<PoekiStatus, string> = {
    CREATED: 'Aguardando pagamento...',
    PENDING: 'Aguardando confirmação...',
    PAID: 'Pagamento detectado...',
    PROCESSING: 'Processando recarga...',
    COMPLETED: 'Concluído!',
    FAILED: 'Falha no pagamento',
  }

  return (
    <>
      <CardHead icon="⟳" title="Pague via PIX" sub="Copie o código e pague no seu banco" />
      <div className="text-center mb-5">
        <p className="font-[Syne] text-[2.2rem] font-extrabold gold-text">
          {formatCurrency(selected.price)}
        </p>
        <div className="text-[0.75rem] text-[#6b6b6b]">Valor total a pagar</div>
      </div>
      <div className="bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl p-3 mb-3">
        <div className="text-[0.65rem] uppercase tracking-[0.1em] text-[#6b6b6b] mb-1.5">
          Código PIX (Copia e Cola)
        </div>
        <div className="font-[DM_Mono,monospace] text-[0.7rem] text-[#b8b8b8] break-all leading-[1.5]">
          {pixCode}
        </div>
      </div>
      <button className="btn-gold w-full justify-center py-3 mb-2" onClick={onCopy}>
        {copied ? '✓ Copiado!' : '📋 Copiar código PIX'}
      </button>
      <div className="flex items-center justify-center gap-1.5 text-[0.8rem] text-[#6b6b6b] my-3">
        🕐 Expira em{' '}
        <span className="font-[DM_Mono,monospace] text-[#b8b8b8]">{mm}:{ss}</span>
      </div>
      <div className="flex items-center justify-center gap-1.5 text-[0.75rem] text-[#6b6b6b]">
        <span className="dot" />
        {statusLabel[poekiStatus] ?? 'Aguardando...'}
      </div>
    </>
  )
}

// Step 5 — Success
function StepSuccess({
  phone,
  carrier,
  selected,
  orderRef,
  completedAt,
}: {
  phone: string
  carrier: Carrier
  selected: RechargeValue
  orderRef: string
  completedAt: Date
}) {
  return (
    <>
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-[#0a1f0f] border border-[rgba(34,197,94,0.2)] flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
        <StatusPill status="concluido" />
        <p className="text-[0.8rem] text-[#6b6b6b] mt-2">Recarga realizada com sucesso</p>
      </div>
      <div className="bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl p-3.5 mb-4">
        {[
          ['Pedido', <span key="ref" className="font-[DM_Mono,monospace] text-[0.7rem] text-[#b8b8b8]">{orderRef}</span>],
          ['Operadora', <span key="c" className="font-[Syne] font-bold text-[#f0f0f0]">{carrier}</span>],
          ['Número', <span key="p" className="text-[#f0f0f0]">{phone}</span>],
          ['Você recebeu', <span key="r" className="font-[Syne] font-extrabold text-[#f0f0f0]">{formatCurrency(selected.recharge)}</span>],
          ['Você pagou', <span key="pa" className="font-[Syne] font-extrabold text-[#c9a84c]">{formatCurrency(selected.price)}</span>],
        ].map(([label, value], i, arr) => (
          <div key={i} className={`flex justify-between text-[0.8rem] py-1 ${i < arr.length - 1 ? 'border-b border-[#242424]' : ''}`}>
            <span className="text-[#6b6b6b]">{label}</span>
            {value}
          </div>
        ))}
      </div>
      <div className="bg-[#0a1f0f] border border-[rgba(34,197,94,0.2)] rounded-xl px-3 py-2.5 flex items-center gap-2 mb-3 text-[0.75rem]">
        <span>⚡</span>
        <span className="text-[#b8b8b8]">
          Recarga concluída às{' '}
          <span className="text-[#22c55e]">
            {completedAt.toLocaleDateString('pt-BR')} {completedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </span>
      </div>
      <button className="btn-sec w-full justify-center py-2.5">💬 Falar com suporte</button>
    </>
  )
}

// ─── Main Widget ──────────────────────────────────────────────────
export function RechargeWidget() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [phone, setPhone] = useState('')
  const [carrier, setCarrier] = useState<Carrier>(null)
  const [plans, setPlans] = useState<any[]>([])
  const [detecting, setDetecting] = useState(false)
  const [selected, setSelected] = useState<RechargeValue | null>(null)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  // Real order state
  const [orderId, setOrderId] = useState<string | null>(null)
  const [pixCode, setPixCode] = useState<string>('')
  const [poekiStatus, setPoekiStatus] = useState<PoekiStatus>('CREATED')
  const [completedAt, setCompletedAt] = useState<Date>(new Date())

  const [copied, setCopied] = useState(false)
  const pollRef = useRef<NodeJS.Timeout | null>(null)

  // Detect carrier from phone input
  useEffect(() => {
  async function detect() {
    const digits = phone.replace(/\D/g, '')

    if (digits.length !== 11) {
      setCarrier(null)
      setPlans([])
      return
    }

    try {
      setDetecting(true)

      const res = await fetch('/api/recharge/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: digits,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
  throw new Error(data.error)
}

setCarrier(data.carrierId?.toLowerCase() as Carrier)

let realPlans: RechargeValue[] = []

switch (data.carrierId?.toLowerCase()) {
  case 'tim':
    realPlans = [
      { recharge: 15, price: 7, cost: 7, carrierId: data.carrierId?.toLowerCase(), valueId: `${data.carrierId?.toLowerCase()}-15` },
      { recharge: 20, price: 9, cost: 9, carrierId: data.carrierId?.toLowerCase(), valueId: `${data.carrierId?.toLowerCase()}-20` },
      { recharge: 30, price: 12, cost: 12, carrierId: data.carrierId?.toLowerCase(), valueId: `${data.carrierId?.toLowerCase()}-30` },
    ]
    break

  case 'claro':
    realPlans = [
      { recharge: 20, price: 11, cost: 11, carrierId: data.carrierId?.toLowerCase(), valueId: `${data.carrierId?.toLowerCase()}-20` },
      { recharge: 25, price: 12, cost: 12, carrierId: data.carrierId?.toLowerCase(), valueId: `${data.carrierId?.toLowerCase()}-25` },
      { recharge: 30, price: 13, cost: 13, carrierId: data.carrierId?.toLowerCase(), valueId: `${data.carrierId?.toLowerCase()}-30` },
    ]
    break

  case 'vivo':
    realPlans = [
      { recharge: 15, price: 11, cost: 11, carrierId: data.carrierId?.toLowerCase(), valueId: `${data.carrierId?.toLowerCase()}-15` },
      { recharge: 20, price: 12, cost: 12, carrierId: data.carrierId?.toLowerCase(), valueId: `${data.carrierId?.toLowerCase()}-20` },
      { recharge: 25, price: 13, cost: 13, carrierId: data.carrierId?.toLowerCase(), valueId: `${data.carrierId?.toLowerCase()}-25` },
      { recharge: 30, price: 15, cost: 15, carrierId: data.carrierId?.toLowerCase(), valueId: `${data.carrierId?.toLowerCase()}-30` },
    ]
    break

  default:
    realPlans = []
}

setPlans(realPlans)

      setPlans(realPlans)
    } catch (err) {
      console.error(err)
      setCarrier(null)
      setPlans([])
    } finally {
      setDetecting(false)
    }
  }

  detect()
}, [phone])

  // Status polling — runs while on step 3, stops on terminal status
  useEffect(() => {
    if (step !== 3 || !orderId) return

    function stopPolling() {
      if (pollRef.current) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
    }

    async function poll() {
      try {
        const res = await fetch(`/api/recharge/status/${orderId}`)
        if (!res.ok) return
        const data = await res.json() as { status: PoekiStatus; pix_code: string }
        setPoekiStatus(data.status)

        if (data.status === 'COMPLETED') {
          stopPolling()
          setCompletedAt(new Date())
          setStep(5)
        } else if (data.status === 'FAILED') {
          stopPolling()
          setCreateError('Pagamento falhou. Tente novamente.')
          setStep(2)
        }
      } catch {
        // Network error — keep polling
      }
    }

    pollRef.current = setInterval(poll, POLL_INTERVAL_MS)
    return stopPolling
  }, [step, orderId])

  // Create real order when moving from step 2 → 3
  async function handleCreateOrder() {
    if (!selected || !carrier) return
    setCreating(true)
    setCreateError(null)

    try {
  const res = await fetch('/api/recharge/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
  phone,
  carrier,
  value: selected.recharge,
  cost: selected.cost,
  customerPrice: selected.price,
  email: 'cristianoddtank778@gmail.com',
}),
  })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? 'Erro ao criar pedido')
      }

      setOrderId(data.orderId)
      setPixCode(data.pix_code)
      setPoekiStatus(data.status)
      setStep(3)
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Erro ao criar pedido')
    } finally {
      setCreating(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(pixCode).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="bg-[#161616] border border-[#2e2e2e] rounded-[20px] overflow-hidden max-w-[400px] mx-auto w-full">
      {step !== 5 && <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />}

      {createError && (
        <div className="mx-6 mt-4 bg-[#1f0a0a] border border-[rgba(239,68,68,0.2)] rounded-xl px-3 py-2 text-[0.75rem] text-[#ef4444]">
          {createError}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}
        >
          <CardBody>
            {step === 1 && (
              <Step1Phone
                phone={phone}
                setPhone={setPhone}
                carrier={carrier}
                onNext={() => setStep(2)}
              />
            )}
            {step === 2 && (
              <Step2Value
                plans={plans}
                carrier={carrier}
                phone={phone}
                selected={selected}
                setSelected={setSelected}
                onBack={() => setStep(1)}
                onNext={handleCreateOrder}
                loading={creating}
              />
            )}
            {step === 3 && selected && (
              <Step3Pix
                selected={selected}
                pixCode={pixCode}
                onCopy={handleCopy}
                copied={copied}
                poekiStatus={poekiStatus}
              />
            )}
            {step === 5 && selected && (
              <StepSuccess
                phone={phone}
                carrier={carrier}
                selected={selected}
                orderRef={orderId ?? ''}
                completedAt={completedAt}
              />
            )}
          </CardBody>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
