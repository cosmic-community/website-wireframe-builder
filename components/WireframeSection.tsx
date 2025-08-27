'use client'

import { useState } from 'react'
import { PageSection, ContentBlock } from '@/types'
import { Eye, EyeOff, Smartphone, Monitor, Settings, FileText, Edit, X, Save } from 'lucide-react'
import SectionEditModal from './SectionEditModal'

interface WireframeSectionProps {
  section: PageSection
  contentBlock?: ContentBlock
  isInactive?: boolean
}

export default function WireframeSection({ section, contentBlock, isInactive = false }: WireframeSectionProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  const wireframeRef = section.metadata.wireframe_reference || `WF-${section.metadata.display_order?.toString().padStart(3, '0')}-${section.metadata.section_id.toUpperCase()}`
  const responsiveBehavior = section.metadata.responsive_behavior?.value || 'Standard'
  const hasCustomOverrides = section.metadata.custom_overrides && Object.keys(section.metadata.custom_overrides).length > 0

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsEditModalOpen(true)
  }

  const getBlockTypeIcon = (blockType?: string) => {
    switch (blockType) {
      case 'hero':
        return '🎯'
      case 'features':
        return '⭐'
      case 'testimonials':
        return '💬'
      case 'about_section':
        return '📋'
      case 'cta_section':
        return '🎯'
      case 'contact_form':
        return '📧'
      case 'image_gallery':
        return '🖼️'
      default:
        return '📦'
    }
  }

  const getResponsiveIcon = (behavior: string) => {
    switch (behavior) {
      case 'Hide on Mobile':
        return <Smartphone className="h-4 w-4 text-red-500" />
      case 'Hide on Desktop':
        return <Monitor className="h-4 w-4 text-red-500" />
      case 'Stack on Mobile':
        return <Smartphone className="h-4 w-4 text-orange-500" />
      default:
        return <Monitor className="h-4 w-4 text-green-500" />
    }
  }

  return (
    <>
      <div 
        className={`wireframe-section cursor-pointer ${isInactive ? 'border-gray-300 bg-gray-50' : ''}`}
        onClick={handleEditClick}
      >
        {/* Wireframe Label */}
        <div className={`wireframe-label ${isInactive ? 'bg-gray-500' : ''}`}>
          {wireframeRef}
        </div>

        {/* Section Status Badge */}
        <div className="absolute top-2 left-3">
          <div className={`section-status ${section.metadata.is_active ? 'status-active' : 'status-inactive'}`}>
            {section.metadata.is_active ? (
              <><Eye className="h-3 w-3 mr-1" /> Active</>
            ) : (
              <><EyeOff className="h-3 w-3 mr-1" /> Inactive</>
            )}
          </div>
        </div>

        {/* Edit Button */}
        <div className="absolute top-2 right-2">
          <button
            onClick={handleEditClick}
            className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors opacity-75 hover:opacity-100"
            title="Edit this section"
          >
            <Edit className="h-3 w-3" />
          </button>
        </div>

        {/* Hover Details Panel */}
        <div className="hover-details">
          <div className="space-y-2">
            <div className="font-semibold text-gray-900 text-sm border-b border-gray-200 pb-2">
              Section Details
            </div>
            
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Section ID:</span>
                <span className="font-mono text-blue-600">{section.metadata.section_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Display Order:</span>
                <span className="font-mono">{section.metadata.display_order}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Responsive:</span>
                <div className="flex items-center space-x-1">
                  {getResponsiveIcon(responsiveBehavior)}
                  <span>{responsiveBehavior}</span>
                </div>
              </div>
              {hasCustomOverrides && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Custom CSS:</span>
                  <Settings className="h-3 w-3 text-orange-500" />
                </div>
              )}
            </div>

            {contentBlock && (
              <>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="font-semibold text-gray-900 text-sm">Content Block</div>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Block Type:</span>
                    <span className="flex items-center space-x-1">
                      <span>{getBlockTypeIcon(contentBlock.metadata.block_type?.key)}</span>
                      <span>{contentBlock.metadata.block_type?.value}</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reusable:</span>
                    <span>{contentBlock.metadata.is_reusable ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Section Content */}
        <div className="wireframe-content">
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-xl">{getBlockTypeIcon(contentBlock?.metadata.block_type?.key)}</span>
            <div>
              <h3 className="font-semibold text-gray-900">{section.metadata.section_label}</h3>
              <p className="text-sm text-gray-600">{section.title}</p>
            </div>
          </div>

          {contentBlock && (
            <div className="space-y-2">
              {contentBlock.metadata.headline && (
                <div className="p-2 bg-white border border-gray-200 rounded">
                  <div className="text-xs font-medium text-gray-500 mb-1">Headline:</div>
                  <div className="text-sm font-medium text-gray-900">
                    {contentBlock.metadata.headline}
                  </div>
                </div>
              )}

              {contentBlock.metadata.subheading && (
                <div className="p-2 bg-white border border-gray-200 rounded">
                  <div className="text-xs font-medium text-gray-500 mb-1">Subheading:</div>
                  <div className="text-sm text-gray-700">
                    {contentBlock.metadata.subheading}
                  </div>
                </div>
              )}

              {contentBlock.metadata.call_to_action && (
                <div className="p-2 bg-white border border-gray-200 rounded">
                  <div className="text-xs font-medium text-gray-500 mb-1">Call to Action:</div>
                  <div className="text-sm">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {contentBlock.metadata.call_to_action.text}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                <span>Order: {section.metadata.display_order}</span>
                <div className="flex items-center space-x-1">
                  {getResponsiveIcon(responsiveBehavior)}
                  <span>{responsiveBehavior}</span>
                </div>
              </div>
            </div>
          )}

          {!contentBlock && (
            <div className="text-center py-4 text-gray-500">
              <FileText className="h-6 w-6 mx-auto mb-2" />
              <p className="text-sm">No content block assigned</p>
            </div>
          )}
        </div>

        {/* Edit Action Hint */}
        <div className="absolute bottom-2 right-2 text-xs text-blue-600 font-medium bg-white px-2 py-1 rounded border border-blue-200">
          <Edit className="h-3 w-3 inline mr-1" />
          Click to edit
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <SectionEditModal 
          section={section}
          contentBlock={contentBlock}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  )
}