import { Fragment } from 'react'

// Tiny, dependency-free renderer for the markdown subset AI replies use:
// paragraphs, numbered / bulleted lists, **bold**, `inline code`, ``` code
// blocks ``` and # headings. It builds React elements (never raw HTML), so
// model output can't inject markup into the page.

function renderInline(text) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={i} className="font-semibold text-text">{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code key={i} className="font-mono text-[0.85em] px-1.5 py-0.5 rounded bg-panel-2 border border-line text-cyan">
          {part.slice(1, -1)}
        </code>
      )
    }
    return <Fragment key={i}>{part}</Fragment>
  })
}

function parseBlocks(text) {
  const blocks = []
  let paragraph = []
  let list = null
  let code = null

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ type: 'p', text: paragraph.join(' ') })
    paragraph = []
  }
  const flushList = () => {
    if (list) blocks.push(list)
    list = null
  }

  for (const line of text.split('\n')) {
    if (line.trim().startsWith('```')) {
      if (code) {
        blocks.push({ type: 'code', text: code.join('\n') })
        code = null
      } else {
        flushParagraph()
        flushList()
        code = []
      }
      continue
    }
    if (code) {
      code.push(line)
      continue
    }

    const ordered = line.match(/^\s*\d+[.)]\s+(.*)/)
    const bullet = line.match(/^\s*[-*\u2022]\s+(.*)/)
    const heading = line.match(/^\s*#{1,4}\s+(.*)/)

    if (ordered || bullet) {
      flushParagraph()
      const type = ordered ? 'ol' : 'ul'
      if (!list || list.type !== type) {
        flushList()
        list = { type, items: [] }
      }
      list.items.push((ordered || bullet)[1])
    } else if (heading) {
      flushParagraph()
      flushList()
      blocks.push({ type: 'h', text: heading[1] })
    } else if (!line.trim()) {
      flushParagraph()
      flushList()
    } else {
      flushList()
      paragraph.push(line.trim())
    }
  }
  if (code) blocks.push({ type: 'code', text: code.join('\n') })
  flushParagraph()
  flushList()
  return blocks
}

export default function MessageText({ text }) {
  const blocks = parseBlocks(text || '')

  return (
    <div className="space-y-2.5">
      {blocks.map((b, i) => {
        if (b.type === 'ol') {
          return (
            <ol key={i} className="space-y-1.5">
              {b.items.map((item, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="font-mono text-cyan shrink-0">{idx + 1}.</span>
                  <span>{renderInline(item)}</span>
                </li>
              ))}
            </ol>
          )
        }
        if (b.type === 'ul') {
          return (
            <ul key={i} className="space-y-1.5">
              {b.items.map((item, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-cyan shrink-0">&bull;</span>
                  <span>{renderInline(item)}</span>
                </li>
              ))}
            </ul>
          )
        }
        if (b.type === 'code') {
          return (
            <pre key={i} className="overflow-x-auto rounded-md bg-panel-2 border border-line p-3 font-mono text-xs text-cyan">
              {b.text}
            </pre>
          )
        }
        if (b.type === 'h') {
          return <p key={i} className="font-semibold text-text">{renderInline(b.text)}</p>
        }
        return <p key={i}>{renderInline(b.text)}</p>
      })}
    </div>
  )
}
