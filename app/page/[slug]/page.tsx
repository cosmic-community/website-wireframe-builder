// app/page/[slug]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { SitePage } from '@/types'
import WireframeViewer from '@/components/WireframeViewer'
import WebsitePreview from '@/components/WebsitePreview'
import Header from '@/components/Header'
import PageSelector from '@/components/PageSelector'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function Page({ params }: PageProps) {
  const [page, setPage] = useState<SitePage | null>(null)
  const [allPages, setAllPages] = useState<SitePage[]>([])
  const [loading, setLoading] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [slug, setSlug] = useState<string>('')

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params
      setSlug(resolvedParams.slug)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (!slug) return

    async function fetchData() {
      try {
        const [pageResponse, pagesResponse] = await Promise.all([
          fetch(`/api/pages/${slug}`),
          fetch('/api/pages')
        ])

        const pageData = await pageResponse.json()
        const pagesData = await pagesResponse.json()

        if (!pageData.page) {
          notFound()
          return
        }

        setPage(pageData.page)
        setAllPages(pagesData.pages || [])
      } catch (error) {
        console.error('Error fetching page:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading page...</p>
        </div>
      </div>
    )
  }

  if (!page) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        pages={allPages}
        currentPage={page}
        onPreviewClick={() => setShowPreview(!showPreview)}
        showPreview={showPreview}
      />
      
      {showPreview ? (
        <WebsitePreview 
          page={page} 
          onBackClick={() => setShowPreview(false)} 
        />
      ) : (
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {page.metadata.page_title}
            </h1>
            <p className="text-gray-600 mb-4">
              Wireframe for: <span className="font-mono text-blue-600">{page.metadata.page_url}</span>
            </p>
            <p className="text-gray-600 max-w-2xl">
              Interactive wireframe showing labeled sections for this page. Use the wireframe references 
              to make targeted changes to specific sections. Click the "Preview Website" button above to see how this page will look when launched.
            </p>
          </div>

          {allPages.length > 1 && (
            <div className="mb-8">
              <PageSelector pages={allPages} currentPage={page} />
            </div>
          )}

          <WireframeViewer page={page} />
        </main>
      )}
    </div>
  )
}