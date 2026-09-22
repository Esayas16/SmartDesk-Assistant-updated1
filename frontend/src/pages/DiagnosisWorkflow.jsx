import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom'
import { ChevronLeft, CheckCircle2, AlertTriangle, Bot, Ticket, RotateCcw } from 'lucide-react'
import { getIssue } from '../data/issues'
import { categoryLabel } from '../services/knowledgeBaseService'
import { addHistoryEntry } from '../services/historyService'
import { useApp } from '../hooks/AppContext'
import { useToast } from '../hooks/useToast'
import DiagnosticStep from '../components/DiagnosticStep'

export default function DiagnosisWorkflow() {
  const { issueId } = useParams()
  const navigate = useNavigate()
  const { online, settings } = useApp()
  const { showToast } = useToast()
  const issue = getIssue(issueId)

  const [stepIndex, setStepIndex] = useState(0)
  const [result, setResult] = useState(null) // 'resolved' | 'unresolved' | null
  const startRef = useRef(Date.now())
  const savedRef = useRef(false)

  useEffect(() => {
    startRef.current = Date.now()
    setStepIndex(0)
    setResult(null)
    savedRef.current = false
  }, [issueId])

  useEffect(() => {
    if (!result || savedRef.current || !settings.saveHistory) return
    savedRef.current = true
    const durationSec = Math.max(1, Math.round((Date.now() - startRef.current) / 1000))
    addHistoryEntry({
      issueId: issue.id,
      issueTitle: issue.title,
      category: categoryLabel(issue.category),
      result: result === 'resolved' ? 'Resolved' : 'Escalated',
      durationSec,
      mode: online ? 'Online' : 'Offline',
    })
  }, [result]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!issue) return <Navigate to="/categories" replace />

  const totalSteps = issue.steps.length
  const step = issue.steps[stepIndex]

  const goNext = () => {
    if (stepIndex + 1 >= totalSteps) {
      setResult('unresolved')
    } else {
      setStepIndex((i) => i + 1)
    }
  }

  const restart = () => {
    startRef.current = Date.now()
    savedRef.current = false
    setStepIndex(0)
    setResult(null)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link to={`/categories/${issue.category}`} className="inline-flex items-center gap-1.5 text-text-dim hover:text-cyan text-sm transition-colors">
        <ChevronLeft size={15} /> Back to {categoryLabel(issue.category)}
      </Link>

      <div>
        <h2 className="font-display text-2xl font-semibold text-text uppercase">{issue.title}</h2>
        <p className="text-text-dim text-sm mt-1">{issue.description}</p>
      </div>

      {!result && (
        <DiagnosticStep
          step={step}
          stepIndex={stepIndex}
          totalSteps={totalSteps}
          visualGuide={issue.visualGuide}
          onSolved={() => setResult('resolved')}
          onNotWorking={goNext}
          onSkip={goNext}
        />
      )}

      {result === 'resolved' && (
        <div className="rounded-xl border border-ok/30 bg-ok/5 p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-ok/10 border border-ok/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={26} className="text-ok" />
          </div>
          <h3 className="font-display text-lg font-semibold text-text mb-1">Diagnostic Result</h3>
          <p className="text-ok font-mono text-sm uppercase tracking-wider mb-2">Problem Resolved</p>
          <p className="text-text-dim text-sm mb-6">{issue.solution}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={restart}
              className="inline-flex items-center gap-2 rounded-lg border border-line text-text-dim text-sm px-4 py-2.5 hover:text-text hover:border-text-faint transition-colors"
            >
              <RotateCcw size={15} /> Run Again
            </button>
            <button
              onClick={() => navigate('/categories')}
              className="inline-flex items-center gap-2 rounded-lg border border-cyan/30 bg-cyan/10 text-cyan text-sm px-4 py-2.5 hover:bg-cyan/20 transition-colors"
            >
              Browse More Issues
            </button>
          </div>
        </div>
      )}

      {result === 'unresolved' && (
        <div className="rounded-xl border border-warn/30 bg-warn/5 p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-warn/10 border border-warn/30 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={26} className="text-warn" />
          </div>
          <h3 className="font-display text-lg font-semibold text-text mb-1">Diagnostic Result</h3>
          <p className="text-warn font-mono text-sm uppercase tracking-wider mb-2">Problem Not Resolved</p>
          <p className="text-text-dim text-sm mb-6">
            You\u2019ve completed all offline steps. Escalate to the AI assistant or open a support ticket for further help.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/ai-assistant"
              className="inline-flex items-center gap-2 rounded-lg border border-cyan/30 bg-cyan/10 text-cyan text-sm px-4 py-2.5 hover:bg-cyan/20 hover:glow-ring transition-all"
            >
              <Bot size={15} /> Ask AI Assistant
            </Link>
            <button
              onClick={() => showToast(`Support ticket created for "${issue.title}". IT will follow up shortly.`, 'success')}
              className="inline-flex items-center gap-2 rounded-lg border border-line text-text-dim text-sm px-4 py-2.5 hover:text-text hover:border-text-faint transition-colors"
            >
              <Ticket size={15} /> Create Support Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
