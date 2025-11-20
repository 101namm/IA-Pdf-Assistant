'use client'

import { useState } from 'react'
import UploadZone from '@/components/upload-zone'
import DocumentList from '@/components/document-list'
import ChatPanel from '@/components/chat-panel'

export default function Home() {
  const [documents, setDocuments] = useState<any[]>([])
  const [selectedDoc, setSelectedDoc] = useState<any>(null)

  const refreshDocuments = async () => {
    const res = await fetch('/api/documents')
    const data = await res.json()
    setDocuments(data)
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      gap: '1px',
      background: '#e0e0e0'
    }}>
      {/* Panneau gauche - Documents */}
      <div style={{
        width: '300px',
        background: 'white',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>
          📄 PDF Assistant
        </h1>
        
        <UploadZone onUploadComplete={refreshDocuments} />
        
        <DocumentList 
          documents={documents}
          selectedId={selectedDoc?.id}
          onSelect={setSelectedDoc}
          onRefresh={refreshDocuments}
        />
      </div>

      {/* Panneau droit - Chat */}
      <div style={{
        flex: 1,
        background: 'white',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <ChatPanel document={selectedDoc} />
      </div>
    </div>
  )
}