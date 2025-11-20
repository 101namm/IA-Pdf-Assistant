import { generateEmbedding, generateResponse } from './ollama'
import { extractTextFromPdf, chunkText } from './pdf-parser'
import { markAsIndexed, insertChunk, getChunksByDocument } from './db'
import path from 'path'

// Calcul de similarité cosinus
function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0
  let normA = 0
  let normB = 0
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

export async function indexDocument(documentId: string, filename: string) {
  const filePath = path.join(process.cwd(), 'uploads', filename)
  
  // Extraire le texte
  const text = await extractTextFromPdf(filePath)
  
  // Découper en chunks
  const chunks = chunkText(text)
  
  if (chunks.length === 0) {
    throw new Error('Aucun texte extrait du PDF')
  }

  // Générer et stocker les embeddings
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]
    const embedding = await generateEmbedding(chunk)
    
    insertChunk({
      id: `${documentId}_${i}`,
      document_id: documentId,
      content: chunk,
      embedding: embedding,
      chunk_index: i
    })
  }

  // Marquer comme indexé
  markAsIndexed(documentId)
  
  return chunks.length
}

export async function queryDocument(documentId: string, question: string): Promise<string> {
  // Récupérer tous les chunks du document
  const chunks = getChunksByDocument(documentId) as any[]
  
  if (chunks.length === 0) {
    return "Ce document n'a pas encore été indexé."
  }

  // Générer l'embedding de la question
  const questionEmbedding = await generateEmbedding(question)
  
  // Calculer la similarité avec chaque chunk
  const similarities = chunks.map(chunk => ({
    content: chunk.content,
    similarity: cosineSimilarity(questionEmbedding, JSON.parse(chunk.embedding))
  }))
  
  // Trier par similarité et prendre les 3 meilleurs
  similarities.sort((a, b) => b.similarity - a.similarity)
  const topChunks = similarities.slice(0, 3)
  
  // Construire le contexte
  const context = topChunks.map(c => c.content).join('\n\n')
  
  // Générer la réponse
  const prompt = `Tu es un assistant qui répond aux questions en te basant uniquement sur le contexte fourni.

Contexte du document :
${context}

Question : ${question}

Réponds de manière concise et précise en te basant uniquement sur le contexte. Si l'information n'est pas dans le contexte, dis-le clairement.`

  const response = await generateResponse(prompt)
  return response
}