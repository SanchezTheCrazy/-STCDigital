'use client'

import { motion } from 'framer-motion'

const TRUST_ITEMS = [
  {
    icon: '🔒',
    title: 'Pagamento seguro',
    desc: 'Transações exclusivas via PIX com confirmação instantânea.',
  },
  {
    icon: '🕐',
    title: 'Até 24h ou reembolso',
    desc: 'Se sua recarga não processar em 24h, devolvemos o valor.',
  },
  {
    icon: '⚡',
    title: 'Recarga imediata',
    desc: 'Na maioria dos casos, o crédito chega em minutos.',
  },
  {
    icon: '💬',
    title: 'Suporte real',
    desc: 'Atendimento via WhatsApp com resposta rápida e humana.',
  },
]

export function TrustSection() {
  return (
    <section className="px-6 py-8 border-b border-[#1c1c1c] bg-[#0d0d0d]">
      <div className="text-center mb-5">
        <div className="label">Por que escolher a STC Digital</div>
        <h2 className="font-[Syne] text-[1.4rem] font-extrabold text-[#f0f0f0]">
          Simples, seguro e confiável
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2.5">
        {TRUST_ITEMS.map((item, i) => (
          <motion.div
            key={item.title}
            className="bg-[#111111] border border-[#1c1c1c] rounded-2xl p-3.5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
          >
            <div className="w-9 h-9 rounded-[10px] bg-[#1c1c1c] border border-[#2e2e2e] flex items-center justify-center mb-2.5 text-base">
              {item.icon}
            </div>
            <div className="font-[Syne] font-bold text-[0.82rem] mb-1 text-[#f0f0f0]">
              {item.title}
            </div>
            <div className="text-[0.75rem] text-[#6b6b6b] leading-[1.5]">{item.desc}</div>
          </motion.div>
        ))}
      </div>

      {/* Guarantee banner */}
      <div className="bg-[#0a1f0f] border border-[rgba(34,197,94,0.2)] rounded-2xl p-4 flex items-center gap-3 mt-2.5">
        <div className="w-11 h-11 rounded-full bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.2)] flex items-center justify-center text-xl shrink-0">
          🕐
        </div>
        <div>
          <div className="font-[Syne] font-extrabold text-[0.95rem] text-[#f0f0f0] mb-0.5">
            Garantia de 24 horas
          </div>
          <div className="text-[0.78rem] text-[#b8b8b8]">
            Recarga não processada? Reembolso integral. Sem perguntas.
          </div>
        </div>
      </div>
    </section>
  )
}
