import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001
const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_API_URL = process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions'

app.use(cors())
app.use(bodyParser.json())

app.post('/api/chat', async (req, res) => {
  const { text, messages, model } = req.body || {}
  if (!text && (!Array.isArray(messages) || messages.length === 0)) return res.status(400).json({ error: 'No text or messages provided' })
  if (!GROQ_API_KEY) return res.status(500).json({ error: 'GROQ_API_KEY not configured' })

  const convo = Array.isArray(messages) && messages.length > 0 ? messages : [{ role: 'user', content: text }]
  // Prepend a system message asking the model to reply in Markdown format
  const systemInstruction = { role: 'system', content: 'Respond using Markdown formatting only. Use headings, lists, code blocks, and inline formatting where appropriate.' }
  const groqMessages = [systemInstruction, ...convo]
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({ model: model || 'llama-3.3-70b-versatile', messages: groqMessages })
    })

    if (!response.ok) {
      const errText = await response.text().catch(() => '')
      return res.status(response.status).json({ error: 'Provider error', detail: errText })
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || null
    return res.json({ reply, raw: data })
  } catch (err) {
    console.error('Error calling Groq:', err)
    return res.status(502).json({ error: 'AI provider error', detail: err.message })
  }
})

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`))
