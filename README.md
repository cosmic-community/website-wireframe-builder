# Website Wireframe Builder

![App Preview](https://imgix.cosmicjs.com/74cb4790-82eb-11f0-8ece-89921cbea84a-photo-1460925895917-afdab827c52f-1756260823512.jpg?w=1200&h=300&fit=crop&auto=format,compress)

A dynamic website wireframe builder that creates visual wireframes showing labeled sections of your website. Transform your Cosmic content model into an interactive wireframe where each section is clearly identified with wireframe references, section labels, and content details - perfect for content editors who want to make targeted changes to specific parts of their website.

## ✨ Features

- **Interactive Section Labels**: Every website section clearly labeled with wireframe references (WF-001-HERO, WF-002-FEATURES, etc.)
- **Content Block Mapping**: Visual connection between sections and their content blocks
- **Section Status Indicators**: Active/inactive status and responsive behavior indicators
- **Template Structure Visualization**: Shows how page templates organize sections
- **Hover Details**: Detailed section information on hover including custom overrides
- **Direct Content Management**: Click-to-edit functionality for each wireframe section
- **Responsive Preview**: Visual indicators for mobile/desktop behavior
- **Wireframe Reference System**: Technical wireframe IDs for precise section identification

## Clone this Project

<!-- CLONE_PROJECT_BUTTON -->

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> I want to build a built-out wire frame of a website that labels each section of the site and connects to the content model as well. That way I can go into the editor and simply tell the ai what section of the site to change. Can this be built?

### Code Generation Prompt

> Built a simple wireframe of a website that can show where each section of the website is. This way I can make individual changes to specific parts of the website by calling out that section.

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## 🛠️ Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Cosmic SDK** - Content management integration
- **Lucide React** - Beautiful icons and visual elements

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A Cosmic account with the wireframe content model

### Installation

1. Clone this repository
2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
# Copy the example environment file
cp .env.example .env.local

# Add your Cosmic credentials
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
```

4. Run the development server:
```bash
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📡 Cosmic SDK Examples

### Fetching Page Structure
```typescript
// Get a page with all its sections and content blocks
const response = await cosmic.objects.findOne({
  type: 'site-pages',
  slug: 'homepage'
}).depth(2); // Deep fetch to include content blocks

const page = response.object as SitePage;
```

### Getting Section Details
```typescript
// Fetch sections with their content blocks
const sections = await cosmic.objects.find({
  type: 'page-sections',
  'metadata.is_active': true
}).depth(1);
```

### Content Block Management
```typescript
// Update a specific content block
await cosmic.objects.updateOne(contentBlockId, {
  metadata: {
    headline: 'Updated Hero Title',
    subheading: 'New subheading text'
  }
});
```

## 🎯 Cosmic CMS Integration

This application integrates with your Cosmic bucket using four content types:

- **Site Pages**: Define page structure and URL routing
- **Page Sections**: Organize content into labeled wireframe sections
- **Content Blocks**: Store actual content, media, and settings
- **Page Templates**: Provide reusable layout structures

The wireframe system uses section IDs (hero, features, testimonials) and wireframe references (WF-001-HERO) to create a clear mapping between your content model and the visual website structure.

## 🚀 Deployment Options

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Netlify
1. Connect repository to Netlify
2. Set build command: `bun run build`
3. Set publish directory: `.next`
4. Add environment variables

For production deployment, ensure all environment variables are properly configured in your hosting platform.
