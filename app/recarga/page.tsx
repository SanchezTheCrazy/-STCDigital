import Link from 'next/link'
import { RechargeWidget } from '@/components/sections/RechargeWidget'

export default function RecargaPage() {
  return (
    <main className="min-h-screen bg-[#080808]">
      {/* Minimal topbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#1c1c1c]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#c9a84c] to-[#e2c87a] flex items-center justify-center text-sm">
            ⚡
          </div>
          <span className="font-[Syne] font-extrabold text-base text-[#f0f0f0]">
            STC<span className="gold-text">Digital</span>
          </span>
        </Link>
        <Link href="/" className="text-[0.8rem] text-[#6b6b6b]">
          ← Voltar
        </Link>
      </div>

      <div className="px-6 py-8">
        <div className="text-center mb-6">
          <div className="label">Recarga de celular</div>
          <h1 className="font-[Syne] text-[1.6rem] font-extrabold text-[#f0f0f0] leading-tight">
            Faça sua recarga
          </h1>
          <p className="text-[0.85rem] text-[#6b6b6b] mt-1">
            TIM, Claro e Vivo · Pagamento via PIX
          </p>
        </div>
        <RechargeWidget />
      </div>
    </main>
  )
}
