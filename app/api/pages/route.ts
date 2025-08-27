import { NextResponse } from 'next/server'
import { getSitePages } from '@/lib/cosmic'

export async function GET() {
  try {
    const pages = await getSitePages()
    
    return NextResponse.json({
      success: true,
      pages
    })
  } catch (error) {
    console.error('Error fetching pages:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    )
  }
}