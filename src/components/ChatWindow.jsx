import React, { useEffect, useRef } from 'react'
import Message from './Message'

export default function ChatWindow({ messages = [] }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages])

  return (
    <div ref={ref} className="flex-1 overflow-y-auto p-6 card rounded-2xl mb-4 shadow-lg">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Start a Conversation</h3>
          <p className="text-sm text-gray-500 max-w-sm">Ask me anything! I'm here to help with your questions.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <Message key={m.id} message={m} />
          ))}
        </div>
      )}
    </div>
  )
}
