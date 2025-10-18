import React, { useEffect, useState } from 'react'
import ChatWindow from './components/ChatWindow'
import ChatInput from './components/ChatInput'
import { sendToApi } from './api/apiClient'

export default function App() {
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem('chat_messages')
      return raw ? JSON.parse(raw) : []
    } catch (e) {
      return []
    }
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    localStorage.setItem('chat_messages', JSON.stringify(messages))
  }, [messages])

  const handleSend = async (text) => {
    if (!text.trim()) return
    const userMsg = { id: Date.now() + '-user', sender: 'user', text, timestamp: new Date().toISOString() }
    setMessages((m) => [...m, userMsg])
    setLoading(true)

    // show typing indicator
    const typingMsg = { id: Date.now() + '-typing', sender: 'bot', text: 'typing', typing: true, timestamp: new Date().toISOString() }
    setMessages((m) => [...m, typingMsg])

    try {
      // Build conversation (map local messages to role/content)
      const convo = [...messages, userMsg].map((m) => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }))
      const botText = await sendToApi(null, { messages: convo, model: 'llama-3.3-70b-versatile' })
  setMessages((m) => m.filter((x) => !x.typing).concat({ id: Date.now() + '-bot', sender: 'bot', text: botText, timestamp: new Date().toISOString() }))
    } catch (err) {
      setMessages((m) => m.filter((x) => !x.typing).concat({ id: Date.now() + '-bot-err', sender: 'bot', text: "Sorry, I couldn't reach the AI right now.", timestamp: new Date().toISOString() }))
    } finally {
      setLoading(false)
    }
  }

  const clearHistory = () => setMessages([])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-4xl h-[92vh] flex flex-col">
        {/* Enhanced Header */}
        <div className="card rounded-2xl p-5 flex items-center justify-between mb-4 shadow-lg transition-all hover:shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">AI Assistant</h1>
              <p className="text-xs text-gray-500">Powered by Groq</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-700">Online</span>
            </div>
          </div>
        </div>

        <ChatWindow messages={messages} />

        <ChatInput onSend={handleSend} disabled={loading} onClear={clearHistory} />
      </div>
    </div>
  )
}
