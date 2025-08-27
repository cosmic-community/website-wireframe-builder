'use client'

import { useEffect, useState } from 'react'
import { SitePage } from '@/types'
import WireframeViewer from '@/components/WireframeViewer'
import WebsitePreview from '@/components/WebsitePreview'
import Header from '@/components/Header'
import PageSelector from '@/components/PageSelector'
import { Layout } from 'lucide-react'

export default function HomePage() {
  const [pages, setPages] = useState<SitePage[]>([])
  const [homepage, setHomepage] = useState<SitePage | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/pages')
        const data = await response.json()
        const fetchedPages = data.pages || []
        
        setPages(fetchedPages)
        
        const home = fetchedPages.find((page: SitePage) => page.metadata.page_url === '/') || fetchedPages[0]
        setHomepage(home)
      } catch (error) {
        console.error('Error fetching pages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wireframe...</p>
        </div>
      </div>
    )
  }

  if (!homepage) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <Layout className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No Pages Found</h1>
            <p className="text-gray-600">No site pages found in your Cosmic bucket.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        pages={pages}
        currentPage={homepage}
        onPreviewClick={() => setShowPreview(!showPreview)}
        showPreview={showPreview}
      />
      
      {showPreview ? (
        <WebsitePreview 
          page={homepage} 
          onBackClick={() => setShowPreview(false)} 
        />
      ) : (
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Website Wireframe Builder
            </h1>
            <p className="text-gray-600 max-w-2xl">
              Interactive wireframe showing labeled sections of your website. Each section is connected to your content model 
              so you can make targeted changes by referencing the wireframe labels. Click the "Preview Website" button above to see how your site will look when launched.
            </p>
          </div>

          {pages.length > 1 && (
            <div className="mb-8">
              <PageSelector pages={pages} currentPage={homepage} />
            </div>
          )}

          <WireframeViewer page={homepage} />
        </main>
      )}
    </div>
  )
}