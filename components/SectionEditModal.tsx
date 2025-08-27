'use client'

import { useState, useEffect } from 'react'
import { PageSection, ContentBlock } from '@/types'
import { X, Save, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'

interface SectionEditModalProps {
  section: PageSection
  contentBlock?: ContentBlock
  isOpen: boolean
  onClose: () => void
}

export default function SectionEditModal({ section, contentBlock, isOpen, onClose }: SectionEditModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // Section form state
  const [sectionLabel, setSectionLabel] = useState(section.metadata.section_label || '')
  const [isActive, setIsActive] = useState(section.metadata.is_active || false)
  const [displayOrder, setDisplayOrder] = useState(section.metadata.display_order || 0)

  // Content block form state
  const [headline, setHeadline] = useState(contentBlock?.metadata.headline || '')
  const [subheading, setSubheading] = useState(contentBlock?.metadata.subheading || '')
  const [primaryContent, setPrimaryContent] = useState(contentBlock?.metadata.primary_content || '')
  const [ctaText, setCtaText] = useState(contentBlock?.metadata.call_to_action?.text || '')
  const [ctaUrl, setCtaUrl] = useState(contentBlock?.metadata.call_to_action?.url || '')

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSectionLabel(section.metadata.section_label || '')
      setIsActive(section.metadata.is_active || false)
      setDisplayOrder(section.metadata.display_order || 0)
      
      setHeadline(contentBlock?.metadata.headline || '')
      setSubheading(contentBlock?.metadata.subheading || '')
      setPrimaryContent(contentBlock?.metadata.primary_content || '')
      setCtaText(contentBlock?.metadata.call_to_action?.text || '')
      setCtaUrl(contentBlock?.metadata.call_to_action?.url || '')
      
      setSaveStatus('idle')
      setErrorMessage('')
    }
  }, [isOpen, section, contentBlock])

  const handleSave = async () => {
    setIsLoading(true)
    setSaveStatus('saving')
    setErrorMessage('')

    try {
      // Update section if changes were made
      const sectionPayload: any = {}
      let hasSectionChanges = false

      if (sectionLabel !== section.metadata.section_label) {
        sectionPayload.section_label = sectionLabel
        hasSectionChanges = true
      }

      if (isActive !== section.metadata.is_active) {
        sectionPayload.is_active = isActive
        hasSectionChanges = true
      }

      if (displayOrder !== section.metadata.display_order) {
        sectionPayload.display_order = displayOrder
        hasSectionChanges = true
      }

      if (hasSectionChanges) {
        await fetch('/api/update-section', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: section.id,
            metadata: sectionPayload
          }),
        })
      }

      // Update content block if it exists and changes were made
      if (contentBlock) {
        const contentPayload: any = {}
        let hasContentChanges = false

        if (headline !== contentBlock.metadata.headline) {
          contentPayload.headline = headline
          hasContentChanges = true
        }

        if (subheading !== contentBlock.metadata.subheading) {
          contentPayload.subheading = subheading
          hasContentChanges = true
        }

        if (primaryContent !== contentBlock.metadata.primary_content) {
          contentPayload.primary_content = primaryContent
          hasContentChanges = true
        }

        const currentCta = contentBlock.metadata.call_to_action
        if (ctaText !== (currentCta?.text || '') || ctaUrl !== (currentCta?.url || '')) {
          contentPayload.call_to_action = {
            text: ctaText,
            url: ctaUrl,
            style: currentCta?.style || 'primary'
          }
          hasContentChanges = true
        }

        if (hasContentChanges) {
          await fetch('/api/update-content-block', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: contentBlock.id,
              metadata: contentPayload
            }),
          })
        }
      }

      setSaveStatus('success')
      
      // Auto-close after successful save
      setTimeout(() => {
        onClose()
        // Refresh the page to show updated content
        window.location.reload()
      }, 1500)

    } catch (error) {
      console.error('Error saving changes:', error)
      setSaveStatus('error')
      setErrorMessage('Failed to save changes. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  const wireframeRef = section.metadata.wireframe_reference || `WF-${section.metadata.display_order?.toString().padStart(3, '0')}-${section.metadata.section_id.toUpperCase()}`

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Edit Section: {wireframeRef}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {section.metadata.section_label} - {section.title}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Save Status */}
          {saveStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">Changes saved successfully!</span>
              </div>
            </div>
          )}

          {saveStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-red-800 font-medium">{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Section Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Section Settings</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section Label
              </label>
              <input
                type="text"
                value={sectionLabel}
                onChange={(e) => setSectionLabel(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Enter section label"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visibility
                </label>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  disabled={isLoading}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors flex items-center justify-center ${
                    isActive
                      ? 'bg-green-50 border-green-300 text-green-800'
                      : 'bg-gray-50 border-gray-300 text-gray-800'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isActive ? (
                    <><Eye className="h-4 w-4 mr-2" /> Active</>
                  ) : (
                    <><EyeOff className="h-4 w-4 mr-2" /> Inactive</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Content Block Settings */}
          {contentBlock && (
            <div className="space-y-4 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900">Content Settings</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Headline
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Enter headline"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subheading
                </label>
                <input
                  type="text"
                  value={subheading}
                  onChange={(e) => setSubheading(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Enter subheading"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Content
                </label>
                <textarea
                  value={primaryContent}
                  onChange={(e) => setPrimaryContent(e.target.value)}
                  disabled={isLoading}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Enter content description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Call to Action Text
                  </label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="Button text"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Call to Action URL
                  </label>
                  <input
                    type="url"
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}