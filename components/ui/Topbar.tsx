'use client'

import Link from 'next/link'

export function Topbar() {
  return (
    <div className="flex items-center justify-between mb-10">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-[30px] h-[30px] rounded-lg bg-gradient-to-br from-[#c9a84c] to-[#e2c87a] flex items-center justify-center text-sm">
          ⚡
        </div>
        <span className="font-[Syne] font-extrabold text-base text-[#f0f0f0]">
          STC<span className="gold-text">Digital</span>
        </span>
      </Link>
      <div className="flex gap-6 items-center">
        <span className="text-[0.8rem] text-[#6b6b6b]">Serviços</span>
        <span className="text-[0.8rem] text-[#6b6b6b]">Como funciona</span>
        <Link href="/recarga">
          <button className="btn-gold text-[0.75rem] py-[7px] px-4">
            Fazer Recarga
          </button>
        </Link>
      </div>
    </div>
  )
}
