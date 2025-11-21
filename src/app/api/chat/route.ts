import { NextRequest, NextResponse } from 'next/server'
import { getDocument } from '@/lib/db'
import { queryDocument } from '@/lib/rag'

export async function POST(request: NextRequest) {
  try {
    const { message, documentId } = await request.json()

    if (!message || !documentId) {
      return NextResponse.json(
        { error: 'Message et documentId requis' }, 
        { status: 400 }
      )
    }

    // Vérifier que le document existe
    const doc = getDocument(documentId)
    if (!doc) {
      return NextResponse.json(
        { error: 'Document non trouvé' }, 
        { status: 404 }
      )
    }

    // Générer la réponse via RAG
    const response = await queryDocument(documentId, message)

    return NextResponse.json({ response })

  } catch (error: any) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}