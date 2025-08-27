import { NextRequest, NextResponse } from 'next/server'
import { cosmic } from '@/lib/cosmic'

export async function POST(request: NextRequest) {
  try {
    const { id, metadata } = await request.json()

    if (!id || !metadata) {
      return NextResponse.json(
        { error: 'Missing id or metadata' },
        { status: 400 }
      )
    }

    const response = await cosmic.objects.updateOne(id, {
      metadata
    })

    return NextResponse.json({
      success: true,
      object: response.object
    })

  } catch (error) {
    console.error('Error updating section:', error)
    return NextResponse.json(
      { error: 'Failed to update section' },
      { status: 500 }
    )
  }
}