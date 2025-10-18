import React, { useState, useEffect } from 'react'

export default function ChatInput({ onSend, disabled, onClear }) {
  const [text, setText] = useState('')

  useEffect(() => {
    // no-op: bot replies are shown only in the message list
    return undefined
  }, [])

  const submit = (e) => {
    e?.preventDefault()
    if (!text.trim()) return
    onSend(text)
    setText('')
  }

  return (
    <form onSubmit={submit} className="card p-4 rounded-2xl flex items-center gap-3 shadow-lg">
      <button 
        type="button" 
        onClick={onClear} 
        className="p-2.5 rounded-xl hover:bg-red-50 text-red-500 transition-all hover:scale-105 flex-shrink-0"
        title="Clear chat history"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
      <div className="flex-1 relative">
        <input
          aria-label="Type a message"
          placeholder="Type your message here..."
          className="w-full bg-gray-50 outline-none text-gray-800 placeholder:text-gray-400 px-4 py-3 rounded-xl border-2 border-transparent focus:border-indigo-300 focus:bg-white transition-all"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) submit(e) }}
        />
      </div>
      <button 
        type="submit" 
        disabled={disabled || !text.trim()} 
        className="bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-3 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 font-medium flex-shrink-0"
      >
        {disabled ? (
          <>
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="hidden sm:inline">Sending...</span>
          </>
        ) : (
          <>
            <span className="hidden sm:inline">Send</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </>
        )}
      </button>
    </form>
  )
}
