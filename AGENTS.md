# AGENTS.md - NanoGen (Gemini Canvas App)

## Project Overview

NanoGen is a React-based AI image generator application designed to run on **Gemini Canvas**. It uses Google's Gemini 2.5 Flash Image Preview model to generate images from text prompts.

## IMPORTANT: Single-File Architecture

**All modifications must be made to `App.tsx` only.**

This app runs inside Gemini Canvas, which only processes the `App.tsx` file. The other files (`main.tsx`, `index.html`, config files, etc.) exist solely for local development and testing purposes.

When making changes:
- **DO**: Edit `App.tsx`
- **DO NOT**: Create new component files, split code into modules, or add new `.tsx`/`.ts` files
- **DO NOT**: Expect changes in other files to reflect in Gemini Canvas

## Key Architecture Notes

### Gemini Canvas Integration

- **API Key Injection**: The API key in `App.tsx:18` is intentionally empty (`const apiKey = ""`). Gemini Canvas runtime automatically injects the API key at runtime.
- **Do NOT** hardcode API keys or add environment variables for the key when modifying this app for Canvas deployment.
- **Single Entry Point**: Gemini Canvas reads and executes only `App.tsx`. All components, utilities, and logic must be contained within this single file.

### Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Lucide React | Icons |
| Vite | Build tool (local dev only) |

### File Structure

```
gemini-canvas/
├── App.tsx              # Main React component (Canvas entry point)
├── main.tsx             # React DOM entry (local dev only)
├── index.html           # HTML entry (local dev only)
├── index.css            # Tailwind CSS directives
├── styles.json          # Design system / style reference (ALWAYS refer to this for styling)
├── package.json         # Dependencies
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
├── tsconfig.json        # TypeScript configuration
└── AGENTS.md            # This file
```

## Design Approach

### Mobile-First Development

This project follows a **mobile-first approach**. When designing and implementing UI:

- **Start with mobile layouts** and progressively enhance for larger screens
- Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) to add styles for larger breakpoints
- Default styles (without prefix) should target mobile devices
- Test on mobile viewport sizes first before checking desktop
- Prioritize touch-friendly interactions (larger tap targets, appropriate spacing)

Example:
```tsx
// Mobile-first: base styles for mobile, then override for larger screens
<div className="px-4 py-2 md:px-8 md:py-4 lg:px-12">
  <button className="w-full md:w-auto">Click me</button>
</div>
```

### Language Guidelines

**Use Indonesian (Bahasa Indonesia) for all user-facing display text.**

- All UI labels, buttons, placeholders, error messages, and descriptions must be in Indonesian
- Keep all code (variable names, function names, comments, documentation) in English
- This ensures the app is accessible to Indonesian users while maintaining code readability

Examples:
```tsx
// ✅ Correct: Indonesian for display, English for code
const [isLoading, setIsLoading] = useState(false);
<button>{isLoading ? "Memproses..." : "Buat Gambar"}</button>
<p className="text-red-500">Terjadi kesalahan. Silakan coba lagi.</p>

// ❌ Incorrect: English for display text
<button>{isLoading ? "Processing..." : "Generate Image"}</button>

// ❌ Incorrect: Indonesian for code
const [sedangMemuat, setSedangMemuat] = useState(false);
```

Common Indonesian translations:
| English | Indonesian |
|---------|------------|
| Generate | Buat / Hasilkan |
| Download | Unduh |
| Loading | Memuat |
| Error | Kesalahan / Error |
| Submit | Kirim |
| Cancel | Batal |
| Prompt | Prompt / Deskripsi |
| Image | Gambar |
| Settings | Pengaturan |

## Code Guidelines

### When Modifying App.tsx

1. **Keep it single-file**: Gemini Canvas expects `App.tsx` as the main component. Avoid splitting into multiple files unless necessary.

2. **API Key**: Never modify line 18 (`const apiKey = ""`). The Canvas runtime handles injection.

3. **Styling**: Use Tailwind CSS utility classes. **ALWAYS refer to `styles.json` for the design system.** The app uses the Myco theme with:
   - Primary color: Warm orange/amber (#D97706) for CTAs and accents
   - Secondary color: Muted sage/forest green (#4A5D4A) for cards and containers
   - Background: Olive/moss green tones with gradient overlays
   - Text: Predominantly white on dark backgrounds
   - Typography: Playfair Display for headings, Inter for body text
   - Effects: Semi-transparent overlays with backdrop blur (glassmorphism)

   **Key style references from styles.json:**
   - Buttons: `background: linear-gradient(135deg, #D97706 0%, #B45309 100%)`
   - Cards: `background: rgba(74, 93, 74, 0.9)` with `backdrop-filter: blur(10px)`
   - Inputs: `background: rgba(80, 100, 80, 0.7)` with white/20 border
   - Focus states: Border color changes to #D97706

4. **State Management**: Uses React hooks (`useState`). Keep state minimal and local.

### API Integration

The app communicates with the Gemini API at:
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent
```

Request payload structure:
```javascript
{
  contents: [{ parts: [{ text: prompt }] }],
  generationConfig: { responseModalities: ["IMAGE"] }
}
```

Response parsing expects:
- `candidates[0].content.parts[].inlineData.data` (base64 image)
- `candidates[0].content.parts[].inlineData.mimeType`

### Error Handling

- Exponential backoff retry logic (3 retries, 1s initial delay, doubling each time)
- User-friendly error messages displayed in red alert box

## Local Development

To run locally (outside Gemini Canvas):

```bash
npm install
npm run dev
```

Note: Local development requires you to provide an API key. You can temporarily add one for testing, but **never commit it**.

## Testing Considerations

- Test with various prompt lengths (empty, short, very long)
- Test error states (network failure, API errors)
- Test loading states
- Test image download functionality
- Test responsive layout on mobile/tablet/desktop

## Common Tasks

### Adding New Features

1. Add state variables at the top of the `App` component
2. Add UI elements within the existing card structure
3. Maintain the existing color scheme and spacing

### Modifying the Prompt

To change how prompts are sent to the API, modify the `payload` object in `generateImage()` function (lines 21-30).

### Adding New UI Sections

Follow the existing pattern:
```tsx
{/* Section Name */}
<div className="space-y-3">
  {/* Content */}
</div>
```
