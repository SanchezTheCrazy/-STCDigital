export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#080808] text-white px-6">
      <div className="text-center max-w-xl">
        <h1 className="text-4xl font-bold mb-4">
          STC Digital em manutenção
        </h1>

        <p className="text-zinc-300 text-lg">
          Nosso sistema de pagamentos está temporariamente indisponível.
          Para evitar problemas com recargas, novas compras foram pausadas.
        </p>

        <p className="text-zinc-500 mt-5 text-sm">
          Estamos resolvendo isso e voltaremos em breve.
        </p>
      </div>
    </main>
  )
}