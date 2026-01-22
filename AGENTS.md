# AGENTS.md - NanoGen (Gemini Canvas App)

## Project Overview

NanoGen is a React-based AI image generator application designed to run on **Gemini Canvas**. It uses Google's Gemini 2.5 Flash Image Preview model to generate images from text prompts with multiple specialized tools (prompt extraction, virtual try-on, product photography, video script generation, and video frame generation).

## Build, Lint & Test Commands

```bash
# Development
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)

# Build
npm run build        # Type check + build for production
tsc                  # Type check only (no build)

# Preview
npm run preview      # Preview production build locally

# Note: No test framework currently configured
# Note: No linting tools (ESLint/Prettier) currently configured
```

## CRITICAL: Single-File Architecture

**All modifications must be made to `App.jsx` only.**

Gemini Canvas only processes the `App.jsx` file. Other files exist solely for local development.

**When making changes:**
- ✅ **DO**: Edit `App.jsx`
- ❌ **DO NOT**: Create new component files, split code into modules, or add new `.tsx`/`.ts` files
- ❌ **DO NOT**: Expect changes in other files to reflect in Gemini Canvas
- ⚠️ **API Key**: Line 291/347/510/568/661/808/958/1008 has `const apiKey = ""` - this is intentional. Gemini Canvas runtime injects the API key. Never hardcode API keys.

## Code Style Guidelines

### File Organization & Imports

```javascript
// 1. React core imports first
import React, { useState, useRef, useEffect } from 'react';

// 2. External libraries (icons, etc.)
import { Sparkles, Image, AlertCircle, Download, Loader2 } from 'lucide-react';

// 3. Local imports (if any - avoid for Canvas deployment)
// import { helper } from './utils'; // ❌ Don't do this for Canvas

// 4. Component definition
const App = () => { /* ... */ };
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `App`, `SelectField`, `UploadField` |
| Functions | camelCase | `generateImages`, `handleImageUpload`, `buildEnhancedPrompt` |
| React Hooks | camelCase with `use` prefix | `useState`, `useRef`, `useEffect` |
| Constants | SCREAMING_SNAKE_CASE | `IMAGE_COUNT`, `API_URL` |
| Event Handlers | camelCase with `handle` prefix | `handleDrop`, `handleDragEnter` |
| Boolean vars | camelCase with `is/has/should` | `isLoading`, `isDragging`, `isMobile` |
| CSS classes | kebab-case or Tailwind | `brutalCard`, `brutal-btn` |

### TypeScript Usage

- Project uses **JSX** for main component (not TSX) to maintain Gemini Canvas compatibility
- Type checking configured in `tsconfig.json` with strict mode enabled
- Use optional chaining (`?.`) and nullish coalescing (`??`) for safe property access
- Prefer explicit type annotations for complex objects

```javascript
// ✅ Good: Safe property access
const textPart = result.candidates?.[0]?.content?.parts?.find(p => p.text);

// ✅ Good: Type-safe file handling
const file = e.target.files?.[0];
if (!file) return;
```

### Formatting Standards

**Indentation**: 2 spaces (not tabs)
**Line Length**: Reasonable (no strict limit, but keep readable)
**Quotes**: Single quotes for strings, backticks for templates
**Semicolons**: Yes, always use semicolons
**Trailing Commas**: Use in arrays/objects for cleaner diffs

```javascript
// ✅ Good
const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
];

// ❌ Bad
const options = [
  {value: "option1", label: "Option 1"},
  {value: "option2", label: "Option 2"}
]
```

### Component Patterns

**State Management**: Use React hooks (`useState`, `useRef`, `useEffect`)
**Component Structure**: Inline components within `App` (no separate files)

```javascript
// ✅ Good: Inline component for reusability
const SelectField = ({ label, value, onChange, options, className = '' }) => (
  <div className={`space-y-1 ${className}`}>
    {/* Component JSX */}
  </div>
);

// Inside App component:
const App = () => {
  const [state, setState] = useState(initialValue);
  
  // Helper functions
  const helperFunction = () => { /* ... */ };
  
  // Event handlers
  const handleEvent = () => { /* ... */ };
  
  // Render
  return <div>{/* JSX */}</div>;
};
```

### Error Handling

**User-Facing Errors**: Always in Indonesian
**Console Errors**: Can be in English
**Retry Logic**: Use exponential backoff (see `fetchWithRetry`)

```javascript
// ✅ Good: Retry logic with exponential backoff
const fetchWithRetry = async (retries = 2) => {
  try {
    const res = await fetch(url, { method: 'POST', headers, body });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res;
  } catch (e) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, 1000 * (3 - retries))); // Exponential backoff
      return fetchWithRetry(retries - 1);
    }
    throw e;
  }
};

// ✅ Good: User-facing error messages in Indonesian
setError('Gagal membuat gambar. Silakan coba lagi.');

// ✅ Good: Console errors can be in English
console.error('Failed to generate image', err);
```

## Design System

### Language Rules

**UI Text**: Indonesian (Bahasa Indonesia)
**Code**: English only (variables, functions, comments)

```javascript
// ✅ Correct
const [isLoading, setIsLoading] = useState(false);
<button>{isLoading ? 'Memproses...' : 'Buat Gambar'}</button>

// ❌ Wrong: English UI text
<button>{isLoading ? 'Processing...' : 'Generate Image'}</button>

// ❌ Wrong: Indonesian code
const [sedangMemuat, setSedangMemuat] = useState(false);
```

### Tailwind CSS Patterns (Neobrutalism/Brutal Design)

**Always refer to `styles.json` for the design system!**

```javascript
// Predefined brutal design classes (lines 1092-1095)
const brutalCard = "bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] rounded-xl";
const brutalBtn = "border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000000] active:translate-y-[0px] active:shadow-[2px_2px_0px_0px_#000000] transition-all font-bold uppercase";
const brutalInput = "w-full bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] focus:shadow-[4px_4px_0px_0px_#000000] outline-none transition-all p-4";
const brutalSelect = "w-full bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] focus:shadow-[4px_4px_0px_0px_#000000] outline-none transition-all p-3";
```

**Key Design Principles**:
- Bold 2px black borders (`border-2 border-black`)
- Hard shadows with offset (`shadow-[4px_4px_0px_0px_#000000]`)
- Uppercase text for emphasis (`uppercase`, `font-bold`)
- Mobile-first responsive design (base styles for mobile, then `md:`, `lg:` prefixes)

### Mobile-First Approach

```javascript
// ✅ Good: Mobile-first, then enhance for larger screens
<div className="px-4 py-2 md:px-8 md:py-4 lg:px-12">
  <button className="w-full md:w-auto">Click me</button>
</div>

// ✅ Good: Conditional mobile detection
const [isMobile, setIsMobile] = useState(false);
useEffect(() => {
  const checkMobile = () => setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);
```

## API Integration

### Gemini API Endpoints

```javascript
// Image Generation
const imageGenUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`;

// Text/Vision Analysis
const textGenUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
```

### Request Payload Structure

```javascript
// Image generation with text prompt
const payload = {
  contents: [{ 
    parts: [
      { text: promptText },
      // Optional: inline_data for image inputs
      { inline_data: { mime_type: 'image/png', data: base64Data } }
    ] 
  }],
  generationConfig: { 
    responseModalities: ["IMAGE"],
    imageGenerationConfig: { aspectRatio: '16:9' } // Optional
  }
};

// Text generation
const payload = {
  contents: [{ 
    parts: [{ text: promptText }] 
  }]
};
```

### Response Parsing

```javascript
// Image response
const imagePart = result.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;

// Text response
const textPart = result.candidates?.[0]?.content?.parts?.find(p => p.text);
const text = textPart?.text;
```

## Common Tasks

### Adding New Features to App.jsx

1. Add state variables at top of `App` component
2. Add UI elements within existing `brutalCard` structure
3. Maintain brutal design system classes
4. Keep all text in Indonesian

### Adding New Tool to Toolbar

```javascript
// 1. Add to tools array (line 18-25)
const tools = [
  { id: 'new-tool', name: 'Nama Tool', icon: <IconName size={20} />, desc: 'Deskripsi' },
];

// 2. Add case in renderToolContent() switch statement
case 'new-tool':
  return <div>{/* Tool UI */}</div>;
```

### Modifying Image Generation

Edit the `generateImages()` function (line 560+):
- Modify `buildEnhancedPrompt()` to change prompt building logic
- Update `generationConfig` to change aspect ratio/modalities
- Adjust retry logic in `fetchWithRetry()`

### File Upload Handling

Use the `handleImageUpload()` pattern (line 199+):
- Validate file type: `['image/jpeg', 'image/png', 'image/webp']`
- Max size: `4 * 1024 * 1024` (4MB)
- Convert to base64: `FileReader.readAsDataURL()`
- Store in state: `{ base64, mimeType, preview: dataUrl }`

## Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| JSX/TypeScript | Component syntax |
| Tailwind CSS | Styling (neobrutalism design) |
| Lucide React | Icons |
| Vite | Build tool (local dev only) |

## References

- **Design System**: Always check `styles.json` for color palette, typography, and effects
- **Indonesian Translations**: See existing UI text for common phrases
- **Gemini API Docs**: https://ai.google.dev/gemini-api/docs
