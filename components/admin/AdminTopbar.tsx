'use client'

export function AdminTopbar() {
  return (
    <div className="bg-[#0d0d0d] border-b border-[#1c1c1c] px-6 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#c9a84c] to-[#e2c87a] flex items-center justify-center text-sm text-[#080808]">
          ⚡
        </div>
        <span className="font-[Syne] font-extrabold text-[0.9rem] text-[#f0f0f0]">
          STC<span className="gold-text">Digital</span>
        </span>
        <span className="text-[#6b6b6b] text-[0.8rem]">/ Admin</span>
      </div>
      <div className="flex gap-2.5">
        <button className="text-[0.75rem] text-[#6b6b6b]">↺ Atualizar</button>
        <button className="text-[0.75rem] text-[#6b6b6b]">↗ Sair</button>
      </div>
    </div>
  )
}
