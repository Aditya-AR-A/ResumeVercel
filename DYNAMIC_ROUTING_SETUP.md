# Dynamic Routing & Detail Pages - Implementation Guide

## ✅ What's Been Created

### New Folder Structure
```
app/
├── projects/
│   ├── page.tsx              (Projects list - existing, enhanced with Links)
│   └── [id]/
│       └── page.tsx          (Dynamic project detail page)
│
├── certificates/
│   ├── page.tsx              (certificates list - NOW SHOWS AS CARDS with Links)
│   └── [slug]/
│       └── page.tsx          (certificate detail page using slugified names)
│
└── experience/
    ├── page.tsx              (Experience list - enhanced with job Links)
    └── [id]/
        └── page.tsx          (Dynamic job/experience detail page)

components/
└── DetailView/
    ├── ProjectDetailView.tsx      (Reusable project detail component)
    ├── CertificateDetailView.tsx  (Reusable certificate detail component)
    └── JobDetailView.tsx          (Reusable job/experience detail component)
```

## 📍 Dynamic Routes Created

### 1. **Projects**
- **List Page**: `/projects` → Grid of project cards
- **Detail Page**: `/projects/[id]` → Full project details with links to GitHub/demo
- **Component**: `ProjectDetailView` - Shows project info, technologies, and external links

### 2. **Certificates**
- **List Page**: `/certificates` → Grid of certificates (now as cards instead of direct PDF links)
- **Detail Page**: `/certificates/[slug]` → Full certificate details, skills verified, credential links
- **Component**: `CertificateDetailView` - Shows certificate image, description, and skills

### 3. **Experience (Jobs)**
- **List Page**: `/experience` → Timeline view of all jobs
- **Detail Page**: `/experience/[id]` → Full job details with responsibilities and skills
- **Component**: `JobDetailView` - Shows company info, timeline, and technologies used

## 🔗 How It Works

### Data Flow
1. **Fetch data** from JSON files using `loadJson()` utility
2. **Generate static params** for all items (projects, certs, jobs) for static site generation
3. **Dynamic routing** renders detail pages based on `[id]` or `[slug]` parameter
4. **Links** navigate from list pages to detail pages using Next.js `<Link>`

### URL Structure
```
/projects                      → List all projects
/projects/my-awesome-project   → Detail for specific project

/certificates                  → List all certificates  
/certificates/aws-solutions-architect → Detail for specific certificate (slug generated via `utils/slug.ts`)

/experience                    → List all jobs
/experience/job-123           → Detail for specific job
```

## 🎯 Key Features

✅ **Dynamic page generation** - No manual page creation needed
✅ **Reusable detail components** - Same component handles all similar items
✅ **Static generation** - Pre-built pages for SEO & performance
✅ **Clickable cards** - Section titles link to collection pages
✅ **Consistent UI** - All detail pages follow same design pattern
✅ **Proper metadata** - Dynamic SEO titles and descriptions

## 🚀 Making Section Titles Clickable

Update your **home page** (page.tsx) or section headers to include links:

```typescript
// Example: Link section title to collection page
import Link from 'next/link'

<Link href="/projects" className="hover:text-blue-400 transition">
  <h2 className="text-3xl font-bold">My Projects</h2>
</Link>

<Link href="/certificates" className="hover:text-blue-400 transition">
  <h2 className="text-3xl font-bold">Certifications</h2>
</Link>

<Link href="/experience" className="hover:text-blue-400 transition">
  <h2 className="text-3xl font-bold">Experience</h2>
</Link>
```

## 📝 Files Modified/Created

### Created:
- ✅ `components/DetailView/ProjectDetailView.tsx`
- ✅ `components/DetailView/CertificateDetailView.tsx`
- ✅ `components/DetailView/JobDetailView.tsx`
- ✅ `app/projects/[id]/page.tsx`
- ✅ `app/certificates/[slug]/page.tsx`
- ✅ `app/experience/[id]/page.tsx`

### Modified:
- ✅ `app/certificates/page.tsx` - Now links to detail pages instead of PDFs
- ✅ `app/experience/page.tsx` - Enhanced with clickable job cards

## 🔄 How to Add More Detail Pages

For any new collection (e.g., "Skills", "Testimonials", etc.):

1. **Create detail component** in `components/DetailView/YourDetailView.tsx`
2. **Create dynamic route** at `app/your-route/[id]/page.tsx`
3. **Update collection page** to use `<Link>` instead of direct links
4. **Add static params** in the dynamic page for pre-generation

Template for dynamic page:
```typescript
export async function generateStaticParams() {
  const items = loadJson('your-file.json')
  return items.map((item) => ({ id: item.id }))
}

export default function DetailPage({ params }: Props) {
  const items = loadJson('your-file.json')
  const item = items.find(i => i.id === params.id)
  if (!item) notFound()
  return <YourDetailView item={item} />
}
```

## ✨ Next Steps

1. **Install dependencies** if needed (Next.js already has Link)
2. **Test routes locally** - Visit `/projects/[any-id]` to verify
3. **Add more metadata** to detail pages (Open Graph for social sharing)
4. **Consider caching** - Add revalidate time for ISR (Incremental Static Regeneration)
5. **Update navbar** - Add links to `/projects`, `/certificates`, `/experience`

---

**Status**: ✅ All dynamic routes and components created and ready to use!
