const OLLAMA_BASE_URL = process.env.OLLAMA_URL || 'http://localhost:11434'
const LLM_MODEL = process.env.LLM_MODEL || 'mistral'
const EMBED_MODEL = process.env.EMBED_MODEL || 'nomic-embed-text'

export async function generateResponse(prompt: string): Promise<string> {
  const res = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: LLM_MODEL,
      prompt: prompt,
      stream: false
    })
  })

  if (!res.ok) {
    throw new Error(`Ollama error: ${res.status}`)
  }

  const data = await res.json()
  return data.response
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const res = await fetch(`${OLLAMA_BASE_URL}/api/embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: EMBED_MODEL,
      prompt: text
    })
  })

  if (!res.ok) {
    throw new Error(`Ollama embedding error: ${res.status}`)
  }

  const data = await res.json()
  return data.embedding
}

export async function checkOllama(): Promise<boolean> {
  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`)
    return res.ok
  } catch {
    return false
  }
}