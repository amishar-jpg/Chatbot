import React from 'react'
import clsx from 'clsx'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

function Time({ ts, isUser }) {
  try {
    const d = new Date(ts)
    return <span className={clsx('text-xs ml-2', isUser ? 'text-indigo-100' : 'text-gray-400')}>{d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
  } catch { return null }
}

export default function Message({ message }) {
  const isUser = message.sender === 'user'
  if (message.typing) {
    return (
      <div className="flex items-start gap-3 animate-fade-in">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-md shadow-sm max-w-[75%]">
          <div className="flex items-center space-x-2">
            <div className="dot-waves"><span></span><span></span><span></span></div>
            <span className="text-sm text-gray-600">AI is thinking...</span>
          </div>
        </div>
      </div>
    )
  }

  // Render message.text as Markdown for bot messages; user messages remain plain text
  const html = !isUser ? DOMPurify.sanitize(marked.parse(message.text || '')) : null

  return (
    <div className={clsx('flex items-start gap-3 animate-fade-in', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      )}
      <div className={clsx('px-4 py-3 rounded-2xl max-w-[75%] shadow-sm transition-all hover:shadow-md', 
        isUser 
          ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-tr-md' 
          : 'bg-white border border-gray-100 text-gray-800 rounded-tl-md'
      )}>
        {isUser ? (
          <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</div>
        ) : (
          <div className="markdown-content text-sm" dangerouslySetInnerHTML={{ __html: html }} />
        )}
        <div className="flex items-center justify-end mt-2">
          <Time ts={message.timestamp} isUser={isUser} />
        </div>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
    </div>
  )
}
