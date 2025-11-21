'use client'

import { useEffect } from 'react'

export default function DocumentList({
  documents,
  selectedId,
  onSelect,
  onRefresh
}: {
  documents: any[]
  selectedId?: string
  onSelect: (doc: any) => void
  onRefresh: () => void
}) {
  useEffect(() => {
    onRefresh()
  }, [])

  if (documents.length === 0) {
    return (
      <p style={{ color: '#888', fontSize: '14px', textAlign: 'center' }}>
        Aucun document
      </p>
    )
  }

  return (
    <div style={{ 
      flex: 1, 
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      {documents.map((doc) => (
        <div
          key={doc.id}
          onClick={() => onSelect(doc)}
          style={{
            padding: '12px',
            borderRadius: '6px',
            cursor: 'pointer',
            background: selectedId === doc.id ? '#e3f2fd' : '#f5f5f5',
            border: selectedId === doc.id ? '2px solid #0070f3' : '2px solid transparent'
          }}
        >
          <p style={{ 
            fontSize: '14px', 
            fontWeight: '500',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {doc.original_name}
          </p>
          <p style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
            {(doc.size / 1024).toFixed(1)} Ko
          </p>
        </div>
      ))}
    </div>
  )
}