'use client'

import { cn } from '@/lib/utils'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-1.5 py-3 border-b border-[#1c1c1c]">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1
        const isDone = step < currentStep
        const isActive = step === currentStep

        return (
          <div key={step} className="flex items-center gap-1.5">
            <div
              className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold font-[Syne]',
                isDone && 'bg-[#c9a84c] text-[#080808]',
                isActive &&
                  'bg-[rgba(201,168,76,0.15)] border border-[#c9a84c] text-[#c9a84c]',
                !isDone && !isActive && 'bg-[#1c1c1c] border border-[#2e2e2e] text-[#6b6b6b]'
              )}
            >
              {isDone ? '✓' : step}
            </div>
            {step < totalSteps && (
              <div
                className={cn(
                  'w-5 h-px',
                  isDone ? 'bg-[#c9a84c]' : 'bg-[#2e2e2e]'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
