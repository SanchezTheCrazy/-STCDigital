import { Topbar } from '@/components/ui/Topbar'
import { HeroSection } from '@/components/sections/HeroSection'
import { TrustSection } from '@/components/sections/TrustSection'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#080808]">
      <div className="px-6 py-6">
        <Topbar />
      </div>
      <HeroSection />
      <TrustSection />
    </main>
  )
}
