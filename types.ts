// Base Cosmic object interface
interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Site Page interface
export interface SitePage extends CosmicObject {
  type: 'site-pages';
  metadata: {
    page_title: string;
    page_url: string;
    page_template?: PageTemplate;
    page_sections?: PageSection[];
    seo_title?: string;
    seo_description?: string;
    featured_image?: {
      url: string;
      imgix_url: string;
    };
    page_status: {
      key: PageStatus;
      value: string;
    };
  };
}

// Page Section interface
export interface PageSection extends CosmicObject {
  type: 'page-sections';
  metadata: {
    section_id: string;
    section_label: string;
    wireframe_reference?: string;
    content_block?: ContentBlock;
    display_order: number;
    is_active: boolean;
    responsive_behavior?: {
      key: ResponsiveBehavior;
      value: string;
    };
    custom_overrides?: Record<string, any>;
  };
}

// Content Block interface
export interface ContentBlock extends CosmicObject {
  type: 'content-blocks';
  metadata: {
    block_name: string;
    block_type: {
      key: BlockType;
      value: string;
    };
    primary_content?: string;
    headline?: string;
    subheading?: string;
    media_assets?: Array<{
      url: string;
      imgix_url: string;
    }>;
    call_to_action?: {
      text: string;
      url: string;
      style: string;
    };
    block_settings?: Record<string, any>;
    is_reusable: boolean;
  };
}

// Page Template interface
export interface PageTemplate extends CosmicObject {
  type: 'page-templates';
  metadata: {
    template_name: string;
    template_description?: string;
    layout_type: {
      key: LayoutType;
      value: string;
    };
    default_sections?: PageSection[];
    template_settings?: Record<string, any>;
  };
}

// Type literals for select-dropdown values
export type PageStatus = 'published' | 'draft' | 'maintenance';
export type ResponsiveBehavior = 'standard' | 'hide_mobile' | 'hide_desktop' | 'stack_mobile';
export type BlockType = 'hero' | 'text_block' | 'image_gallery' | 'testimonials' | 'features' | 'cta_section' | 'contact_form' | 'about_section';
export type LayoutType = 'single_column' | 'two_column' | 'landing_page' | 'blog_layout';

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}

// Wireframe specific types
export interface WireframeSectionData {
  section: PageSection;
  contentBlock: ContentBlock;
  isActive: boolean;
  wireframeRef: string;
  displayOrder: number;
}