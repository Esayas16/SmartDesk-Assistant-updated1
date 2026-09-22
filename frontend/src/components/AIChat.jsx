import { useEffect, useRef, useState } from 'react'
import { Send, Bot, User, PlayCircle, ImageIcon, Search } from 'lucide-react'
import { useApp } from '../hooks/AppContext'
import { routeDiagnosticRequest } from '../services/hybridAIService'
import LoadingSpinner from './LoadingSpinner'
import MessageText from './MessageText'
import { Link } from 'react-router-dom'

const SOURCE_LABEL = {
  'offline-rule-engine': 'Local Rule Engine',
  'offline-knowledge-base': 'Offline Knowledge Base',
  'mock-cloud-ai': 'Cloud AI (demo reply)',
  'cloud-ai': 'Claude AI',
}

export default function AIChat() {
  const { online } = useApp()
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hi, I\u2019m the SmartDesk AI Assistant. Describe the problem you\u2019re running into and I\u2019ll help you diagnose it.',
      source: null,
    },
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  const send = async (text) => {
    const message = (text ?? input).trim()
    if (!message || thinking) return
    // Conversation so far (skipping the greeting), so the AI has context
    // for follow-up questions like "that didn't work".
    const history = messages
      .filter((m) => m.source !== null || m.role === 'user')
      .map((m) => ({ role: m.role, content: m.text }))

    setMessages((prev) => [...prev, { role: 'user', text: message }])
    setInput('')
    setThinking(true)
    try {
      const result = await routeDiagnosticRequest(message, history)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: result.reply,
          steps: result.suggestedSteps,
          source: result.source,
          relatedIssueId: result.relatedIssueId,
        },
      ])
    } catch (err) {
      console.error('AI request failed:', err)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Sorry, something went wrong while getting a reply. Please try again.',
          source: 'offline-rule-engine',
        },
      ])
    } finally {
      setThinking(false)
    }
  }

  return (
    <div className="rounded-xl border border-line bg-panel/60 flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border ${m.role === 'user' ? 'bg-panel-2 border-line text-text-dim' : 'bg-cyan/10 border-cyan/30 text-cyan'}`}>
              {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div className={`max-w-[80%] ${m.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
              <div className={`rounded-lg px-4 py-3 text-sm leading-relaxed ${m.role === 'user' ? 'bg-panel-2 text-text border border-line' : 'bg-cyan/5 text-text border border-cyan/20'}`}>
                {m.role === 'assistant' ? <MessageText text={m.text} /> : m.text}
              </div>
              {m.source && (
                <span className="mt-1.5 font-mono text-[10px] uppercase tracking-wider text-text-faint">
                  {SOURCE_LABEL[m.source] || m.source}
                </span>
              )}
              {m.steps && m.steps.length > 0 && (
                <ol className="mt-3 space-y-1.5 text-xs text-text-dim">
                  {m.steps.map((s, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="font-mono text-cyan">{idx + 1}.</span> {s}
                    </li>
                  ))}
                </ol>
              )}
              {m.role === 'assistant' && m.relatedIssueId !== undefined && m.steps && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {m.relatedIssueId && (
                    <Link
                      to={`/diagnosis/${m.relatedIssueId}`}
                      className="inline-flex items-center gap-1.5 rounded-md border border-cyan/30 bg-cyan/10 text-cyan text-[11px] font-mono uppercase tracking-wider px-3 py-1.5 hover:bg-cyan/20 transition-colors"
                    >
                      <PlayCircle size={12} /> Run Diagnostic
                    </Link>
                  )}
                  <Link
                    to="/search"
                    className="inline-flex items-center gap-1.5 rounded-md border border-line text-text-dim text-[11px] font-mono uppercase tracking-wider px-3 py-1.5 hover:text-text hover:border-text-faint transition-colors"
                  >
                    <Search size={12} /> Search Knowledge Base
                  </Link>
                  <button
                    className="inline-flex items-center gap-1.5 rounded-md border border-line text-text-dim text-[11px] font-mono uppercase tracking-wider px-3 py-1.5 hover:text-text hover:border-text-faint transition-colors"
                  >
                    <ImageIcon size={12} /> View Visual Guide
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border bg-cyan/10 border-cyan/30 text-cyan">
              <Bot size={14} />
            </div>
            <div className="rounded-lg px-4 py-3 border border-cyan/20 bg-cyan/5">
              <LoadingSpinner label={online ? 'Consulting cloud AI' : 'Checking local rules'} />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t border-line p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Describe your problem..."
            aria-label="Message the AI assistant"
            className="flex-1 bg-panel-2 border border-line rounded-lg px-4 py-2.5 text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-cyan/50 focus:glow-ring transition-all"
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || thinking}
            aria-label="Send message"
            className="inline-flex items-center justify-center rounded-lg bg-cyan/10 border border-cyan/30 text-cyan w-11 h-11 hover:bg-cyan/20 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
