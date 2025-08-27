import { getSitePages } from '@/lib/cosmic'
import { SitePage } from '@/types'
import WireframeViewer from '@/components/WireframeViewer'
import Header from '@/components/Header'
import PageSelector from '@/components/PageSelector'

export default async function HomePage() {
  const pages = await getSitePages() as SitePage[]
  const homepage = pages.find(page => page.metadata.page_url === '/') || pages[0]

  if (!homepage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Pages Found</h1>
          <p className="text-gray-600">No site pages found in your Cosmic bucket.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Website Wireframe Builder
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Interactive wireframe showing labeled sections of your website. Each section is connected to your content model 
            so you can make targeted changes by referencing the wireframe labels.
          </p>
        </div>

        {pages.length > 1 && (
          <div className="mb-8">
            <PageSelector pages={pages} currentPage={homepage} />
          </div>
        )}

        <WireframeViewer page={homepage} />
      </main>
    </div>
  )
}