import { createBucketClient } from '@cosmicjs/sdk'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

// Helper function for error handling
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Fetch all site pages with sections and content blocks
export async function getSitePages() {
  try {
    const response = await cosmic.objects
      .find({ type: 'site-pages' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(2);
    
    return response.objects;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch site pages');
  }
}

// Fetch a specific page with full data
export async function getPageBySlug(slug: string) {
  try {
    const response = await cosmic.objects
      .findOne({
        type: 'site-pages',
        slug
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(2);
    
    return response.object;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch page');
  }
}

// Fetch all page sections with content blocks
export async function getPageSections() {
  try {
    const response = await cosmic.objects
      .find({ type: 'page-sections' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects.sort((a: any, b: any) => {
      const orderA = a.metadata?.display_order || 0;
      const orderB = b.metadata?.display_order || 0;
      return orderA - orderB;
    });
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch page sections');
  }
}

// Fetch content blocks
export async function getContentBlocks() {
  try {
    const response = await cosmic.objects
      .find({ type: 'content-blocks' })
      .props(['id', 'title', 'slug', 'metadata']);
    
    return response.objects;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch content blocks');
  }
}

// Update a content block
export async function updateContentBlock(id: string, metadata: Record<string, any>) {
  try {
    const response = await cosmic.objects.updateOne(id, {
      metadata
    });
    
    return response.object;
  } catch (error) {
    console.error('Error updating content block:', error);
    throw new Error('Failed to update content block');
  }
}