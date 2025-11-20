import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'data', 'database.sqlite')
const db = new Database(dbPath)

// Création des tables
db.exec(`
  CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    original_name TEXT NOT NULL,
    size INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    indexed INTEGER DEFAULT 0
  )
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS chunks (
    id TEXT PRIMARY KEY,
    document_id TEXT NOT NULL,
    content TEXT NOT NULL,
    embedding TEXT NOT NULL,
    chunk_index INTEGER NOT NULL,
    FOREIGN KEY (document_id) REFERENCES documents(id)
  )
`)

export function insertDocument(doc: {
  id: string
  filename: string
  original_name: string
  size: number
}) {
  const stmt = db.prepare(`
    INSERT INTO documents (id, filename, original_name, size)
    VALUES (?, ?, ?, ?)
  `)
  stmt.run(doc.id, doc.filename, doc.original_name, doc.size)
}

export function getAllDocuments() {
  return db.prepare('SELECT * FROM documents ORDER BY created_at DESC').all()
}

export function getDocument(id: string) {
  return db.prepare('SELECT * FROM documents WHERE id = ?').get(id)
}

export function markAsIndexed(id: string) {
  db.prepare('UPDATE documents SET indexed = 1 WHERE id = ?').run(id)
}

export function deleteDocument(id: string) {
  db.prepare('DELETE FROM documents WHERE id = ?').run(id)
}

export function insertChunk(chunk: {
  id: string
  document_id: string
  content: string
  embedding: number[]
  chunk_index: number
}) {
  const stmt = db.prepare(`
    INSERT INTO chunks (id, document_id, content, embedding, chunk_index)
    VALUES (?, ?, ?, ?, ?)
  `)
  stmt.run(
    chunk.id,
    chunk.document_id,
    chunk.content,
    JSON.stringify(chunk.embedding),
    chunk.chunk_index
  )
}

export function getChunksByDocument(documentId: string) {
  return db.prepare('SELECT * FROM chunks WHERE document_id = ?').all(documentId)
}

export function deleteChunksByDocument(documentId: string) {
  db.prepare('DELETE FROM chunks WHERE document_id = ?').run(documentId)
}

export default db