'use client'

import { useState } from 'react'
import { Layout, Eye, Globe, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { SitePage } from '@/types'

interface HeaderProps {
  pages?: SitePage[]
  currentPage?: SitePage
  onPreviewClick?: () => void
  showPreview?: boolean
}

export default function Header({ pages = [], currentPage, onPreviewClick, showPreview = false }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <Layout className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Wireframe Builder</h1>
              <p className="text-xs text-gray-500">Cosmic CMS</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Page Navigation */}
            {pages.length > 0 && (
              <nav className="flex items-center space-x-4">
                {pages.map((page) => (
                  <Link
                    key={page.id}
                    href={page.slug === 'homepage' ? '/' : `/page/${page.slug}`}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage?.id === page.id
                        ? 'bg-blue-100 text-blue-800'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <span>{page.metadata.page_title}</span>
                    </span>
                  </Link>
                ))}
              </nav>
            )}

            {/* Preview Button */}
            {onPreviewClick && (
              <button
                onClick={onPreviewClick}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  showPreview
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Eye className="h-4 w-4" />
                <span>{showPreview ? 'Show Wireframe' : 'Preview Website'}</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {/* Mobile Page Navigation */}
              {pages.length > 0 && (
                <div className="space-y-2">
                  {pages.map((page) => (
                    <Link
                      key={page.id}
                      href={page.slug === 'homepage' ? '/' : `/page/${page.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage?.id === page.id
                          ? 'bg-blue-100 text-blue-800'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <Globe className="h-4 w-4" />
                        <span>{page.metadata.page_title}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Mobile Preview Button */}
              {onPreviewClick && (
                <button
                  onClick={() => {
                    onPreviewClick()
                    setIsMobileMenuOpen(false)
                  }}
                  className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    showPreview
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <Eye className="h-4 w-4" />
                  <span>{showPreview ? 'Show Wireframe' : 'Preview Website'}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}