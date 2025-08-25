# Portfolio Project Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Folder Structure](#folder-structure)
3. [Core Architecture](#core-architecture)
4. [File Contents & Logic Flow](#file-contents--logic-flow)
5. [Data Flow](#data-flow)
6. [Component Hierarchy](#component-hierarchy)
7. [State Management](#state-management)
8. [Styling & Theming](#styling--theming)
9. [Configuration Files](#configuration-files)
10. [Build & Deployment](#build--deployment)

## Project Overview

This is a modern React-based portfolio website built with Next.js 14, featuring:

- Server-side rendering with App Router
- Dynamic content management system
- Interactive command interface
- Responsive design with mobile-first approach
- Dark/light theme support
- Animated transitions and scroll-based content
- Global sidebar navigation with event-driven state

### Tech Stack

- **Framework**: Next.js 14.2.13 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom components
- **UI Libraries**: Framer Motion for animations
- **State Management**: React hooks with global events
- **Build**: Webpack with PostCSS

## Folder Structure

```
Portfolio/ResumeVercel/
├── app/                          # Next.js App Router pages
│   ├── certificates/
│   │   └── page.tsx             # Certificates page route
│   ├── experience/
│   │   └── page.tsx             # Experience page route
│   ├── projects/
│   │   └── page.tsx             # Projects page route
│   ├── globals.css              # Global styles and Tailwind imports
│   ├── layout.tsx               # Root layout component
│   ├── not-found.tsx            # 404 error page
│   ├── page.tsx                 # Home page (main entry point)
│   └── page-backup.tsx          # Backup version of main page
├── components/                   # Reusable React components
│   ├── views/                   # Page-specific view components
│   │   ├── AboutView.tsx        # About section content
│   │   ├── CertificatesView.tsx # Certificates display
│   │   ├── ContactView.tsx      # Contact form/info
│   │   ├── ExperienceView.tsx   # Work experience timeline
│   │   └── ProjectsView.tsx     # Projects gallery
│   ├── AnimatedNavbar.tsx       # Scroll-triggered navbar
│   ├── Button.tsx               # Reusable button component
│   ├── Card.tsx                 # Generic card wrapper
│   ├── ChatIntro.tsx            # Chat-style introduction
│   ├── ChatNavbar.tsx           # Chat interface navbar
│   ├── ChatProfile.tsx          # Profile component for chat
│   ├── ChatWindow.tsx           # Chat interface window
│   ├── CommandInterface.tsx     # Terminal-style command input
│   ├── DynamicContentManager.tsx # Content switching logic
│   ├── Hero.tsx                 # Landing hero section
│   ├── JobCard.tsx              # Individual job experience card
│   ├── MainContent.tsx          # Main content wrapper
│   ├── Navbar.tsx               # Standard navigation bar
│   ├── ScrollBasedContent.tsx   # Scroll-driven content system
│   ├── Section.tsx              # Generic section wrapper
│   ├── Sidebar.tsx              # Collapsible navigation sidebar
│   ├── SkillTag.tsx             # Individual skill badge
│   ├── SkillTooltip.tsx         # Skill hover information
│   ├── SkillTooltipContent.tsx  # Tooltip content component
│   ├── ThemeProvider.tsx        # Theme context provider
│   └── ThemeToggle.tsx          # Dark/light mode switch
├── data/                        # JSON data files
│   ├── certificates.json       # Certifications data
│   ├── intro.json              # Personal introduction
│   ├── jobs.json               # Work experience data
│   ├── layout.json             # Layout configuration
│   ├── page.json               # Page metadata
│   ├── projects.json           # Legacy projects data
│   └── projects_new.json       # Updated projects data
├── public/                     # Static assets
│   ├── Cerificates/           # PDF certificate files
│   ├── certificate_thumbnails/ # Certificate preview images
│   ├── projects/              # Project-related assets
│   ├── email.svg              # Email icon
│   ├── github.svg             # GitHub icon
│   ├── linkedin.svg           # LinkedIn icon
│   ├── resume.pdf             # Resume document
│   └── vercel.svg             # Vercel logo
├── src/                       # Additional source files
│   ├── components/ui/         # Legacy UI components
│   └── styles/               # Style utilities
├── types/                     # TypeScript type definitions
│   └── interfaces.ts          # Shared interface definitions
├── utils/                     # Utility functions
│   └── loadJson.ts           # JSON data loader utility
├── .eslintrc.json            # ESLint configuration
├── .gitignore                # Git ignore rules
├── eslint.config.mjs         # Modern ESLint config
├── middleware.ts             # Next.js middleware
├── next.config.js            # Next.js configuration
├── package.json              # Dependencies and scripts
├── postcss.config.js         # PostCSS configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## Core Architecture

### App Router Structure

The application uses Next.js 14's App Router with the following routing structure:

- `/` - Home page with scroll-based content
- `/projects` - Projects showcase
- `/experience` - Work experience timeline
- `/certificates` - Certifications gallery

### Component Architecture

The application follows a hierarchical component structure:

```
App Layout (layout.tsx)
├── ThemeProvider
├── Sidebar (global navigation)
├── Main Content Area
│   ├── ScrollBasedContent (home page)
│   │   ├── Hero Section
│   │   ├── Dynamic Views (About, Projects, Experience, etc.)
│   │   └── AnimatedNavbar (scroll-triggered)
│   └── Page-specific content
└── Footer
```

## File Contents & Logic Flow

### Core Application Files

#### `app/layout.tsx`

```typescript
// Root layout component - wraps entire application
// Provides:
// - Theme management
// - Global sidebar
// - Font loading (Inter)
// - Metadata configuration
// - Theme detection script
```

The layout:

1. Loads configuration from `data/layout.json`
2. Sets up theme detection script for SSR compatibility
3. Provides sidebar navigation with social links
4. Renders main content area with responsive classes
5. Includes footer with social media links

#### `app/page.tsx`

```typescript
// Home page entry point
// Features:
// - Dynamic imports for client-side components
// - JSON data loading for all content types
// - Scroll-based content system
```

Flow:

1. Loads data from JSON files using `loadJson` utility
2. Dynamically imports `ScrollBasedContent` (client-side only)
3. Passes all data to the scroll-based content system

#### `components/ScrollBasedContent.tsx`

This is the main content orchestrator:

```typescript
// Primary content management system
// Handles:
// - Scroll-triggered view changes
// - Dynamic content rendering
// - Navigation state management
// - Mobile responsiveness
```

Logic Flow:

1. **Initialization**: Sets up scroll listeners and view state
2. **View Management**: Tracks current view based on scroll position
3. **Content Rendering**: Dynamically renders different sections
4. **Navigation**: Integrates with animated navbar and sidebar

#### `components/Sidebar.tsx`

Global navigation component with advanced state management:

```typescript
// Features:
// - Event-driven state management
// - Outside click detection
// - Keyboard accessibility
// - Mobile-responsive design
// - Global event API for external control
```

State Management:

- Uses React useState for local state
- Exposes global event listeners (`sidebar:open`, `sidebar:close`, `sidebar:toggle`)
- Broadcasts state changes via `sidebar:state` events
- Handles outside click detection with proper event handling

#### `components/DynamicContentManager.tsx`

Content switching system with command interface:

```typescript
// Manages:
// - View state transitions
// - Command-based navigation
// - Content rendering based on view type
// - Integration with other navigation systems
```

### View Components

Each view component (`AboutView`, `ProjectsView`, etc.) follows this pattern:

1. **Props Interface**: Defines expected data structure
2. **Data Processing**: Transforms raw JSON data for display
3. **Responsive Layout**: Mobile-first design with Tailwind classes
4. **Interactive Elements**: Hover states, animations, and transitions

#### `components/views/ProjectsView.tsx`

```typescript
// Project showcase with:
// - Grid layout (responsive)
// - Individual project cards
// - Technology tag display
// - External link handling
// - Thumbnail loading with fallbacks
```

#### `components/views/ExperienceView.tsx`

```typescript
// Timeline-based experience display:
// - JobCard components for each position
// - Chronological ordering
// - Skill highlighting
// - Responsive card layout
```

### Utility Components

#### `components/CommandInterface.tsx`

Terminal-style navigation interface:

```typescript
// Features:
// - Command parsing and validation
// - Auto-completion suggestions
// - View switching via commands
// - Error handling and feedback
```

Commands supported:

- `home` - Navigate to home view
- `projects` - Show projects
- `experience` - Show experience
- `certificates` - Show certificates
- `contact` - Show contact information
- `clear` - Clear command history

#### `components/ThemeProvider.tsx`

Theme management system:

```typescript
// Provides:
// - Theme context for entire app
// - System preference detection
// - Local storage persistence
// - SSR-safe theme loading
```

## Data Flow

### JSON Data Structure

#### `data/intro.json`

```json
{
  "name": "Aditya Raj",
  "title": "Data Scientist & ML Engineer",
  "description": "...",
  "socialLinks": {
    "email": "...",
    "github": "...",
    "linkedin": "..."
  },
  "stats": [...],
  "skills": [...],
  "currentFocus": [...]
}
```

#### `data/projects_new.json`

```json
[
  {
    "id": "unique-project-id",
    "title": "Project Name",
    "description": "Project description",
    "technologies": ["Tech1", "Tech2"],
    "githubUrl": "...",
    "liveUrl": "...",
    "thumbnail": "/projects/project/thumbnail.svg",
    "featured": true
  }
]
```

#### `data/jobs.json`

```json
[
  {
    "id": "job-id",
    "company": "Company Name",
    "position": "Job Title",
    "duration": "Date Range",
    "description": "Job description",
    "technologies": ["Tech1", "Tech2"],
    "achievements": [...]
  }
]
```

### Data Loading Flow

1. **Build Time**: JSON files are loaded server-side
2. **Runtime**: Data is passed as props through component hierarchy
3. **Client Side**: Dynamic imports ensure optimal loading
4. **Caching**: Next.js automatically caches static JSON data

## Component Hierarchy

```
RootLayout
├── ThemeProvider
│   └── Theme Context
├── Sidebar
│   ├── Navigation Links
│   ├── Social Links
│   ├── Theme Toggle
│   └── Resume Download
├── Main Content
│   ├── ScrollBasedContent (Home)
│   │   ├── Hero Section
│   │   │   ├── Personal Info
│   │   │   ├── Stats Counter
│   │   │   └── Skills Display
│   │   ├── DynamicContentManager
│   │   │   ├── CommandInterface
│   │   │   ├── AboutView
│   │   │   ├── ProjectsView
│   │   │   ├── ExperienceView
│   │   │   ├── CertificatesView
│   │   │   └── ContactView
│   │   └── AnimatedNavbar
│   └── Page Routes
│       ├── Projects Page
│       ├── Experience Page
│       └── Certificates Page
└── Footer
    └── Social Links
```

## State Management

### Local State (React Hooks)

- **Theme State**: Managed by ThemeProvider context
- **Sidebar State**: Local useState with global event integration
- **Scroll State**: Tracked in ScrollBasedContent
- **View State**: Managed by DynamicContentManager
- **Command State**: Local to CommandInterface

### Global Event System

Custom event-driven communication for sidebar control:

```typescript
// Event Types
'sidebar:open'    // Opens sidebar
'sidebar:close'   // Closes sidebar  
'sidebar:toggle'  // Toggles current state
'sidebar:state'   // Broadcasts current state
```

Usage:

```typescript
// Trigger events
window.dispatchEvent(new Event('sidebar:toggle'));

// Listen for state changes
window.addEventListener('sidebar:state', (e) => {
  console.log('Sidebar is now:', e.detail.isOpen);
});
```

## Styling & Theming

### Tailwind CSS Configuration

- **Custom Colors**: Extended palette for brand consistency
- **Responsive Design**: Mobile-first breakpoint system
- **Dark Mode**: Class-based theme switching
- **Typography**: Custom font scaling and line heights

### Theme System

```typescript
// Theme values
type Theme = 'light' | 'dark' | 'system';

// Theme detection priority:
// 1. User preference (localStorage)
// 2. System preference (prefers-color-scheme)
// 3. Default to light mode
```

### CSS Architecture

```css
/* Global styles */
@tailwind base;
@tailwind components; 
@tailwind utilities;

/* Custom components */
.navbar-blur { /* Backdrop blur effect */ }
.skill-tag { /* Skill badge styling */ }
.project-card { /* Project card animations */ }

/* Responsive fixes */
@media (max-width: 768px) {
  /* Mobile-specific overrides */
}
```

## Configuration Files

### `next.config.js`

```javascript
// Next.js configuration
module.exports = {
  images: {
    // External image domains
    domains: ['avatars.githubusercontent.com']
  },
  // Other optimizations
}
```

### `tailwind.config.js`

```javascript
// Tailwind customization
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // Custom theme extensions
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')
  ]
}
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/styles/*": ["./src/styles/*"]
    }
  }
}
```

## Build & Deployment

### Development Workflow

1. **Start dev server**: `npm run dev`
2. **Linting**: `npm run lint`
3. **Type checking**: `npx tsc --noEmit`
4. **Build**: `npm run build`

### Production Build

- **Static Generation**: Pages are pre-rendered at build time
- **Image Optimization**: Next.js Image component with automatic optimization
- **Code Splitting**: Automatic bundle splitting for optimal loading
- **CSS Optimization**: Tailwind purges unused styles

### Deployment Configuration

- **Platform**: Vercel (optimal for Next.js)
- **Environment Variables**: Configured in Vercel dashboard
- **Domain**: Custom domain with SSL
- **Analytics**: Built-in Vercel analytics

## Key Features Implementation

### Scroll-Based Navigation

```typescript
// Scroll listener with throttling
useEffect(() => {
  const handleScroll = () => {
    const scrolled = window.scrollY > window.innerHeight * 0.8;
    if (scrolled !== isScrolled) {
      setIsScrolled(scrolled);
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, [isScrolled]);
```

### Command Interface

```typescript
// Command parsing and execution
const executeCommand = (cmd: string) => {
  const command = cmd.toLowerCase().trim();
  
  switch (command) {
    case 'home':
      onViewChange?.('home');
      break;
    case 'projects':
      onViewChange?.('projects');
      break;
    // ... other commands
    default:
      setError('Command not found. Type "help" for available commands.');
  }
};
```

### Responsive Sidebar

```typescript
// Outside click detection
useEffect(() => {
  const handleDocumentClick = (event: MouseEvent) => {
    if (!isOpen) return;
    const target = event.target as Node;
    const sidebar = document.getElementById('sidebar');
    const toggleButtons = Array.from(document.querySelectorAll('[data-sidebar-toggle]'));
    
    if (sidebar?.contains(target)) return;
    if (toggleButtons.some(btn => btn.contains(target))) return;
    
    setIsOpen(false);
  };
  
  document.addEventListener('click', handleDocumentClick);
  return () => document.removeEventListener('click', handleDocumentClick);
}, [isOpen]);
```

### Theme Persistence

```typescript
// SSR-safe theme detection
const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('theme') || 'system';
      var actualTheme = theme;
      
      if (theme === 'system') {
        actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      
      document.documentElement.classList.add(actualTheme);
    } catch (e) {
      document.documentElement.classList.add('light');
    }
  })();
`;
```

This documentation provides a comprehensive overview of the portfolio project's architecture, implementation details, and data flow. Each component and feature is designed to work cohesively while maintaining clean separation of concerns and optimal performance.
