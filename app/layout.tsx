import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'STC Digital — Recargas e Serviços Digitais',
  description:
    'Recargas TIM, Claro e Vivo com pagamento via PIX. Rápido, seguro e com garantia de 24 horas.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#080808] text-[#f0f0f0] font-[DM_Sans,system-ui,sans-serif] text-sm leading-[1.6] antialiased">
        {children}
      </body>
    </html>
  )
}
