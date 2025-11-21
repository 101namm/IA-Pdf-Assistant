'use client'

import { useState, useRef, useEffect } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPanel({ document }: { document: any }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Reset chat quand on change de document
  useEffect(() => {
    setMessages([])
  }, [document?.id])

  const sendMessage = async () => {
    if (!input.trim() || !document || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          documentId: document.id
        })
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Erreur')
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (err: any) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Erreur: ${err.message}` 
      }])
    } finally {
      setLoading(false)
    }
  }

  if (!document) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#888'
      }}>
        <p>← Sélectionnez un document pour commencer</p>
      </div>
    )
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #eee',
        fontWeight: '500'
      }}>
        💬 Chat avec : {document.original_name}
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.length === 0 && (
          <p style={{ color: '#888', textAlign: 'center', marginTop: '40px' }}>
            Posez une question sur ce document
          </p>
        )}
        
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              padding: '12px 16px',
              borderRadius: '12px',
              background: msg.role === 'user' ? '#0070f3' : '#f0f0f0',
              color: msg.role === 'user' ? 'white' : '#333',
              whiteSpace: 'pre-wrap'
            }}
          >
            {msg.content}
          </div>
        ))}
        
        {loading && (
          <div style={{
            alignSelf: 'flex-start',
            padding: '12px 16px',
            borderRadius: '12px',
            background: '#f0f0f0',
            color: '#888'
          }}>
            Réflexion en cours...
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid #eee',
        display: 'flex',
        gap: '12px'
      }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder="Posez votre question..."
          disabled={loading}
          style={{ flex: 1 }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            padding: '8px 20px',
            background: '#0070f3',
            color: 'white',
            fontWeight: '500'
          }}
        >
          Envoyer
        </button>
      </div>
    </div>
  )
}