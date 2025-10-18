export async function sendToApi(text, options = {}) {
  const body = { text }
  if (options.messages) body.messages = options.messages
  if (options.model) body.model = options.model

  const resp = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}))
    throw new Error(err.error || 'API error')
  }
  const data = await resp.json()
  return data.reply
}
