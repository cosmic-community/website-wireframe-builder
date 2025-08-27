import { SitePage, PageSection, ContentBlock } from '@/types'
import WireframeSection from './WireframeSection'
import { Layout, Info } from 'lucide-react'

interface WireframeViewerProps {
  page: SitePage
}

export default function WireframeViewer({ page }: WireframeViewerProps) {
  const sections = page.metadata.page_sections || []
  const activeSections = sections
    .filter(section => section.metadata?.is_active)
    .sort((a, b) => {
      const orderA = a.metadata?.display_order || 0
      const orderB = b.metadata?.display_order || 0
      return orderA - orderB
    })

  if (sections.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <Layout className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Sections Found</h3>
        <p className="text-gray-600">
          This page doesn't have any sections configured yet. Add sections in your Cosmic dashboard to see the wireframe.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Wireframe Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start space-x-4">
          <Layout className="h-6 w-6 text-blue-600 mt-1" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Page Wireframe: {page.metadata.page_title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">URL:</span>
                <span className="ml-2 font-mono text-blue-600">{page.metadata.page_url}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Template:</span>
                <span className="ml-2">{page.metadata.page_template?.metadata.template_name || 'Default'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Sections:</span>
                <span className="ml-2">{activeSections.length} active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 mb-1">How to Use This Wireframe</h3>
            <p className="text-blue-800 text-sm">
              Each section below is labeled with its wireframe reference (like WF-001-HERO). 
              Use these labels to tell the AI exactly which part of your website to modify. 
              Hover over sections to see detailed information and editing options.
            </p>
          </div>
        </div>
      </div>

      {/* Wireframe Sections */}
      <div className="wireframe-grid">
        {activeSections.map((section) => (
          <WireframeSection 
            key={section.id} 
            section={section as PageSection}
            contentBlock={section.metadata?.content_block as ContentBlock}
          />
        ))}
      </div>

      {/* Inactive Sections */}
      {sections.some(s => !s.metadata?.is_active) && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Inactive Sections</h3>
          <div className="wireframe-grid opacity-50">
            {sections
              .filter(section => !section.metadata?.is_active)
              .sort((a, b) => {
                const orderA = a.metadata?.display_order || 0
                const orderB = b.metadata?.display_order || 0
                return orderA - orderB
              })
              .map((section) => (
                <WireframeSection 
                  key={section.id} 
                  section={section as PageSection}
                  contentBlock={section.metadata?.content_block as ContentBlock}
                  isInactive={true}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  )
}