import pdf from 'pdf-parse'
import fs from 'fs'

export async function extractTextFromPdf(filePath: string): Promise<string> {
  const buffer = fs.readFileSync(filePath)
  const data = await pdf(buffer)
  return data.text
}

export function chunkText(text: string, chunkSize: number = 500, overlap: number = 50): string[] {
  const chunks: string[] = []
  
  // Nettoyer le texte
  const cleanText = text
    .replace(/\s+/g, ' ')
    .trim()
  
  if (cleanText.length <= chunkSize) {
    return [cleanText]
  }

  let start = 0
  while (start < cleanText.length) {
    let end = start + chunkSize
    
    // Essayer de couper à un espace
    if (end < cleanText.length) {
      const lastSpace = cleanText.lastIndexOf(' ', end)
      if (lastSpace > start) {
        end = lastSpace
      }
    }
    
    chunks.push(cleanText.slice(start, end).trim())
    start = end - overlap
  }

  return chunks.filter(chunk => chunk.length > 20)
}