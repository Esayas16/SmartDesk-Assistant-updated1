import { CheckCircle2, AlertCircle, SkipForward } from 'lucide-react'
import StepIllustration from './diagrams/StepIllustration'
import ProgressIndicator from './ProgressIndicator'

export default function DiagnosticStep({
  step, stepIndex, totalSteps, visualGuide, onSolved, onNotWorking, onSkip,
}) {
  return (
    <div className="rounded-xl border border-line bg-panel/60 p-6">
      <ProgressIndicator current={stepIndex + 1} total={totalSteps} />

      <h2 className="font-display text-lg font-semibold text-text mt-5 mb-2">{step.title}</h2>
      <p className="text-sm text-text-dim leading-relaxed mb-5">{step.instruction}</p>

      <div className="mb-6">
        <StepIllustration visualGuide={visualGuide} stepIndex={stepIndex} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onSolved}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-ok/10 border border-ok/30 text-ok text-sm font-medium py-3 hover:bg-ok/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ok"
        >
          <CheckCircle2 size={16} /> Problem Solved
        </button>
        <button
          onClick={onNotWorking}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-cyan/10 border border-cyan/30 text-cyan text-sm font-medium py-3 hover:bg-cyan/20 hover:glow-ring transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
        >
          <AlertCircle size={16} /> Still Not Working
        </button>
        <button
          onClick={onSkip}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-line text-text-dim text-sm font-medium py-3 px-5 hover:text-text hover:border-text-faint transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
        >
          <SkipForward size={16} /> Skip
        </button>
      </div>
    </div>
  )
}
