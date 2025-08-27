'use client'

import { SitePage, PageSection, ContentBlock } from '@/types'
import { ArrowLeft, ExternalLink, Smartphone, Monitor } from 'lucide-react'

interface WebsitePreviewProps {
  page: SitePage
  onBackClick: () => void
}

export default function WebsitePreview({ page, onBackClick }: WebsitePreviewProps) {
  const sections = page.metadata.page_sections || []
  const activeSections = sections
    .filter(section => section.metadata?.is_active)
    .sort((a, b) => {
      const orderA = a.metadata?.display_order || 0
      const orderB = b.metadata?.display_order || 0
      return orderA - orderB
    })

  return (
    <div className="min-h-screen bg-white">
      {/* Preview Header */}
      <div className="bg-gray-900 text-white p-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBackClick}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Wireframe</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium">Live Preview</span>
              <span className="text-gray-400">|</span>
              <span className="text-sm text-gray-300">{page.metadata.page_url}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <Monitor className="h-4 w-4" />
            <span>Desktop View</span>
          </div>
        </div>
      </div>

      {/* Website Content */}
      <div className="website-preview">
        {activeSections.map((section) => (
          <PreviewSection 
            key={section.id}
            section={section as PageSection}
            contentBlock={section.metadata?.content_block as ContentBlock}
          />
        ))}

        {activeSections.length === 0 && (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="text-6xl mb-4">🏗️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Sections</h2>
              <p className="text-gray-600">This page doesn't have any active sections to preview.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface PreviewSectionProps {
  section: PageSection
  contentBlock?: ContentBlock
}

function PreviewSection({ section, contentBlock }: PreviewSectionProps) {
  const sectionId = section.metadata.section_id
  const blockType = contentBlock?.metadata.block_type?.key
  const customOverrides = section.metadata.custom_overrides || {}
  
  // Apply custom overrides as inline styles
  const customStyles: React.CSSProperties = {}
  if (customOverrides.background_color) {
    customStyles.backgroundColor = customOverrides.background_color
  }
  if (customOverrides.padding_top) {
    customStyles.paddingTop = customOverrides.padding_top
  }
  if (customOverrides.padding_bottom) {
    customStyles.paddingBottom = customOverrides.padding_bottom
  }
  if (customOverrides.margin_bottom) {
    customStyles.marginBottom = customOverrides.margin_bottom
  }

  // Render based on block type
  switch (blockType) {
    case 'hero':
      return <HeroSection contentBlock={contentBlock} customStyles={customStyles} />
    case 'features':
      return <FeaturesSection contentBlock={contentBlock} customStyles={customStyles} />
    case 'testimonials':
      return <TestimonialsSection contentBlock={contentBlock} customStyles={customStyles} />
    case 'about_section':
      return <AboutSection contentBlock={contentBlock} customStyles={customStyles} />
    default:
      return <DefaultSection section={section} contentBlock={contentBlock} customStyles={customStyles} />
  }
}

// Hero Section Component
function HeroSection({ contentBlock, customStyles }: { contentBlock?: ContentBlock, customStyles: React.CSSProperties }) {
  if (!contentBlock) return null

  const { headline, subheading, primary_content, media_assets, call_to_action, block_settings } = contentBlock.metadata
  const backgroundImage = media_assets?.[0]?.imgix_url
  const isFullscreen = block_settings?.height === 'fullscreen'
  const textAlignment = block_settings?.text_alignment || 'center'
  const hasOverlay = block_settings?.background_overlay

  return (
    <section 
      className={`relative ${isFullscreen ? 'min-h-screen' : 'py-20'} flex items-center justify-center`}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage}?w=1920&h=1080&fit=crop&auto=format,compress)` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        ...customStyles
      }}
    >
      {hasOverlay && backgroundImage && (
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      )}
      
      <div className="relative z-10 container mx-auto px-4">
        <div className={`max-w-4xl ${textAlignment === 'center' ? 'mx-auto text-center' : textAlignment === 'right' ? 'ml-auto text-right' : ''}`}>
          {headline && (
            <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${backgroundImage ? 'text-white' : 'text-gray-900'}`}>
              {headline}
            </h1>
          )}
          
          {subheading && (
            <p className={`text-xl md:text-2xl mb-8 ${backgroundImage ? 'text-gray-200' : 'text-gray-600'}`}>
              {subheading}
            </p>
          )}
          
          {primary_content && (
            <div 
              className={`text-lg mb-10 ${backgroundImage ? 'text-gray-300' : 'text-gray-700'}`}
              dangerouslySetInnerHTML={{ __html: primary_content }}
            />
          )}
          
          {call_to_action && (
            <a
              href={call_to_action.url}
              className={`inline-flex items-center px-8 py-4 text-lg font-semibold rounded-lg transition-all hover:scale-105 ${
                call_to_action.style === 'primary'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : call_to_action.style === 'outline'
                  ? `border-2 ${backgroundImage ? 'border-white text-white hover:bg-white hover:text-gray-900' : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'}`
                  : 'bg-transparent text-blue-600 hover:text-blue-800'
              }`}
            >
              {call_to_action.text}
              <ExternalLink className="h-5 w-5 ml-2" />
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

// Features Section Component
function FeaturesSection({ contentBlock, customStyles }: { contentBlock?: ContentBlock, customStyles: React.CSSProperties }) {
  if (!contentBlock) return null

  const { headline, subheading, primary_content } = contentBlock.metadata

  // Mock features data
  const features = [
    { icon: '🚀', title: 'Fast Performance', description: 'Lightning-fast loading times and optimized performance.' },
    { icon: '🔒', title: 'Secure & Reliable', description: 'Enterprise-grade security with 99.9% uptime guarantee.' },
    { icon: '📱', title: 'Mobile Ready', description: 'Fully responsive design that works on all devices.' },
    { icon: '⚡', title: 'Easy Integration', description: 'Simple setup and seamless integration with existing tools.' },
    { icon: '🎨', title: 'Customizable', description: 'Flexible design system that adapts to your brand.' },
    { icon: '📊', title: 'Analytics', description: 'Detailed insights and analytics to track performance.' }
  ]

  return (
    <section className="py-20 bg-white" style={customStyles}>
      <div className="container mx-auto px-4">
        {headline && (
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-6">
            {headline}
          </h2>
        )}
        
        {subheading && (
          <p className="text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto">
            {subheading}
          </p>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Testimonials Section Component
function TestimonialsSection({ contentBlock, customStyles }: { contentBlock?: ContentBlock, customStyles: React.CSSProperties }) {
  if (!contentBlock) return null

  const { headline, subheading, primary_content } = contentBlock.metadata

  // Parse testimonials from primary_content or use mock data
  const testimonials = [
    {
      quote: "This platform has completely transformed how we manage our business. The results speak for themselves.",
      author: "Sarah Johnson",
      title: "CEO of TechStart",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b8bb?w=100&h=100&fit=crop&auto=format,compress"
    },
    {
      quote: "Exceptional service and support. The team went above and beyond to ensure our success.",
      author: "Michael Chen",
      title: "Founder of InnovateNow",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format,compress"
    },
    {
      quote: "We saw a 300% increase in efficiency within the first month. Couldn't be happier!",
      author: "Emma Rodriguez",
      title: "Operations Director",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&auto=format,compress"
    }
  ]

  return (
    <section className="py-20 bg-gray-50" style={customStyles}>
      <div className="container mx-auto px-4">
        {headline && (
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-6">
            {headline}
          </h2>
        )}
        
        {subheading && (
          <p className="text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto">
            {subheading}
          </p>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md">
              <blockquote className="text-gray-700 mb-6 italic">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-600">{testimonial.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// About Section Component
function AboutSection({ contentBlock, customStyles }: { contentBlock?: ContentBlock, customStyles: React.CSSProperties }) {
  if (!contentBlock) return null

  const { headline, subheading, primary_content, media_assets, call_to_action, block_settings } = contentBlock.metadata
  const layout = block_settings?.layout || 'image_left'
  const image = media_assets?.[0]?.imgix_url

  return (
    <section className="py-20 bg-white" style={customStyles}>
      <div className="container mx-auto px-4">
        <div className={`flex flex-col ${layout === 'image_left' ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
          {image && (
            <div className="lg:w-1/2">
              <img
                src={`${image}?w=600&h=400&fit=crop&auto=format,compress`}
                alt="About us"
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          )}
          
          <div className="lg:w-1/2">
            {headline && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {headline}
              </h2>
            )}
            
            {subheading && (
              <p className="text-xl text-gray-600 mb-6">
                {subheading}
              </p>
            )}
            
            {primary_content && (
              <div 
                className="text-gray-700 mb-8 space-y-4"
                dangerouslySetInnerHTML={{ __html: primary_content }}
              />
            )}
            
            {call_to_action && (
              <a
                href={call_to_action.url}
                className={`inline-flex items-center px-6 py-3 font-semibold rounded-lg transition-all ${
                  call_to_action.style === 'primary'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : call_to_action.style === 'outline'
                    ? 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                    : 'bg-transparent text-blue-600 hover:text-blue-800'
                }`}
              >
                {call_to_action.text}
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// Default Section Component
function DefaultSection({ section, contentBlock, customStyles }: { section: PageSection, contentBlock?: ContentBlock, customStyles: React.CSSProperties }) {
  return (
    <section className="py-16 bg-gray-100" style={customStyles}>
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {section.metadata.section_label}
          </h2>
          
          {contentBlock?.metadata.headline && (
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              {contentBlock.metadata.headline}
            </h3>
          )}
          
          {contentBlock?.metadata.subheading && (
            <p className="text-gray-600 mb-4">
              {contentBlock.metadata.subheading}
            </p>
          )}
          
          {contentBlock?.metadata.primary_content && (
            <div 
              className="text-gray-700 mb-6"
              dangerouslySetInnerHTML={{ __html: contentBlock.metadata.primary_content }}
            />
          )}
          
          {contentBlock?.metadata.call_to_action && (
            <a
              href={contentBlock.metadata.call_to_action.url}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              {contentBlock.metadata.call_to_action.text}
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          )}
          
          <div className="mt-6 text-sm text-gray-500">
            Section: {section.metadata.wireframe_reference || section.metadata.section_id}
          </div>
        </div>
      </div>
    </section>
  )
}