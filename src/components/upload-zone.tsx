'use client'

import { useState, useRef } from 'react'

export default function UploadZone({ 
  onUploadComplete 
}: { 
  onUploadComplete: () => void 
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    if (!file.name.endsWith('.pdf')) {
      setError('Seuls les fichiers PDF sont acceptés')
      return
    }

    setUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erreur upload')
      }

      onUploadComplete()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleUpload(file)
        }}
        style={{ display: 'none' }}
      />
      
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        style={{
          width: '100%',
          padding: '12px',
          background: '#0070f3',
          color: 'white',
          fontWeight: 'bold'
        }}
      >
        {uploading ? 'Upload en cours...' : '+ Ajouter un PDF'}
      </button>

      {error && (
        <p style={{ color: 'red', fontSize: '12px', marginTop: '8px' }}>
          {error}
        </p>
      )}
    </div>
  )
}