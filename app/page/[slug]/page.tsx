// app/page/[slug]/page.tsx
import { getPageBySlug, getSitePages } from '@/lib/cosmic'
import { SitePage } from '@/types'
import WireframeViewer from '@/components/WireframeViewer'
import Header from '@/components/Header'
import PageSelector from '@/components/PageSelector'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  
  const [page, allPages] = await Promise.all([
    getPageBySlug(slug) as Promise<SitePage | null>,
    getSitePages() as Promise<SitePage[]>
  ])

  if (!page) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
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
            to make targeted changes to specific sections.
          </p>
        </div>

        {allPages.length > 1 && (
          <div className="mb-8">
            <PageSelector pages={allPages} currentPage={page} />
          </div>
        )}

        <WireframeViewer page={page} />
      </main>
    </div>
  )
}

export async function generateStaticParams() {
  const pages = await getSitePages() as SitePage[]
  
  return pages
    .filter(page => page.metadata.page_url !== '/') // Exclude homepage
    .map((page) => ({
      slug: page.slug,
    }))
}