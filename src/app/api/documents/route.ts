import { NextResponse } from 'next/server'
import { getAllDocuments } from '@/lib/db'

export async function GET() {
  try {
    const documents = getAllDocuments()
    return NextResponse.json(documents)
  } catch (error: any) {
    console.error('Error fetching documents:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}