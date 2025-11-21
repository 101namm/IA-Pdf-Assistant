import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { v4 as uuid } from 'uuid'
import { insertDocument } from '@/lib/db'
import { indexDocument } from '@/lib/rag'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 })
    }

    if (!file.name.endsWith('.pdf')) {
      return NextResponse.json({ error: 'Seuls les PDF sont acceptés' }, { status: 400 })
    }

    // Générer un nom unique
    const id = uuid()
    const filename = `${id}.pdf`
    const filePath = path.join(process.cwd(), 'uploads', filename)

    // Sauvegarder le fichier
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Enregistrer en base
    insertDocument({
      id,
      filename,
      original_name: file.name,
      size: file.size
    })

    // Indexer le document (extraction + embeddings)
    try {
      const chunksCount = await indexDocument(id, filename)
      return NextResponse.json({ 
        id, 
        message: `Document indexé (${chunksCount} chunks)` 
      })
    } catch (indexError: any) {
      // Le fichier est uploadé mais pas indexé
      return NextResponse.json({ 
        id, 
        warning: `Upload OK mais indexation échouée: ${indexError.message}` 
      })
    }

  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}