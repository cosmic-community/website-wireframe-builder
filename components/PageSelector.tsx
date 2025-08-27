'use client'

import Link from 'next/link'
import { SitePage } from '@/types'
import { ChevronDown, FileText } from 'lucide-react'

interface PageSelectorProps {
  pages: SitePage[]
  currentPage: SitePage
}

export default function PageSelector({ pages, currentPage }: PageSelectorProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center space-x-3 mb-4">
        <FileText className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Select Page to View</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {pages.map((page) => {
          const isActive = page.id === currentPage.id
          const href = page.metadata.page_url === '/' ? '/' : `/page/${page.slug}`
          
          return (
            <Link
              key={page.id}
              href={href}
              className={`
                p-3 rounded-lg border transition-all duration-200
                ${isActive 
                  ? 'border-blue-500 bg-blue-50 text-blue-900' 
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{page.metadata.page_title}</h3>
                  <p className="text-sm text-gray-500 font-mono">{page.metadata.page_url}</p>
                </div>
                {isActive && (
                  <div className="text-blue-600">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                )}
              </div>
              
              {page.metadata.page_sections && (
                <div className="mt-2 text-xs text-gray-500">
                  {page.metadata.page_sections.length} sections
                </div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}