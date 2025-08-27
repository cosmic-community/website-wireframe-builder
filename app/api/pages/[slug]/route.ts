// app/api/pages/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPageBySlug } from '@/lib/cosmic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const page = await getPageBySlug(slug)
    
    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      page
    })
  } catch (error) {
    console.error('Error fetching page:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    )
  }
}