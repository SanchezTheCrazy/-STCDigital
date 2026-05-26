'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export function HeroSection() {
  return (
    <section className="px-6 py-8 border-b border-[#1c1c1c] bg-[#080808]">
      <div className="max-w-[480px]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="badge mb-4">
            <span className="dot" />
            Plataforma operacional
          </div>
        </motion.div>

        <motion.h1
          className="font-[Syne] text-[2.2rem] font-extrabold leading-[1.05] tracking-[-0.02em] mb-3 text-[#f0f0f0]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
        >
          Créditos e serviços<br />
          digitais com <span className="gold-text">segurança</span>
          <br />e praticidade.
        </motion.h1>

        <motion.p
          className="text-[#b8b8b8] text-[0.9rem] leading-[1.7] mb-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          Recargas TIM, Claro e Vivo, painéis e serviços digitais com atendimento confiável.
        </motion.p>

        <motion.div
          className="flex gap-2.5 mb-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
        >
          <Link href="/recarga">
            <button className="btn-gold">Fazer Recarga →</button>
          </Link>
          <button className="btn-sec">Consultar Serviços</button>
        </motion.div>

        <motion.div
          className="flex gap-4 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.22 }}
        >
          <div className="flex items-center gap-1.5 text-[0.8rem] text-[#6b6b6b]">
            <span className="text-[#c9a84c] text-sm">🔒</span>
            Pagamento 100% seguro
          </div>
          <div className="flex items-center gap-1.5 text-[0.8rem] text-[#6b6b6b]">
            <span className="text-[#c9a84c] text-sm">⚡</span>
            Recarga imediata
          </div>
          <div className="flex items-center gap-1.5 text-[0.8rem] text-[#6b6b6b]">
            <span className="text-[#c9a84c] text-sm">🕐</span>
            Reembolso em até 24h
          </div>
        </motion.div>
      </div>
    </section>
  )
}
